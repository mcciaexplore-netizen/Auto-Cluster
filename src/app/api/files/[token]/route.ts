import { NextResponse } from 'next/server'
import { getUploadByToken, readUploadFile } from '@/server/uploads'

/**
 * GET /api/files/[token] — the only way to read back an enquiry attachment.
 * Never a `public/` path: the token is a 24-byte random value issued at
 * upload time, unrelated to the upload record's own id, so it isn't
 * guessable by walking ids sequentially or reading one out of a log line
 * that only ever needed the id.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const record = await getUploadByToken(token)
  if (!record) {
    return NextResponse.json({ message: 'Not found.' }, { status: 404 })
  }

  const buffer = await readUploadFile(record)
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': record.mimeType,
      'Content-Disposition': `attachment; filename="${record.originalName.replace(/"/g, '')}"`,
      'Content-Length': String(record.size),
      'Cache-Control': 'private, no-store',
    },
  })
}
