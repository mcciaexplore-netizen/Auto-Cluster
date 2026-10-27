import { findOne } from '@/server/store'
import type { EnquiryRecord } from '@/server/enquiries'
import { listVenueDocuments, venueDocumentResponse } from '@/server/venue-documents'
export async function GET(_request: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params
  if (!/^[a-f0-9]{64}$/.test(token)) return new Response('Not found', { status: 404 })
  const booking = await findOne<EnquiryRecord>('enquiries', (r) => r.booking?.accessToken === token && r.booking.status === 'approved')
  if (!booking) return new Response('Not found', { status: 404 })
  const document = (await listVenueDocuments()).find((d) => d.id === id && d.venueSlug === booking.fields.venueSlug && (d.kind === 'guidelines' || booking.fields.floorPlanRequested))
  if (!document) return new Response('Not found', { status: 404 })
  return venueDocumentResponse(document)
}
