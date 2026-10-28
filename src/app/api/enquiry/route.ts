import { NextResponse } from 'next/server'
import { enquirySchema, fieldErrors } from '@/lib/validation'
import { sendAcknowledgement, sendDepartmentNotification } from '@/lib/email'
import { createEnquiry } from '@/server/enquiries'

/**
 * POST /api/enquiry
 *
 *   zod re-validation server-side
 *   -> honeypot + time-trap + rate limit
 *   -> resolve routing, persist, generate reference code
 *   -> email the routed department
 *   -> auto-acknowledge the sender
 *
 * Everything is stored, not just emailed. That gives ACDRI an enquiry history
 * they have never had — today submissions land in a Google Sheet outside their
 * governed environment.
 */

/** In-memory limiter. Fine for a single instance; replace with the database once connected. */
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

const MIN_FILL_TIME_MS = 2500

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

  // Timing trap. Same silent-accept reasoning as the honeypot above — a
  // rejection would teach a bot exactly what tripped it.
  if (Date.now() - enquiry.formRenderedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true }, { status: 202 })
  }

  let record
  try {
    record = await createEnquiry(enquiry, {
      source: request.headers.get('referer'),
    })
  } catch (error) {
    console.error('[enquiry] persist failed', error)
    return NextResponse.json(
      { message: 'We could not save your enquiry. Try again, or call +91 20 6633 3700.' },
      { status: 500 },
    )
  }

  try {
    await Promise.all([sendDepartmentNotification(record), sendAcknowledgement(record)])
  } catch (error) {
    // The enquiry is already saved and has a reference number — a delivery
    // failure here is a notification problem, not a lost enquiry.
    console.error('[enquiry] delivery failed', error)
  }

  return NextResponse.json({ ok: true, referenceCode: record.referenceCode })
}
