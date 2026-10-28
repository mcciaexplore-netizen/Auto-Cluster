import { append, findAll, type Stamped } from './store'

/**
 * The immutable audit log — "on every status change, payment record,
 * certificate action, role change" per the foundation requirement.
 *
 * Immutable by construction: this module exports `logAudit` (append) and
 * `listAudit` (read) and nothing else. There is no `updateAudit` to import
 * by mistake, and the underlying `audit-log` collection is never passed to
 * `store.update()` anywhere in the codebase.
 */

export type AuditAction =
  | 'enquiry.created'
  | 'enquiry.status-changed'
  | 'routing-map.updated'
  | 'staff.login'
  | 'staff.login-failed'
  | 'staff.created'
  | 'staff.role-changed'
  | 'booking.status-changed'
  | 'payment.recorded'
  | 'certificate.issued'
  | 'certificate.revoked'

export interface AuditEntry extends Stamped {
  action: AuditAction
  /** Null for a system/unauthenticated event — a public enquiry submission. */
  actorId: string | null
  actorEmail: string | null
  actorRole: string | null
  targetCollection: string
  targetId: string
  summary: string
  metadata?: Record<string, unknown>
}

const COLLECTION = 'audit-log'

export async function logAudit(entry: Omit<AuditEntry, keyof Stamped>): Promise<AuditEntry> {
  return append<AuditEntry>(COLLECTION, entry)
}

export async function listAudit(filter?: {
  targetCollection?: string
  targetId?: string
}): Promise<AuditEntry[]> {
  const all = await findAll<AuditEntry>(COLLECTION)
  return all
    .filter((e) => !filter?.targetCollection || e.targetCollection === filter.targetCollection)
    .filter((e) => !filter?.targetId || e.targetId === filter.targetId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
