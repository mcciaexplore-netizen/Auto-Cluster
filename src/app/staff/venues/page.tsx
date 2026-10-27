import { requireStaff } from '@/server/auth'
import { listVenueDocuments } from '@/server/venue-documents'
import { venues } from '@/content/venues'
import { StaffForm } from '@/components/StaffForm'
import { StaffField } from '@/components/StaffFields'
import { uploadVenueDocument } from '../platform-actions'
export const metadata = { title: 'Private venue documents — Staff', robots: { index: false } }
export default async function VenueDocumentsPage() {
  await requireStaff('bookings:approve')
  const documents = await listVenueDocuments()
  return <><h1 className="text-3xl">Private venue documents</h1><p className="mt-4 mb-7">Store floor plans and guidelines outside the public website. Approved bookings receive guidelines; floor plans are shared only when requested. Include confirmed Wi-Fi, parking and room rules in the guideline PDF.</p><div className="max-w-[640px] p-6 border border-rule bg-white rounded-md"><StaffForm action={uploadVenueDocument} label="Upload privately"><label className="text-sm">Venue<select name="venueSlug" className="block min-h-11 w-full p-3 border border-rule-strong rounded-md">{venues.map((v) => <option key={v.slug} value={v.slug}>{v.name}</option>)}</select></label><StaffField name="title" label="Document title and revision" /><label className="text-sm">Type<select name="kind" className="block min-h-11 w-full p-3 border border-rule-strong rounded-md"><option value="floor-plan">Floor plan</option><option value="guidelines">Guidelines, rules and amenities</option></select></label><label className="text-sm">PDF, up to 10 MB<input name="file" type="file" accept="application/pdf,.pdf" required className="block mt-3" /></label></StaffForm></div><ul className="mt-8 space-y-5 list-none p-0">{documents.map((d) => <li key={d.id} className="border-t border-rule pt-5"><a href={`/api/staff/venue-documents/${d.id}`}>{d.title} ↓</a><p className="text-sm mt-2">{venues.find((v) => v.slug === d.venueSlug)?.name} · {d.kind}</p></li>)}</ul></>
}
