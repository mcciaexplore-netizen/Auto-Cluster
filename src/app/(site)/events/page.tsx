import Link from 'next/link'
import { listEvents } from '@/server/platform'
import { formatEventDate } from '@/lib/platform'
import { PageHero, Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Events & registration', description: 'Explore industry events, exhibitions and training at Auto Cluster, Pune.' }
export default async function EventsPage() {
  const events = (await listEvents()).filter((e) => e.published).sort((a,b) => a.startsAt.localeCompare(b.startsAt))
  const now = Date.now()
  const upcoming = events.filter((e) => new Date(`${e.endsAt}:00+05:30`).getTime() >= now)
  const past = events.filter((e) => !upcoming.includes(e)).reverse()
  return <><PageHero eyebrow="Events" title="Meet. Learn. Exchange ideas." subtitle="Industry gatherings, exhibitions and training at Auto Cluster. Open an event to view details and register." /><Section tone="white">
    <h2 className="text-3xl">Upcoming events</h2>{!upcoming.length && <div className="border-t border-rule mt-6 py-8"><p>New event dates will be published here when confirmed.</p><ButtonLink href="/contact?service=training" variant="secondary" className="mt-5">Ask about upcoming programmes</ButtonLink></div>}
    <div className="mt-6 divide-y divide-rule">{upcoming.map((e) => <article key={e.id} className="py-7 grid md:grid-cols-[220px_1fr_auto] gap-6 items-start"><p className="font-mono text-sm">{formatEventDate(e.startsAt)}</p><div><h3 className="text-2xl"><Link href={`/events/${e.slug}`}>{e.title}</Link></h3><p className="text-sm mt-3">{e.location}</p><p className="mt-3 text-ink-700">{e.description.slice(0,200)}{e.description.length > 200 ? '…' : ''}</p></div><ButtonLink href={`/events/${e.slug}`} variant="secondary">{e.registrationOpen ? 'Details & registration' : 'View event'}</ButtonLink></article>)}</div>
    {past.length > 0 && <div className="mt-12"><h2 className="text-3xl mb-5">Past events</h2>{past.map((e) => <article key={e.id} className="border-t border-rule py-5"><Link href={`/events/${e.slug}`} className="text-xl font-semibold">{e.title}</Link><p className="mt-2 text-sm">{formatEventDate(e.startsAt)}</p></article>)}</div>}
  </Section><Section compact><h2 className="text-2xl">Planning your own event?</h2><p className="mt-4 mb-6">Explore venue options and request dates, setup arrangements and a quotation.</p><ButtonLink href="/venues/book">Request a venue</ButtonLink></Section></>
}
