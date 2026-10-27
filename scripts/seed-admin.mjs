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
 * Writes to whichever backend src/server/store.ts would pick: the local
 * `.data/db/staff-users.json` file when none of `DATABASE_URI`,
 * `DATABASE_URL` or `POSTGRES_URL` is set (the normal case for local dev),
 * or Postgres (`store_records`, collection 'staff-users') when one is —
 * required on Vercel. Plain ESM, no `@/`
 * imports — same reasoning as import-google-form.mjs. The hashing here must
 * match src/server/auth.ts exactly (scrypt, 64-byte derived key,
 * hex-encoded) or the account it creates won't be able to sign in.
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

async function seedToFile(email, record, now) {
  const dataDir = path.join(process.cwd(), '.data', 'db')
  await mkdir(dataDir, { recursive: true })
  const file = path.join(dataDir, 'staff-users.json')

  let users = []
  try {
    users = JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    users = []
  }

  const existingIndex = users.findIndex((u) => u.email.toLowerCase() === email)
  const entry = {
    id: existingIndex === -1 ? randomUUID() : users[existingIndex].id,
    createdAt: existingIndex === -1 ? now : users[existingIndex].createdAt,
    updatedAt: now,
    ...record,
  }
  if (existingIndex === -1) users.push(entry)
  else users[existingIndex] = entry

  const tmp = `${file}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(users, null, 2), 'utf-8')
  await rename(tmp, file)
  return existingIndex === -1
}

async function seedToPostgres(connectionString, email, record, now) {
  const { Pool } = await import('pg')
  const isLocal = /^(postgres(ql)?:\/\/)?[^@]*@?(localhost|127\.0\.0\.1)/.test(connectionString)
  const pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  })
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_records (
        collection text NOT NULL, id uuid NOT NULL, data jsonb NOT NULL,
        created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL,
        PRIMARY KEY (collection, id)
      );
      CREATE INDEX IF NOT EXISTS store_records_collection_idx ON store_records (collection);
    `)
    const existing = await pool.query(
      `SELECT id, created_at FROM store_records WHERE collection = 'staff-users' AND data->>'email' = $1`,
      [email],
    )
    const id = existing.rows[0]?.id ?? randomUUID()
    const createdAt = existing.rows[0]?.created_at ?? now
    await pool.query(
      `INSERT INTO store_records (collection, id, data, created_at, updated_at)
       VALUES ('staff-users', $1, $2, $3, $4)
       ON CONFLICT (collection, id) DO UPDATE SET data = $2, updated_at = $4`,
      [id, JSON.stringify(record), createdAt, now],
    )
    return !existing.rows[0]
  } finally {
    await pool.end()
  }
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

  const { hash, salt } = await hashPassword(password)
  const now = new Date().toISOString()
  const record = {
    email,
    name,
    role: 'super-admin',
    department: null,
    passwordHash: hash,
    passwordSalt: salt,
    active: true,
  }

  const databaseUrl = process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL
  const created = databaseUrl
    ? await seedToPostgres(databaseUrl, email, record, now)
    : await seedToFile(email, record, now)

  console.log(`${created ? 'Created' : 'Updated'} super-admin account for ${email}.`)
  console.log('Sign in at /staff/login. Set STAFF_SESSION_SECRET in .env.local first if you have not.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
