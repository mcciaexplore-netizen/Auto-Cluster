import type { EnquiryDepartment } from '@/lib/types'
import type { EnquiryInput } from '@/lib/validation'
import { getService } from '@/content/services'
import { generateUniqueReferenceCode } from './ids'
import { resolveRouting } from './routing'
import { findAll, findById, insert, transaction, update, type Stamped } from './store'
import { logAudit } from './audit'
import { can, canAccessEnquiryDepartment, type StaffUser } from './roles'
import { randomBytes } from 'node:crypto'

/**
 * Module 1 (Enquiry form), tied together: validated input in, a persisted,
 * routed, reference-numbered record out. Everything downstream — the API
 * route, the staff console, the follow-up cron — reads and writes through
 * this module rather than touching `store.ts` directly, so the shape of an
 * enquiry has exactly one definition.
 */

export const ENQUIRY_STATUSES = [
  'new',
  'assigned',
  'contacted',
  'quoted',
  'won',
  'lost',
  'spam',
] as const
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]

const COLLECTION = 'enquiries'
const FOLLOW_UP_AFTER_MS = 48 * 60 * 60 * 1000

export interface EnquiryRecord extends Stamped {
  referenceCode: string
  serviceId: string
  kind: EnquiryInput['kind']
  booking?: {
    accessToken: string
    status: 'requested' | 'approved' | 'declined'
    amountPaise: number | null
    checkoutUrl: string | null
    paidReference: string | null
  }
  department: EnquiryDepartment
  name: string
  company: string
  email: string
  phone: string
  subject: string
  message: string
  consentAt: string
  /** Kind-specific fields (partName/material/… or sampleDescription/…), untyped here — src/content/services.ts + validation.ts own the real shape. */
  fields: Record<string, string | boolean>
  cadFileToken: string | null
  resumeFileToken: string | null
  status: EnquiryStatus
  /** Optional for records created before named ownership was introduced. */
  assignedTo?: string | null
  assignedBy?: string | null
  assignedAt?: string | null
  routedTo: string
  needsRoutingReview: boolean
  source: string | null
  followUpDueAt: string
  followUpSentAt: string | null
}

function extraFields(input: EnquiryInput): Record<string, string | boolean> {
  switch (input.kind) {
    case 'venue':
      return {
        venueSlug: input.venueSlug, roomUse: input.roomUse,
        startsAt: input.startsAt, endsAt: input.endsAt,
        attendees: input.attendees, eventType: input.eventType,
        floorPlanRequested: input.floorPlanRequested,
        wifiRequired: input.wifiRequired, parkingRequired: input.parkingRequired,
      }
    case 'startup':
      return { startupName: input.startupName, stage: input.stage, supportNeeded: input.supportNeeded }
    case 'manufacturing':
      return {
        partName: input.partName,
        material: input.material,
        quantity: input.quantity,
        tolerance: input.tolerance || '',
        deliveryDate: input.deliveryDate,
      }
    case 'testing':
      return {
        sampleDescription: input.sampleDescription,
        standardOrTest: input.standardOrTest,
        sampleCount: input.sampleCount,
        nablScope: input.nablScope,
      }
    case 'careers':
      return {
        applicantType: input.applicantType,
        position: input.position,
        education: input.education || '',
      }
    case 'general':
      return {}
  }
}

