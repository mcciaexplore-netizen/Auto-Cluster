import { getStaffSession } from '@/server/auth'
import { can } from '@/server/roles'
import { listVenueDocuments, venueDocumentResponse } from '@/server/venue-documents'
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await getStaffSession()
  if (!actor || !can(actor, 'bookings:approve')) return new Response('Forbidden', { status: 403 })
  const { id } = await params
  const document = (await listVenueDocuments()).find((d) => d.id === id)
  if (!document) return new Response('Not found', { status: 404 })
  return venueDocumentResponse(document)
}
