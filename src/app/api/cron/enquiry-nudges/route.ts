import { NextResponse } from 'next/server'
import { enquiriesDueForFollowUp, markFollowUpSent } from '@/server/enquiries'
import { sendFollowUpNudge } from '@/lib/email'

/**
 * GET /api/cron/enquiry-nudges — meant to be hit by an external scheduler
 * (Vercel Cron, or any cron-job.org-style pinger), not a browser. There is
 * no in-process scheduler here: a Next.js server has no durable clock of its
 * own between requests, so "check every hour" has to come from outside.
 *
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` by convention;
 * this checks the same header so the route means what its name says even if
 * it's ever hit directly.
 *
 * Fails closed in production: an unset `CRON_SECRET` on a deployed site is a
 * misconfiguration, not an invitation to run this unauthenticated — the
 * route is only left open when `CRON_SECRET` is unset in development, so
 * local testing still works with no secret configured (see .env.example).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'CRON_SECRET is not configured.' }, { status: 500 })
  }
  if (secret) {
    const header = request.headers.get('authorization')
    if (header !== `Bearer ${secret}`) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
    }
  }

  const due = await enquiriesDueForFollowUp()

  const results = await Promise.allSettled(
    due.map(async (enquiry) => {
      await sendFollowUpNudge(enquiry)
      await markFollowUpSent(enquiry.id)
    }),
  )

  const failed = results.filter((r) => r.status === 'rejected').length

  return NextResponse.json({ due: due.length, sent: due.length - failed, failed })
}
