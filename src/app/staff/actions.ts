'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { findOne } from '@/server/store'
import type { StaffUser } from '@/server/roles'
import { can } from '@/server/roles'
import { verifyPassword, sessionCookie, clearedSessionCookie, getStaffSession } from '@/server/auth'
import { logAudit } from '@/server/audit'
import { ENQUIRY_STATUSES, assignEnquiry, updateEnquiryStatus, type EnquiryStatus } from '@/server/enquiries'
import { updateRouting } from '@/server/routing'
import type { ActionState } from '@/components/StaffForm'

export interface LoginState {
  error?: string
}

/**
 * In-memory lockout. Fine for a single instance; replace with the database
 * once connected — see the identical caveat on the /api/enquiry limiter.
 *
 * Keyed on email AND on IP so neither a distributed credential-stuffing run
 * against one account nor a single attacker spraying many accounts slips
 * through by only tripping one of the two counters.
 */
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5
const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function loginRateLimited(key: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_LOGIN_ATTEMPTS
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const hdrs = await headers()
  const ip =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? hdrs.get('x-real-ip') ?? 'unknown'

  const limited = [loginRateLimited(`ip:${ip}`), email && loginRateLimited(`email:${email}`)].some(
    Boolean,
  )
  if (limited) {
    await logAudit({
      action: 'staff.login-rate-limited',
      actorId: null,
      actorEmail: email || null,
      actorRole: null,
      targetCollection: 'staff-users',
      targetId: 'unknown',
      summary: `Sign-in attempts for ${email || '(empty)'} throttled after repeated failures.`,
    })
    return { error: 'Too many sign-in attempts. Try again in a few minutes.' }
  }

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

  redirect('/staff')
}

export async function logoutAction() {
  const jar = await cookies()
  const cleared = clearedSessionCookie()
  jar.set(cleared.name, cleared.value, cleared.options)
  redirect('/staff/login')
}

export async function updateStatusAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const actor = await getStaffSession()
    if (!actor) throw new Error('Sign in to update this enquiry.')
    const id = String(formData.get('id') ?? '')
    const status = String(formData.get('status') ?? '') as EnquiryStatus
    const expectedStatus = String(formData.get('expectedStatus') ?? '') as EnquiryStatus
    if (!ENQUIRY_STATUSES.includes(status)) throw new Error('Choose a valid enquiry status.')
    await updateEnquiryStatus(id, status, actor, expectedStatus)
    revalidatePath('/staff/enquiries', 'layout')
    return { success: 'Enquiry status updated.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'The status could not be updated.' }
  }
}

export async function assignEnquiryAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const actor = await getStaffSession()
    if (!actor) throw new Error('Sign in to assign this enquiry.')
    const id = String(formData.get('id') ?? '')
    if (!formData.has('expectedAssigneeId')) throw new Error('Refresh this page before assigning an owner.')
    const assigneeId = String(formData.get('assigneeId') ?? '') || null
    const expectedAssigneeId = String(formData.get('expectedAssigneeId') ?? '') || null
    await assignEnquiry(id, assigneeId, actor, expectedAssigneeId)
    revalidatePath('/staff/enquiries', 'layout')
    return { success: assigneeId ? 'Enquiry owner updated.' : 'Enquiry returned to the unassigned queue.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'The owner could not be updated.' }
  }
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
