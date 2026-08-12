import { NextResponse } from 'next/server'
import { enquirySchema, fieldErrors } from '@/lib/validation'
import { routeEnquiry, sendAcknowledgement, sendDepartmentNotification } from '@/lib/email'

/**
 * POST /api/enquiry
 *
 *   zod re-validation server-side
 *   -> honeypot + rate limit
 *   -> persist
 *   -> email the routed department
 *   -> auto-acknowledge the sender
 *
 * Everything is stored, not just emailed. That gives ACDRI an enquiry history
 * they have never had — today submissions land in a Google Sheet outside their
 * governed environment.
 */

/** In-memory limiter. Replace with Redis or Postgres before production. */
const hits = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        message:
          'Too many enquiries from this connection. Wait a few minutes, or call +91 20 6633 3700.',
      },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Malformed request.' }, { status: 400 })
  }

  const parsed = enquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Please check the highlighted fields.', errors: fieldErrors(parsed.error) },
      { status: 422 },
    )
  }

  const enquiry = parsed.data

  // Honeypot. Accept silently so bots do not learn they were caught.
  if (enquiry.website) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  const to = routeEnquiry(enquiry.department)

  try {
    // TODO(payload): INSERT into the `enquiries` collection once the database
    // is connected. Schema is defined in src/payload/collections/Enquiries.ts.
    await Promise.all([
      sendDepartmentNotification(to, enquiry),
      sendAcknowledgement(enquiry),
    ])
  } catch (error) {
    console.error('[enquiry] delivery failed', error)
    return NextResponse.json(
      {
        message:
          'We could not send your enquiry. Try again, or call +91 20 6633 3700 and we will take the details.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
