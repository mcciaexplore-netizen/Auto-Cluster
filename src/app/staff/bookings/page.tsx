import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireStaff } from '@/server/auth'
import { can } from '@/server/roles'
import { bookingQueueStates, listBookings } from '@/server/bookings'
import { getVenue } from '@/content/venues'
import { formatRupees } from '@/content/rates'
import { formatEventDate } from '@/lib/platform'
import { StaffForm } from '@/components/StaffForm'
import { StaffField } from '@/components/StaffFields'
import { reviewBooking } from '../platform-actions'
export const metadata = { title: 'Bookings — Staff', robots: { index: false } }
const stateLabels = { all: 'All bookings', requested: 'Awaiting approval', 'awaiting-payment': 'Awaiting payment', paid: 'Paid', declined: 'Declined' }
export default async function StaffBookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireStaff()
  if (!can(user, 'bookings:approve') && !can(user, 'payments:record')) redirect('/staff')
  const params = await searchParams
  const query = typeof params.query === 'string' ? params.query.trim().slice(0, 120) : ''
  const state = bookingQueueStates.find((s) => s === params.state) ?? 'all'
  const bookings = await listBookings(user, { query, state })
  return <><h1 className="text-3xl">Venue bookings</h1><p className="mt-4 mb-7">Venue managers approve the dates and final total. Accounts issues payment links and records verified receipts.</p>
    <form key={query + '|' + state} action="/staff/bookings" method="get" aria-label="Filter bookings" className="p-5 mb-7 border border-rule rounded-md bg-white grid sm:grid-cols-2 gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium">Search bookings<input name="query" type="search" maxLength={120} defaultValue={query} placeholder="Reference, name, company or email" className="min-h-11 p-3 border border-rule-strong rounded-md font-normal" /></label>
      <label className="flex flex-col gap-2 text-sm font-medium">Booking status<select name="state" defaultValue={state} className="min-h-11 p-3 border border-rule-strong rounded-md font-normal">{bookingQueueStates.map((s) => <option key={s} value={s}>{stateLabels[s]}</option>)}</select></label>
      <div className="flex flex-wrap items-center gap-5"><button type="submit" className="min-h-11 px-5 rounded-full bg-brand-600 text-white text-sm font-semibold">Apply filters</button><Link href="/staff/bookings" className="text-sm">Clear filters</Link></div>
    </form>
    <p className="text-sm text-ink-500 mb-5">{bookings.length} matching {bookings.length === 1 ? 'booking' : 'bookings'}</p>
    <div className="space-y-7">{bookings.map((r) => <section key={r.id} className="p-6 border border-rule bg-white rounded-md break-words"><p className="font-mono text-sm">{can(user, 'enquiries:view') ? <Link href={`/staff/enquiries/${r.id}`}>{r.referenceCode}</Link> : r.referenceCode} · {r.booking!.status}</p><h2 className="text-2xl mt-2">{getVenue(String(r.fields.venueSlug))?.name}</h2><p className="mt-3">{r.name} · {r.email} · {r.phone}</p><p>{formatEventDate(String(r.fields.startsAt))} — {formatEventDate(String(r.fields.endsAt))}</p><p>{r.fields.attendees} attendees · {r.fields.roomUse} · {r.fields.eventType}</p><p className="text-sm">Requested: floor plan {r.fields.floorPlanRequested ? 'yes' : 'no'} · Wi-Fi {r.fields.wifiRequired ? 'yes' : 'no'} · parking {r.fields.parkingRequired ? 'yes' : 'no'}</p><p className="whitespace-pre-wrap my-4">{r.message}</p>
    <a href={`/bookings/${r.booking!.accessToken}`} className="inline-block mb-5">Private customer status page →</a>
    {r.booking!.amountPaise !== null && <p className="font-semibold mb-5">Approved total: {formatRupees(r.booking!.amountPaise! / 100)}</p>}
    {r.booking!.status === 'requested' && can(user, 'bookings:approve') && <div className="grid sm:grid-cols-2 gap-6"><StaffForm action={reviewBooking} label="Approve quotation"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="operation" value="approve" /><StaffField name="amount" label="Approved total in INR, including applicable taxes" /><p className="text-sm">Check capacity, setup access and the final quotation before approval. Overlapping approved bookings are blocked.</p></StaffForm><StaffForm action={reviewBooking} label="Decline request"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="operation" value="decline" /><p className="text-sm">Contact the requester to explain the reason or offer alternative dates.</p></StaffForm></div>}
    {r.booking!.status === 'approved' && !r.booking!.paidReference && can(user, 'payments:record') && <div className="grid sm:grid-cols-2 gap-6"><StaffForm action={reviewBooking} label="Set payment link"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="operation" value="payment-link" /><StaffField name="checkoutUrl" type="url" label="Hosted payment link for this approved total" value={r.booking!.checkoutUrl ?? ''} /></StaffForm><StaffForm action={reviewBooking} label="Record verified receipt"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="operation" value="record-payment" /><StaffField name="receipt" label="Provider receipt reference" /><label className="text-sm"><input type="checkbox" name="verified" required className="mr-2" />I verified the full amount and payment receipt with the provider.</label></StaffForm></div>}
    {r.booking!.paidReference && <p className="text-success">Payment recorded: {r.booking!.paidReference}</p>}
  </section>)}</div>{bookings.length === 0 && <p className="p-6 border border-rule bg-white rounded-md">No bookings match these filters.</p>}</>
}