export async function createEnquiry(
  input: EnquiryInput,
  meta: { source: string | null },
): Promise<EnquiryRecord> {
  const service = getService(input.serviceId)
  if (!service) throw new Error(`Unknown service id: ${input.serviceId}`)

  const { email: routedTo, needsReview } = await resolveRouting(input.serviceId)
  const referenceCode = await generateUniqueReferenceCode<EnquiryRecord>(
    'AC',
    COLLECTION,
    'referenceCode',
  )
  const now = Date.now()

  const record = await insert<EnquiryRecord>(COLLECTION, {
    referenceCode,
    serviceId: input.serviceId,
    kind: input.kind,
    department: service.department,
    name: input.name,
    company: input.company || '',
    email: input.email,
    phone: input.phone,
    subject: input.subject || '',
    message: input.message,
    consentAt: new Date(now).toISOString(),
    fields: extraFields(input),
    cadFileToken: 'cadFileToken' in input ? input.cadFileToken || null : null,
    resumeFileToken: 'resumeFileToken' in input ? input.resumeFileToken || null : null,
    status: 'new',
    assignedTo: null,
    assignedBy: null,
    assignedAt: null,
    routedTo,
    needsRoutingReview: needsReview,
    source: meta.source,
    followUpDueAt: new Date(now + FOLLOW_UP_AFTER_MS).toISOString(),
    followUpSentAt: null,
    ...(input.kind === 'venue' && { booking: {
      accessToken: randomBytes(32).toString('hex'), status: 'requested' as const,
      amountPaise: null, checkoutUrl: null, paidReference: null,
    } }),
  })

  await logAudit({
    action: 'enquiry.created',
    actorId: null,
    actorEmail: null,
    actorRole: null,
    targetCollection: COLLECTION,
    targetId: record.id,
    summary: `Enquiry ${referenceCode} received (${service.label})${needsReview ? ' — no routing mapped, sent to fallback' : ''}.`,
  })

  return record
}

export type StaffEnquiry = EnquiryRecord & {
  owner: Pick<StaffUser, 'id' | 'name' | 'active'> | null
}

async function withOwners(records: EnquiryRecord[]): Promise<StaffEnquiry[]> {
  const users = new Map((await findAll<StaffUser>('staff-users')).map((u) => [u.id, u]))
  return records.map((record) => {
    const owner = record.assignedTo ? users.get(record.assignedTo) : undefined
    return { ...record, owner: owner ? { id: owner.id, name: owner.name, active: owner.active } : null }
  })
}

export async function getEnquiry(id: string, actor: StaffUser): Promise<StaffEnquiry | undefined> {
  const record = await findById<EnquiryRecord>(COLLECTION, id)
  if (!record || !canAccessEnquiryDepartment(actor, record.department)) return undefined
  return (await withOwners([record]))[0]
}

export interface EnquiryFilters {
  query?: string
  status?: EnquiryStatus
  department?: EnquiryDepartment
  ownership?: 'all' | 'mine' | 'unassigned'
  needsRoutingReview?: boolean
}

