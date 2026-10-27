import Link from 'next/link'
import { requireStaff } from '@/server/auth'
import { listEvents, type EventRecord } from '@/server/platform'
import { StaffForm } from '@/components/StaffForm'
import { StaffField } from '@/components/StaffFields'
import { saveEvent } from '../platform-actions'
export const metadata = { title: 'Events — Staff', robots: { index: false } }
function EventEditor({ event }: { event?: EventRecord }) {
  return <StaffForm action={saveEvent} label={event ? 'Save event' : 'Create event'}><input type="hidden" name="id" value={event?.id ?? ''} />
    <div className="grid sm:grid-cols-2 gap-4"><StaffField name="title" label="Event title" value={event?.title} /><StaffField name="slug" label="URL name (lowercase-with-hyphens)" value={event?.slug} readOnly={!!event} /><StaffField name="startsAt" label="Starts at (IST)" type="datetime-local" value={event?.startsAt} /><StaffField name="endsAt" label="Ends at (IST)" type="datetime-local" value={event?.endsAt} /><StaffField name="location" label="Location" value={event?.location} /><StaffField name="capacity" label="Registration capacity" type="number" value={event?.capacity} /></div>
    <label className="text-sm">Category<select name="category" defaultValue={event?.category ?? 'industry-event'} className="block min-h-11 p-3 border border-rule-strong w-full rounded-md"><option value="industry-event">Industry event</option><option value="training">Training</option><option value="exhibition">Exhibition</option></select></label>
    <StaffField name="description" label="Description" type="textarea" value={event?.description} />
    <label className="text-sm"><input name="published" type="checkbox" defaultChecked={event?.published} className="mr-2" />Publish on the public events page</label>
    <label className="text-sm"><input name="registrationOpen" type="checkbox" defaultChecked={event?.registrationOpen} className="mr-2" />Open free registration and issue an event pass</label>
  </StaffForm>
}
export default async function StaffEventsPage() {
  await requireStaff('events:manage')
  const events = await listEvents()
  return <><h1 className="text-3xl">Events & registrations</h1><p className="mt-4 mb-7">Create an event landing page, open registration and review attendees. Paid event registration requires confirmed pricing and a payment provider.</p>
    <details className="border border-rule rounded-md p-6 bg-white mb-8"><summary className="cursor-pointer font-semibold min-h-11">Create an event</summary><EventEditor /></details>
    <div className="space-y-7">{events.map((event) => <section key={event.id} className="border border-rule p-6 bg-white rounded-md"><h2 className="text-2xl">{event.title}</h2><p className="mt-2">{event.published ? 'Published' : 'Draft'} · {event.registrations.length} / {event.capacity} registrations {event.published && <Link href={`/events/${event.slug}`} className="ml-4">Open landing page →</Link>}</p>
      <details className="mt-5"><summary className="cursor-pointer min-h-11 font-semibold">Edit event</summary><EventEditor event={event} /></details>
      <details className="mt-3"><summary className="cursor-pointer min-h-11 font-semibold">Attendee list</summary><div className="overflow-x-auto"><table className="w-full text-sm text-left"><caption className="sr-only">Registered attendees</caption><thead><tr><th className="py-3">Name</th><th>Email</th><th>Company</th><th>Pass reference</th></tr></thead><tbody>{event.registrations.map((r) => <tr key={r.id} className="border-t border-rule"><td className="py-3 pr-3">{r.name}</td><td className="pr-3">{r.email}</td><td className="pr-3">{r.company || '—'}</td><td className="font-mono">{r.id}</td></tr>)}</tbody></table></div>{!event.registrations.length && <p>No registrations yet.</p>}</details>
    </section>)}</div>
  </>
}
