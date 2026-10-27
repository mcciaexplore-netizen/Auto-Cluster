import { notFound } from 'next/navigation'
import { listEvents } from '@/server/platform'
import { formatEventDate } from '@/lib/platform'
import { PageHero, Section } from '@/components/ui/Section'
import { EventRegistration } from '@/components/EventRegistration'
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = (await listEvents()).find((e) => e.slug === slug && e.published)
  return { title: event?.title ?? 'Event', description: event?.description.slice(0, 160) }
}
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = (await listEvents()).find((e) => e.slug === slug && e.published)
  if (!event) notFound()
  const open = event.registrationOpen && event.registrations.length < event.capacity && new Date(`${event.startsAt}:00+05:30`).getTime() > Date.now()
  return <><PageHero eyebrow={event.category.replace('-', ' ')} title={event.title} subtitle={`${formatEventDate(event.startsAt)} · ${event.location}`} /><Section tone="white"><a href="/events">← All events</a><p className="mt-6 whitespace-pre-wrap text-lg">{event.description}</p><p className="mt-5 text-sm">Ends: {formatEventDate(event.endsAt)}</p></Section><Section><h2 className="text-3xl mb-6">{open ? 'Register for this event' : 'Registration closed'}</h2>{open ? <EventRegistration slug={event.slug} /> : <p>{event.registrations.length >= event.capacity ? 'This event has reached capacity.' : 'Registration is not currently open.'} Contact the event team for assistance.</p>}</Section></>
}
