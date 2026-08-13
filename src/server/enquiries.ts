import type { EnquiryDepartment } from '@/lib/types'
import type { EnquiryInput } from '@/lib/validation'
import { getService } from '@/content/services'
import { generateUniqueReferenceCode } from './ids'
import { resolveRouting } from './routing'
import { findAll, findById, insert, update, type Stamped } from './store'
import { logAudit } from './audit'
import type { StaffUser } from './roles'

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
  kind: 'manufacturing' | 'testing' | 'general'
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
  status: EnquiryStatus
  routedTo: string
  needsRoutingReview: boolean
  source: string | null
  followUpDueAt: string
  followUpSentAt: string | null
}

function extraFields(input: EnquiryInput): Record<string, string | boolean> {
  switch (input.kind) {
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
    status: 'new',
    routedTo,
    needsRoutingReview: needsReview,
    source: meta.source,
    followUpDueAt: new Date(now + FOLLOW_UP_AFTER_MS).toISOString(),
    followUpSentAt: null,
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

export async function getEnquiry(id: string): Promise<EnquiryRecord | undefined> {
  return findById<EnquiryRecord>(COLLECTION, id)
}

/** HOD accounts only see their own department's enquiries — enforced here, not just in the UI. */
export async function listEnquiries(scope: { department: EnquiryDepartment | null }): Promise<EnquiryRecord[]> {
  const all = await findAll<EnquiryRecord>(COLLECTION)
  const scoped = scope.department ? all.filter((e) => e.department === scope.department) : all
  return scoped.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  actor: StaffUser,
): Promise<EnquiryRecord | undefined> {
  const before = await findById<EnquiryRecord>(COLLECTION, id)
  if (!before) return undefined

  const updated = await update<EnquiryRecord>(COLLECTION, id, { status })

  await logAudit({
    action: 'enquiry.status-changed',
    actorId: actor.id,
    actorEmail: actor.email,
    actorRole: actor.role,
    targetCollection: COLLECTION,
    targetId: id,
    summary: `Status changed from "${before.status}" to "${status}" on ${before.referenceCode}.`,
  })

  return updated
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
