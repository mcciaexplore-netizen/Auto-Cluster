import { randomBytes, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { findAll, transaction, type Stamped } from './store'
import { equipment } from '@/content/equipment'
import { venues } from '@/content/venues'
import { eventSchema, mediaSchema } from '@/lib/platform'

export const rateCatalogue = [
  ...equipment.map((e) => ({ key: `equipment:${e.slug}`, title: e.name, group: e.category, unit: e.rate?.uom ?? 'Per service', href: `/equipment/${e.slug}` })),
  ...venues.map((v) => ({ key: `venue:${v.slug}`, title: v.name, group: 'venue', unit: 'Per booking', href: `/venues/${v.slug}` })),
]
export interface FixedRate extends Stamped { key: string; amountPaise: number; unit: string; effectiveFrom: string; approvedBy: string; taxNote: string }
export async function listFixedRates() { return findAll<FixedRate>('fixed-rates') }
export async function getFixedRate(key: string) {
  const today = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)
  return (await listFixedRates()).filter((r) => r.key === key && r.effectiveFrom <= today).sort((a,b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
}
export interface Registration { id: string; token: string; name: string; email: string; company: string; createdAt: string; consentAt: string }
export interface EventRecord extends Stamped, z.infer<typeof eventSchema> { registrations: Registration[] }
export interface MediaRecord extends Stamped, z.infer<typeof mediaSchema> {}
export async function listEvents() { return findAll<EventRecord>('events') }
export async function listMedia() { return findAll<MediaRecord>('media-library') }

export async function registerForEvent(slug: string, details: Pick<Registration, 'name' | 'email' | 'company'>) {
  return transaction<EventRecord, Registration>('events', (events) => {
    const event = events.find((e) => e.slug === slug && e.published)
    if (!event || !event.registrationOpen || new Date(`${event.startsAt}:00+05:30`).getTime() <= Date.now()) throw new Error('Registration is closed for this event.')
    if (event.registrations.some((r) => r.email.toLowerCase() === details.email.toLowerCase())) throw new Error('A registration already exists for this email. Contact the event team if you need your pass.')
    if (event.registrations.length >= event.capacity) throw new Error('This event has reached capacity.')
    const now = new Date().toISOString()
    const registration = { ...details, id: randomUUID(), token: randomBytes(32).toString('hex'), createdAt: now, consentAt: now }
    return { records: events.map((e) => e.id === event.id ? { ...e, registrations: [...e.registrations, registration], updatedAt: now } : e), result: registration }
  })
}
