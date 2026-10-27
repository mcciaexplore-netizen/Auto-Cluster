import { notFound } from 'next/navigation'
import { findOne } from '@/server/store'
import type { EnquiryRecord } from '@/server/enquiries'
import { getVenue } from '@/content/venues'
import { formatRupees } from '@/content/rates'
import { formatEventDate } from '@/lib/platform'
import { validCheckoutUrl } from '@/server/bookings'
import { PageHero, Section } from '@/components/ui/Section'
import { listVenueDocuments } from '@/server/venue-documents'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Your booking request', robots: { index: false, follow: false }, referrer: 'no-referrer' as const }
export default async function BookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[a-f0-9]{64}$/.test(token)) notFound()
  const record = await findOne<EnquiryRecord>('enquiries', (r) => r.booking?.accessToken === token)
  if (!record?.booking) notFound()
  const { booking } = record
  const documents = booking.status === 'approved' ? (await listVenueDocuments()).filter((d) => d.venueSlug === record.fields.venueSlug && (d.kind === 'guidelines' || record.fields.floorPlanRequested)) : []
  return <><PageHero eyebrow={record.referenceCode} title="Your venue request" subtitle="Keep this link private. It gives access to your booking status and payment details." /><Section tone="white"><div className="max-w-[680px] space-y-5">
    <h2 className="text-3xl">{getVenue(String(record.fields.venueSlug))?.name}</h2>
    <p>{formatEventDate(String(record.fields.startsAt))} — {formatEventDate(String(record.fields.endsAt))}</p>
    <p className="font-semibold">{booking.status === 'requested' ? 'Awaiting venue review' : booking.status === 'declined' ? 'Request declined — contact the venue team for alternatives' : booking.paidReference ? 'Approved · payment recorded' : 'Approved · awaiting payment'}</p>
    {booking.amountPaise !== null && <p className="text-3xl font-mono">{formatRupees(booking.amountPaise / 100)} <span className="text-sm font-sans">approved total</span></p>}
    {booking.status === 'approved' && !booking.paidReference && (booking.checkoutUrl && validCheckoutUrl(booking.checkoutUrl) ? <a href={booking.checkoutUrl} rel="noreferrer noopener" target="_blank" className="inline-flex min-h-11 px-6 items-center rounded-full bg-brand-600 text-white no-underline">Open secure payment page ↗</a> : <p>Accounts will provide a payment link here after reviewing the approved quotation.</p>)}
    {booking.paidReference ? <p>Receipt reference: <span className="font-mono">{booking.paidReference}</span></p> : <p className="text-sm text-ink-500">Your payment status updates after accounts verifies receipt. Opening a payment link does not confirm payment.</p>}
    {record.fields.floorPlanRequested && <p>The venue team will send the requested floor plan and guidelines directly.</p>}
    {documents.length > 0 && <section><h3 className="text-xl">Your venue documents</h3><ul className="mt-3 space-y-3">{documents.map((d) => <li key={d.id}><a href={`/api/bookings/${token}/documents/${d.id}`}>{d.title} ↓</a></li>)}</ul></section>}
    <a href="tel:+912066333700">Contact the venue team: +91 20 6633 3700</a>
  </div></Section></>
}
