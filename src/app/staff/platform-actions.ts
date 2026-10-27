'use server'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStaffSession, hashPassword } from '@/server/auth'
import { can, roles, type Action, type StaffUser } from '@/server/roles'
import { departments } from '@/lib/validation'
import { logAudit } from '@/server/audit'
import { transaction } from '@/server/store'
import { amountSchema, eventSchema, mediaSchema } from '@/lib/platform'
import { rateCatalogue, type FixedRate, type EventRecord, type MediaRecord } from '@/server/platform'
import { changeBooking } from '@/server/bookings'
import type { ActionState } from '@/components/StaffForm'
import { saveVenueDocument } from '@/server/venue-documents'

async function actorFor(permission: Action) {
  const actor = await getStaffSession()
  if (!actor || !can(actor, permission)) throw new Error('You do not have permission to make this change.')
  return actor
}
function failure(error: unknown): ActionState {
  if (error instanceof z.ZodError) return { error: error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' ') }
  return { error: error instanceof Error ? error.message : 'The change could not be saved.' }
}
export async function createStaffAccount(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await actorFor('staff:manage')
    const fields = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(200).transform((v) => v.toLowerCase()), password: z.string().min(12, 'Use at least 12 characters.').max(200), role: z.enum(roles as [typeof roles[number], ...typeof roles[number][]]), department: z.enum(departments) }).parse(Object.fromEntries(data))
    const password = await hashPassword(fields.password)
    const id = await transaction<StaffUser, string>('staff-users', (records) => {
      if (records.some((u) => u.email.toLowerCase() === fields.email)) throw new Error('A staff account already exists for this email.')
      const now = new Date().toISOString()
      const record: StaffUser = { id: randomUUID(), name: fields.name, email: fields.email, role: fields.role, department: fields.role === 'hod' ? fields.department : null, passwordHash: password.hash, passwordSalt: password.salt, active: true, createdAt: now, updatedAt: now }
      return { records: [...records, record], result: record.id }
    })
    await logAudit({ action: 'staff.created', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'staff-users', targetId: id, summary: `${fields.email} created with role ${fields.role}.` })
    revalidatePath('/staff/users')
    return { success: 'Staff account created. Share its credentials securely with the account holder.' }
  } catch (error) { return failure(error) }
}
export async function uploadVenueDocument(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await actorFor('bookings:approve')
    const document = await saveVenueDocument(String(data.get('venueSlug')), String(data.get('title')), String(data.get('kind')), data.get('file') as File, actor.id)
    await logAudit({ action: 'venue-document.uploaded', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'venue-documents', targetId: document.id, summary: `${document.title} uploaded privately for ${document.venueSlug}.` })
    revalidatePath('/staff/venues')
    return { success: 'Private document saved.' }
  } catch (error) { return failure(error) }
}
export async function saveRate(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await actorFor('rates:manage')
    const key = String(data.get('key'))
    if (!rateCatalogue.some((r) => r.key === key)) throw new Error('Unknown machine or venue.')
    const fields = z.object({ amount: amountSchema, unit: z.string().trim().min(2).max(100), effectiveFrom: z.string().date(), taxNote: z.string().trim().min(3).max(250) }).parse(Object.fromEntries(data))
    await transaction<FixedRate, void>('fixed-rates', (records) => {
      const existing = records.find((r) => r.key === key && r.effectiveFrom === fields.effectiveFrom)
      const now = new Date().toISOString()
      const record: FixedRate = { id: existing?.id ?? randomUUID(), createdAt: existing?.createdAt ?? now, updatedAt: now, key, amountPaise: fields.amount, unit: fields.unit, effectiveFrom: fields.effectiveFrom, taxNote: fields.taxNote, approvedBy: actor.id }
      return { records: [...records.filter((r) => r.id !== record.id), record], result: undefined }
    })
    await logAudit({ action: 'rate.published', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'fixed-rates', targetId: key, summary: `Fixed rate approved: ${key}, INR ${fields.amount / 100}, ${fields.unit}, effective ${fields.effectiveFrom}.` })
    revalidatePath('/', 'layout')
    return { success: 'Rate saved. It will be shown from its effective date.' }
  } catch (error) { return failure(error) }
}
export async function saveEvent(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await actorFor('events:manage')
    const fields = eventSchema.parse({ ...Object.fromEntries(data), published: data.get('published') === 'on', registrationOpen: data.get('registrationOpen') === 'on' })
    const id = String(data.get('id') ?? '')
    const savedId = await transaction<EventRecord, string>('events', (records) => {
      const before = records.find((r) => r.id === id)
      if (id && !before) throw new Error('Event not found.')
      if (records.some((e) => e.id !== id && e.slug === fields.slug)) throw new Error('That event URL is already in use.')
      if (before && before.slug !== fields.slug) throw new Error('An existing event URL cannot be changed. Its registration links must remain valid.')
      if (fields.capacity < (before?.registrations.length ?? 0)) throw new Error('Capacity cannot be smaller than existing registrations.')
      const now = new Date().toISOString()
      const record = { ...fields, id: before?.id ?? randomUUID(), registrations: before?.registrations ?? [], createdAt: before?.createdAt ?? now, updatedAt: now }
      return { records: [...records.filter((r) => r.id !== record.id), record], result: record.id }
    })
    await logAudit({ action: 'event.saved', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'events', targetId: savedId, summary: `${fields.title}: ${fields.published ? 'published' : 'draft'}.` })
    revalidatePath('/events', 'layout'); revalidatePath('/staff/events'); revalidatePath('/sitemap.xml')
    return { success: 'Event saved.' }
  } catch (error) { return failure(error) }
}
export async function saveMedia(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await actorFor('media:manage')
    const fields = mediaSchema.parse({ ...Object.fromEntries(data), published: data.get('published') === 'on' })
    const id = String(data.get('id') ?? '')
    const savedId = await transaction<MediaRecord, string>('media-library', (records) => {
      const before = records.find((r) => r.id === id)
      if (id && !before) throw new Error('Media item not found.')
      const now = new Date().toISOString()
      const record = { ...fields, id: before?.id ?? randomUUID(), createdAt: before?.createdAt ?? now, updatedAt: now }
      return { records: [...records.filter((r) => r.id !== record.id), record], result: record.id }
    })
    await logAudit({ action: 'media.saved', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'media-library', targetId: savedId, summary: `${fields.title}: ${fields.published ? 'published' : 'draft'}.` })
    revalidatePath('/media'); revalidatePath('/staff/media')
    return { success: 'Media item saved.' }
  } catch (error) { return failure(error) }
}
export async function reviewBooking(_state: ActionState, data: FormData): Promise<ActionState> {
  try {
    const actor = await getStaffSession()
    if (!actor) throw new Error('Sign in to continue.')
    const id = String(data.get('id'))
    const operation = String(data.get('operation'))
    const reference = await changeBooking(id, operation, data, actor)
    await logAudit({ action: operation === 'record-payment' ? 'payment.recorded' : 'booking.status-changed', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role, targetCollection: 'enquiries', targetId: id, summary: `${reference}: ${operation}.` })
    revalidatePath('/staff/bookings'); revalidatePath('/bookings', 'layout')
    return { success: 'Booking updated.' }
  } catch (error) { return failure(error) }
}
