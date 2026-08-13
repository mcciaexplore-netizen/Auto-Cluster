import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { findById } from './store'
import { can, type Action, type StaffUser } from './roles'

/**
 * Staff sign-in — password + a signed session cookie. Deliberately not the
 * magic-link pattern the Training module needs for participants: staff
 * accounts are internal and long-lived, so a password they choose and a
 * session that survives a browser restart fits better than a link that
 * expires. No new dependency: hashing is `crypto.scrypt` (Node core),
 * signing is `crypto.createHmac` (Node core) — a JWT would add a library for
 * exactly the two primitives already in the standard library.
 */

const scryptAsync = promisify(scrypt)
const SESSION_COOKIE = 'ac_staff_session'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function sessionSecret(): string {
  const secret = process.env.STAFF_SESSION_SECRET
  if (!secret) {
    throw new Error(
      'STAFF_SESSION_SECRET is not set. Generate one with `openssl rand -hex 32` and add it to .env.local.',
    )
  }
  return secret
}

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return { hash: derived.toString('hex'), salt }
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const stored = Buffer.from(hash, 'hex')
  if (derived.length !== stored.length) return false
  return timingSafeEqual(derived, stored)
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

interface SessionPayload {
  userId: string
  issuedAt: number
}

function sign(value: string): string {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url')
}

function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

function decodeSession(token: string): SessionPayload | null {
  const [body, signature] = token.split('.')
  if (!body || !signature) return null
  const expected = sign(body)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as SessionPayload
    if (Date.now() - payload.issuedAt > SESSION_TTL_MS) return null
    return payload
  } catch {
    return null
  }
}

/** Ready to hand to `response.cookies.set(...)` in a route handler. */
export function sessionCookie(userId: string): {
  name: string
  value: string
  options: { httpOnly: true; secure: boolean; sameSite: 'lax'; path: '/'; maxAge: number }
} {
  return {
    name: SESSION_COOKIE,
    value: encodeSession({ userId, issuedAt: Date.now() }),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_MS / 1000,
    },
  }
}

export function clearedSessionCookie() {
  return { name: SESSION_COOKIE, value: '', options: { path: '/', maxAge: 0 } as const }
}

/** For Server Components and Route Handlers — reads the cookie jar itself. */
export async function getStaffSession(): Promise<StaffUser | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const payload = decodeSession(token)
  if (!payload) return null
  const user = await findById<StaffUser>('staff-users', payload.userId)
  if (!user || !user.active) return null
  return user
}

/**
 * For a staff page or action that requires a signed-in user — and,
 * optionally, one specific permission. Redirects rather than returning null,
 * so every caller gets the same "not signed in" / "not allowed" behaviour
 * instead of each page writing its own `if (!user) redirect(...)`.
 */
export async function requireStaff(action?: Action): Promise<StaffUser> {
  const user = await getStaffSession()
  if (!user) redirect('/staff/login')
  if (action && !can(user, action)) redirect('/staff')
  return user
}

/** For a raw `Request` (e.g. inside `middleware.ts`), no `next/headers`. */
export async function staffFromRequestCookie(request: Request): Promise<StaffUser | null> {
  const header = request.headers.get('cookie') ?? ''
  const match = header.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))
  if (!match) return null
  const payload = decodeSession(decodeURIComponent(match[1]))
  if (!payload) return null
  const user = await findById<StaffUser>('staff-users', payload.userId)
  if (!user || !user.active) return null
  return user
}
