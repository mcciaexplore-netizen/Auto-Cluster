import { notFound } from 'next/navigation'
import { listEvents } from '@/server/platform'
import { formatEventDate } from '@/lib/platform'
import { Section } from '@/components/ui/Section'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Event pass', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
export default async function PassPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[a-f0-9]{64}$/.test(token)) notFound()
  const event = (await listEvents()).find((e) => e.published && e.registrations.some((r) => r.token === token))
  const registration = event?.registrations.find((r) => r.token === token)
  if (!event || !registration) notFound()
  return <Section tone="white"><article className="max-w-[620px] mx-auto border border-rule rounded-md p-8"><p className="text-sm text-brand-600">AUTO CLUSTER · EVENT PASS</p><h1 className="text-3xl mt-6">{event.title}</h1><p className="mt-6 text-2xl">{registration.name}</p><p className="mt-5">{formatEventDate(event.startsAt)}</p><p>{event.location}</p><div className="border-t border-dashed border-rule mt-7 pt-5"><p className="text-xs">Pass reference</p><p className="font-mono text-sm break-all mt-2">{registration.id}</p></div><p className="mt-7 text-sm">Save this private page or print it from your browser. Show the pass reference to the event team at check-in.</p><a href={`/events/${event.slug}`} className="inline-block mt-5">Event details →</a></article></Section>
}
