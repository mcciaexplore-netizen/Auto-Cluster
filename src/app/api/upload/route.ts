import { NextResponse } from 'next/server'
import { saveUpload, UploadRejected } from '@/server/uploads'

/**
 * POST /api/upload — one CAD/drawing file, ahead of the enquiry form's own
 * submit. The form uploads on file-select and holds onto the returned
 * token, then sends that token (not the file) with the enquiry payload —
 * keeps the enquiry POST body small JSON rather than multipart, and lets the
 * form show "uploaded" before the visitor finishes typing their message.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: 'No file received.' }, { status: 400 })
  }

  try {
    const record = await saveUpload(file)
    return NextResponse.json({ token: record.token, name: record.originalName })
  } catch (error) {
    if (error instanceof UploadRejected) {
      return NextResponse.json({ message: error.message }, { status: 422 })
    }
    console.error('[upload] failed', error)
    return NextResponse.json({ message: 'Upload failed. Try again.' }, { status: 500 })
  }
}
