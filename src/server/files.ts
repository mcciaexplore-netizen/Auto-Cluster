import * as postgres from './files-postgres'
import * as local from './files-local'
import { resolveDatabaseUrl } from './db'

/**
 * Raw file bytes (résumés, CAD drawings, venue floor plans). Dispatches by
 * `DATABASE_URI`, same as store.ts: local disk (files-local.ts) when unset
 * — the normal case for local dev — or Postgres `bytea` (files-postgres.ts)
 * when set, required on Vercel where local disk is read-only. The record
 * metadata (token, original filename, mime type) always lives in
 * `store_records` via src/server/store.ts, unchanged either way.
 */
function backend() {
  return resolveDatabaseUrl() ? postgres : local
}

export function saveFileBytes(storedName: string, bytes: Buffer): Promise<void> {
  return backend().saveFileBytes(storedName, bytes)
}

export function readFileBytes(storedName: string): Promise<Buffer> {
  return backend().readFileBytes(storedName)
}

export function fileBytesExist(storedName: string): Promise<boolean> {
  return backend().fileBytesExist(storedName)
}
