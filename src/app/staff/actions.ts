'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { findOne } from '@/server/store'
import type { StaffUser } from '@/server/roles'
import { can } from '@/server/roles'
import { verifyPassword, sessionCookie, clearedSessionCookie, getStaffSession } from '@/server/auth'
import { logAudit } from '@/server/audit'
import { ENQUIRY_STATUSES, getEnquiry, updateEnquiryStatus, type EnquiryStatus } from '@/server/enquiries'
import { updateRouting } from '@/server/routing'

export interface LoginState {
  error?: string
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const user = await findOne<StaffUser>('staff-users', (u) => u.email.toLowerCase() === email)
  const valid = user?.active && (await verifyPassword(password, user.passwordHash, user.passwordSalt))

  if (!valid || !user) {
    await logAudit({
      action: 'staff.login-failed',
      actorId: null,
      actorEmail: email || null,
      actorRole: null,
      targetCollection: 'staff-users',
      targetId: user?.id ?? 'unknown',
      summary: `Failed sign-in attempt for ${email || '(empty)'}.`,
    })
    return { error: 'Incorrect email or password.' }
  }

  const jar = await cookies()
  const cookie = sessionCookie(user.id)
  jar.set(cookie.name, cookie.value, cookie.options)

  await logAudit({
    action: 'staff.login',
    actorId: user.id,
    actorEmail: user.email,
    actorRole: user.role,
    targetCollection: 'staff-users',
    targetId: user.id,
    summary: `${user.email} signed in.`,
  })

  redirect('/staff/enquiries')
}

export async function logoutAction() {
  const jar = await cookies()
  const cleared = clearedSessionCookie()
  jar.set(cleared.name, cleared.value, cleared.options)
  redirect('/staff/login')
}

export async function updateStatusAction(formData: FormData) {
  const actor = await getStaffSession()
  if (!actor || !can(actor, 'enquiries:update-status')) redirect('/staff')

  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '') as EnquiryStatus
  if (!ENQUIRY_STATUSES.includes(status)) return

  // A HOD may only move their own department's enquiries — checked here,
  // not just hidden in the UI, since a form POST can be replayed with any id.
  if (actor.role === 'hod') {
    const target = await getEnquiry(id)
    if (!target || target.department !== actor.department) redirect('/staff')
  }

  await updateEnquiryStatus(id, status, actor)
  revalidatePath('/staff/enquiries')
  revalidatePath(`/staff/enquiries/${id}`)
}

export async function updateRoutingAction(formData: FormData) {
  const actor = await getStaffSession()
  if (!actor || !can(actor, 'routing-map:edit')) redirect('/staff')

  const serviceId = String(formData.get('serviceId') ?? '')
  const email = String(formData.get('email') ?? '').trim()
  if (!serviceId || !email) return

  await updateRouting(serviceId, email, actor.id)

  await logAudit({
    action: 'routing-map.updated',
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    targetCollection: 'routing-map',
    targetId: serviceId,
    summary: `Routing for "${serviceId}" set to ${email}.`,
  })

  revalidatePath('/staff/settings/routing')
}
