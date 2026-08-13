import { randomInt } from 'node:crypto'
import { findAll, type Stamped } from './store'

/**
 * Reference codes: human-readable, but not sequential and not guessable —
 * "REQ-104" tells a competitor how many enquiries a rival got this month;
 * this doesn't. Built for the enquiry reference number now, and reused as-is
 * for certificate IDs when that module lands (same non-guessable
 * requirement, same shape).
 *
 * `crypto.randomInt` (CSPRNG), not `Math.random()` — the ID must not be
 * predictable from another one issued around the same time.
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I — read aloud over the phone

function randomSegment(length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)]
  }
  return out
}

/** e.g. generateReferenceCode('AC') -> "AC-2026-7K9QXM" */
export function generateReferenceCode(prefix: string): string {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${randomSegment(6)}`
}

/**
 * Generates a reference code and confirms it doesn't collide with an
 * existing record in `collection` on `field` — astronomically unlikely at
 * this alphabet/length, checked anyway because "unlikely" isn't the bar for
 * an ID a certificate or invoice gets printed with.
 */
export async function generateUniqueReferenceCode<T extends Stamped>(
  prefix: string,
  collection: string,
  field: keyof T,
): Promise<string> {
  const existing = await findAll<T>(collection)
  const taken = new Set(existing.map((r) => r[field]))
  let code = generateReferenceCode(prefix)
  while (taken.has(code as T[keyof T])) {
    code = generateReferenceCode(prefix)
  }
  return code
}
