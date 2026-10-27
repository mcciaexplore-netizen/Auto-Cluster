import { NextResponse } from 'next/server'
import { z } from 'zod'
import { registerForEvent } from '@/server/platform'
import { fieldErrors } from '@/lib/validation'

const schema = z.object({ name: z.string().trim().min(2, 'Enter your name.').max(120), email: z.string().trim().email('Enter a valid email.').max(200), company: z.string().trim().max(160), consent: z.literal(true, { message: 'Confirm consent to process your registration.' }), website: z.string().optional() })
const hits = new Map<string, { count: number; until: number }>()
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  if (hits.size > 10000) for (const [key, value] of hits) if (value.until < now) hits.delete(key)
  const hit = hits.get(ip)
  if (hit && hit.until > now && hit.count >= 10) return NextResponse.json({ message: 'Too many requests. Try again later.' }, { status: 429 })
  hits.set(ip, hit && hit.until > now ? { ...hit, count: hit.count + 1 } : { count: 1, until: now + 600000 })
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ message: 'Invalid request.' }, { status: 400 }) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Check the highlighted fields.', errors: fieldErrors(parsed.error) }, { status: 422 })
  if (parsed.data.website) return NextResponse.json({ message: 'Registration could not be processed.' }, { status: 422 })
  try {
    const { slug } = await params
    const registration = await registerForEvent(slug, { name: parsed.data.name, email: parsed.data.email, company: parsed.data.company })
    return NextResponse.json({ passUrl: `/events/pass/${registration.token}` }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    const known = error instanceof Error && /closed|already exists|capacity/.test(error.message)
    if (!known) console.error('[event] registration failed')
    return NextResponse.json({ message: known ? (error as Error).message : 'Registration could not be saved. Please try again.' }, { status: known ? 409 : 500 })
  }
}