/** Always apply the actor's access scope before user-selected filters. */
export async function listEnquiries(actor: StaffUser, filters: EnquiryFilters = {}): Promise<StaffEnquiry[]> {
  if (!actor.active || !can(actor, 'enquiries:view')) throw new Error('You do not have permission to view enquiries.')
  const all = await findAll<EnquiryRecord>(COLLECTION)
  const query = filters.query?.trim().slice(0, 120).toLowerCase()
  const scoped = all.filter((e) => canAccessEnquiryDepartment(actor, e.department))
    .filter((e) => !filters.status || e.status === filters.status)
    .filter((e) => !filters.department || e.department === filters.department)
    .filter((e) => filters.ownership !== 'mine' || e.assignedTo === actor.id)
    .filter((e) => filters.ownership !== 'unassigned' || !e.assignedTo)
    .filter((e) => !filters.needsRoutingReview || e.needsRoutingReview)
    .filter((e) => !query || [e.referenceCode, e.name, e.company, e.email, e.phone, e.subject, getService(e.serviceId)?.label].some((v) => v?.toLowerCase().includes(query)))
  return withOwners(scoped.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
}

export async function listEnquiryAssignees(id: string, actor: StaffUser) {
  const enquiry = await getEnquiry(id, actor)
  if (!enquiry || !can(actor, 'enquiries:assign')) return []
  return (await findAll<StaffUser>('staff-users'))
    .filter((u) => canAccessEnquiryDepartment(u, enquiry.department))
    .map((u) => ({ id: u.id, name: u.name, role: u.role }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function assignEnquiry(
  id: string,
  assigneeId: string | null,
  actor: StaffUser,
  expectedAssigneeId: string | null,
): Promise<EnquiryRecord> {
  if (!actor.active || !can(actor, 'enquiries:assign')) throw new Error('You do not have permission to assign enquiries.')
  const assignee = assigneeId ? await findById<StaffUser>('staff-users', assigneeId) : undefined
  const change = await transaction<EnquiryRecord, { record: EnquiryRecord; previous: string | null }>(COLLECTION, (records) => {
    const before = records.find((e) => e.id === id)
    if (!before || !canAccessEnquiryDepartment(actor, before.department)) throw new Error('Enquiry not found or access denied.')
    if (assigneeId && (!assignee || !canAccessEnquiryDepartment(assignee, before.department))) throw new Error('Choose an active staff member with access to this department.')
    if ((before.assignedTo ?? null) !== expectedAssigneeId) throw new Error('The owner changed while this page was open. Refresh the page and try again.')
    if ((before.assignedTo ?? null) === assigneeId) return { records, result: { record: before, previous: before.assignedTo ?? null } }
    const now = new Date().toISOString()
    const status = before.status === 'new' && assigneeId ? 'assigned' : before.status === 'assigned' && !assigneeId ? 'new' : before.status
    const record: EnquiryRecord = { ...before, assignedTo: assigneeId, assignedBy: actor.id, assignedAt: now, status, updatedAt: now }
    return { records: records.map((e) => e.id === id ? record : e), result: { record, previous: before.assignedTo ?? null } }
  })
  if (change.previous !== assigneeId) await logAudit({
    action: 'enquiry.assigned', actorId: actor.id, actorEmail: actor.email, actorRole: actor.role,
    targetCollection: COLLECTION, targetId: id,
    summary: `${change.record.referenceCode}: ${assignee ? `assigned to ${assignee.name}` : 'owner cleared'}; status is "${change.record.status}".`,
    metadata: { previousAssigneeId: change.previous, assigneeId },
  })
  return change.record
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  actor: StaffUser,
  expectedStatus: EnquiryStatus,
): Promise<EnquiryRecord> {
  if (!actor.active || !can(actor, 'enquiries:update-status')) throw new Error('You do not have permission to update enquiry status.')
  if (!ENQUIRY_STATUSES.includes(status)) throw new Error('Choose a valid enquiry status.')
  const change = await transaction<EnquiryRecord, { record: EnquiryRecord; previous: EnquiryStatus }>(COLLECTION, (records) => {
    const before = records.find((e) => e.id === id)
    if (!before || !canAccessEnquiryDepartment(actor, before.department)) throw new Error('Enquiry not found or access denied.')
    if (before.status !== expectedStatus) throw new Error('The status changed while this page was open. Refresh the page and try again.')
    if (status === 'assigned' && !before.assignedTo) throw new Error('Assign an owner before choosing Assigned.')
    if (before.status === status) return { records, result: { record: before, previous: before.status } }
    const record = { ...before, status, updatedAt: new Date().toISOString() }
    return { records: records.map((e) => e.id === id ? record : e), result: { record, previous: before.status } }
  })

  if (change.previous !== status) await logAudit({
    action: 'enquiry.status-changed',
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    targetCollection: COLLECTION,
    targetId: id,
    summary: `Status changed from "${change.previous}" to "${status}" on ${change.record.referenceCode}.`,
  })

  return change.record
}

/** New, untouched, and past their 48-hour window — the cron route's worklist. */
export async function enquiriesDueForFollowUp(): Promise<EnquiryRecord[]> {
  const all = await findAll<EnquiryRecord>(COLLECTION)
  const now = Date.now()
  return all.filter(
    (e) => e.status === 'new' && !e.followUpSentAt && new Date(e.followUpDueAt).getTime() <= now,
  )
}

export async function markFollowUpSent(id: string): Promise<void> {
  await update<EnquiryRecord>(COLLECTION, id, { followUpSentAt: new Date().toISOString() })
}
