import { randomUUID } from 'node:crypto'
import { findAll, insert, type Stamped } from './store'
import { readFileBytes, saveFileBytes } from './files'
import { getVenue } from '@/content/venues'
export interface VenueDocument extends Stamped { venueSlug: string; title: string; kind: 'floor-plan' | 'guidelines'; storedName: string; uploadedBy: string }
export async function listVenueDocuments() { return findAll<VenueDocument>('venue-documents') }
export async function saveVenueDocument(venueSlug: string, title: string, kind: string, file: File, actorId: string) {
  if (!getVenue(venueSlug)) throw new Error('Choose a venue.')
  if (title.trim().length < 3 || title.length > 160) throw new Error('Enter a document title of 3–160 characters.')
  if (kind !== 'floor-plan' && kind !== 'guidelines') throw new Error('Choose a document type.')
  if (!file || !file.size || file.size > 10 * 1024 * 1024) throw new Error('Attach a PDF up to 10 MB.')
  const bytes = Buffer.from(await file.arrayBuffer())
  if (bytes.subarray(0,5).toString() !== '%PDF-') throw new Error('The attachment must be a PDF.')
  const storedName = `${randomUUID()}.pdf`
  await saveFileBytes(storedName, bytes)
  return insert<VenueDocument>('venue-documents', { venueSlug, title: title.trim(), kind, storedName, uploadedBy: actorId })
}
export async function venueDocumentResponse(record: VenueDocument) {
  const bytes = await readFileBytes(record.storedName)
  return new Response(new Uint8Array(bytes), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${record.title.replace(/[^a-zA-Z0-9 ._-]/g, '_')}.pdf"`, 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' } })
}
