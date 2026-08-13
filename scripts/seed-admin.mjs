#!/usr/bin/env node
/**
 * Creates the first super-admin staff account.
 *
 * Every other staff account requires `staff:manage` to create, which
 * requires being signed in as staff, which requires a staff account to
 * exist — this script is how that circle gets broken the first time. Safe
 * to re-run: it upserts by email rather than duplicating, so it also works
 * as a "reset this account's password" tool if a super-admin gets locked out.
 *
 * Usage:
 *   ADMIN_EMAIL=you@acdri.example ADMIN_PASSWORD=... ADMIN_NAME="Your Name" \
 *     node scripts/seed-admin.mjs
 *
 * Plain ESM, no `@/` imports — same reasoning as import-google-form.mjs.
 * The hashing here must match src/server/auth.ts exactly (scrypt, 64-byte
 * derived key, hex-encoded) or the account it creates won't be able to sign
 * in through the app.
 */

import { randomBytes, randomUUID, scrypt } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scryptAsync(password, salt, 64)
  return { hash: derived.toString('hex'), salt }
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator'

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (and optionally ADMIN_NAME) and re-run.')
    process.exit(1)
  }
  if (password.length < 12) {
    console.error('ADMIN_PASSWORD should be at least 12 characters — this account can approve and manage every other staff account.')
    process.exit(1)
  }

  const dataDir = path.join(process.cwd(), '.data', 'db')
  await mkdir(dataDir, { recursive: true })
  const file = path.join(dataDir, 'staff-users.json')

  let users = []
  try {
    users = JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    users = []
  }

  const { hash, salt } = await hashPassword(password)
  const now = new Date().toISOString()
  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email)

  const record = {
    id: existingIndex === -1 ? randomUUID() : users[existingIndex].id,
    createdAt: existingIndex === -1 ? now : users[existingIndex].createdAt,
    updatedAt: now,
    email,
    name,
    role: 'super-admin',
    department: null,
    passwordHash: hash,
    passwordSalt: salt,
    active: true,
  }

  if (existingIndex === -1) {
    users.push(record)
  } else {
    users[existingIndex] = record
  }

  const tmp = `${file}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(users, null, 2), 'utf-8')
  await rename(tmp, file)

  console.log(`${existingIndex === -1 ? 'Created' : 'Updated'} super-admin account for ${email}.`)
  console.log('Sign in at /staff/login. Set STAFF_SESSION_SECRET in .env.local first if you have not.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
