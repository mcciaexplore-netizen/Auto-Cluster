#!/usr/bin/env node
/**
 * One-time import of the legacy Google Form's response export
 * (forms.gle/xYZnEyN2NqiF3ySD6 — see src/lib/validation.ts) into the
 * `enquiries` collection this codebase now owns, so launch doesn't start
 * from zero history.
 *
 * Usage:
 *   node scripts/import-google-form.mjs path/to/responses.csv
 *
 * Export the form's responses from Google Sheets as CSV first
 * (File > Download > Comma-separated values) and point this at that file.
 *
 * COLUMN_MAP below is a guess at Google Forms' default header names — adjust
 * the right-hand side to match the actual export's header row before
 * running. Not run automatically anywhere: this is a launch-day operator
 * script, not part of the build.
 *
 * Plain ESM, no TypeScript and no `@/` imports on purpose — this needs to
 * run standalone with `node`, the same reasoning redirects.mjs is plain JS.
 * It writes directly into `.data/db/enquiries.json` in the same record
 * shape src/server/enquiries.ts produces, so imported rows are
 * indistinguishable from ones the live form created, except for
 * `source: 'google-form-import'`.
 */

import { randomBytes, randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

const COLUMN_MAP = {
  timestamp: 'Timestamp',
  name: 'Name',
  company: 'Company',
  email: 'Email Address',
  phone: 'Phone Number',
  message: 'Message',
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function referenceCode() {
  const year = new Date().getFullYear()
  let suffix = ''
  const bytes = randomBytes(6)
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length]
  return `AC-${year}-${suffix}`
}

/** Minimal RFC 4180 CSV parser — handles quoted fields, escaped quotes, and commas/newlines inside quotes. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

async function main() {
  const csvPath = process.argv[2]
  if (!csvPath) {
    console.error('Usage: node scripts/import-google-form.mjs path/to/responses.csv')
    process.exit(1)
  }

  const raw = await readFile(csvPath, 'utf-8')
  const rows = parseCsv(raw)
  const [header, ...body] = rows
  const col = Object.fromEntries(
    Object.entries(COLUMN_MAP).map(([key, headerName]) => [key, header.indexOf(headerName)]),
  )

  const missing = Object.entries(col).filter(([, idx]) => idx === -1)
  if (missing.length > 0) {
    console.error(
      `These columns from COLUMN_MAP were not found in the CSV header: ${missing.map(([k]) => k).join(', ')}.`,
    )
    console.error(`CSV header was: ${header.join(' | ')}`)
    console.error('Edit COLUMN_MAP at the top of this script to match, then re-run.')
    process.exit(1)
  }

  const dataDir = path.join(process.cwd(), '.data', 'db')
  await mkdir(dataDir, { recursive: true })
  const file = path.join(dataDir, 'enquiries.json')
  let existing = []
  try {
    existing = JSON.parse(await readFile(file, 'utf-8'))
  } catch {
    existing = []
  }
  const existingRefs = new Set(existing.map((r) => r.referenceCode))

  let imported = 0
  for (const r of body) {
    const now = new Date().toISOString()
    const timestampRaw = r[col.timestamp]
    const consentAt = timestampRaw && !isNaN(Date.parse(timestampRaw)) ? new Date(timestampRaw).toISOString() : now

    let code = referenceCode()
    while (existingRefs.has(code)) code = referenceCode()
    existingRefs.add(code)

    existing.push({
      id: randomUUID(),
      createdAt: consentAt,
      updatedAt: now,
      referenceCode: code,
      serviceId: 'general',
      kind: 'general',
      department: 'general',
      name: r[col.name] || '(no name given)',
      company: r[col.company] || '',
      email: r[col.email] || '',
      phone: r[col.phone] || '',
      subject: '',
      message: r[col.message] || '',
      consentAt,
      fields: {},
      cadFileToken: null,
      status: 'new',
      routedTo: 'marketing@autoclusterpune.org',
      needsRoutingReview: true,
      source: 'google-form-import',
      followUpDueAt: now,
      followUpSentAt: now, // imported rows are historical — don't nudge anyone about them
    })
    imported++
  }

  const tmp = `${file}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(existing, null, 2), 'utf-8')
  await rename(tmp, file)

  console.log(`Imported ${imported} rows into ${file}.`)
  console.log('Every imported row is flagged needsRoutingReview so staff triage them explicitly.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
