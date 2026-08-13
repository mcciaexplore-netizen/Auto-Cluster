import { randomUUID } from 'node:crypto'
import { services, type Service } from '@/content/services'
import { transaction, update, type Stamped } from './store'

/**
 * "Service-to-department-to-email mapping table, editable by staff, not
 * hardcoded." One row per service (services.ts already pins each service to
 * a department, so a service is the finer and sufficient key). Seeded once
 * from the same env vars the old hardcoded `ROUTES` table in lib/email.ts
 * used, so existing deployment config keeps working the first time this
 * runs — after that, the seed values are just this table's starting data,
 * editable from /staff/settings/routing without a deploy.
 */

const COLLECTION = 'routing-map'
const FALLBACK_EMAIL = process.env.EMAIL_FALLBACK || 'marketing@autoclusterpune.org'

export interface RoutingMapEntry extends Stamped {
  serviceId: string
  email: string
  /** Staff id who last edited it. Null means it still holds the seed value. */
  updatedBy: string | null
}

function defaultEmailFor(service: Service): string {
  const byDepartment: Record<string, string | undefined> = {
    testing: process.env.EMAIL_TO_TESTING,
    prototyping: process.env.EMAIL_TO_PROTOTYPING,
    venue: process.env.EMAIL_TO_VENUE,
    training: process.env.EMAIL_TO_TRAINING,
    careers: process.env.EMAIL_TO_CAREERS,
    tenders: process.env.EMAIL_TO_TENDERS,
    general: process.env.EMAIL_TO_GENERAL,
  }
  return byDepartment[service.department] ?? FALLBACK_EMAIL
}

/** Seeds one row per known service on first use. Runs inside the collection's lock, so two concurrent first-calls can't both seed. */
async function ensureSeeded(): Promise<RoutingMapEntry[]> {
  return transaction<RoutingMapEntry, RoutingMapEntry[]>(COLLECTION, (records) => {
    if (records.length > 0) return { records, result: records }
    const now = new Date().toISOString()
    const seeded = services.map(
      (service): RoutingMapEntry => ({
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
        serviceId: service.id,
        email: defaultEmailFor(service),
        updatedBy: null,
      }),
    )
    return { records: seeded, result: seeded }
  })
}

export async function listRoutingMap(): Promise<RoutingMapEntry[]> {
  return ensureSeeded()
}

/** Falls back to the marketing inbox and flags the enquiry for review if a service has no mapping row somehow. */
export async function resolveRouting(serviceId: string): Promise<{ email: string; needsReview: boolean }> {
  const map = await ensureSeeded()
  const entry = map.find((e) => e.serviceId === serviceId)
  if (!entry) return { email: FALLBACK_EMAIL, needsReview: true }
  return { email: entry.email, needsReview: false }
}

export async function updateRouting(
  serviceId: string,
  email: string,
  staffId: string,
): Promise<RoutingMapEntry> {
  const map = await ensureSeeded()
  const entry = map.find((e) => e.serviceId === serviceId)
  if (!entry) throw new Error(`Unknown service id: ${serviceId}`)
  const updated = await update<RoutingMapEntry>(COLLECTION, entry.id, { email, updatedBy: staffId })
  if (!updated) throw new Error('Routing entry disappeared mid-update.')
  return updated
}
