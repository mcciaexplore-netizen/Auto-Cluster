import * as postgres from './store-postgres'
import * as file from './store-file'
import { resolveDatabaseUrl } from './db'
import type { Stamped } from './store-types'

export type { Stamped } from './store-types'

/**
 * The operational record store — staff users, enquiries, bookings, events,
 * media, rates, uploads metadata, venue documents, audit log, routing map.
 *
 * Dispatches to one of two backends by whether `DATABASE_URI` is set:
 *
 * - Unset (the normal case for local dev — `npm install && cp .env.example
 *   .env.local && npm run dev` needs no database): store-file.ts, one JSON
 *   file per collection under `.data/db/`, gitignored.
 * - Set: store-postgres.ts. REQUIRED on Vercel — its filesystem is
 *   read-only outside `/tmp`, so store-file.ts crashes every page that
 *   touches it there. Set `DATABASE_URI` in the Vercel project's
 *   environment variables (Production + Preview) before deploying.
 *
 * Every caller across the app imports `findAll`, `findOne`, `findById`,
 * `insert`, `transaction`, `update` or `append` from here and knows nothing
 * about which backend is live — both implement the exact same signatures.
 */
function backend() {
  return resolveDatabaseUrl() ? postgres : file
}

export function findAll<T extends Stamped>(collection: string): Promise<T[]> {
  return backend().findAll<T>(collection)
}

export function findOne<T extends Stamped>(
  collection: string,
  predicate: (record: T) => boolean,
): Promise<T | undefined> {
  return backend().findOne<T>(collection, predicate)
}

export function findById<T extends Stamped>(collection: string, id: string): Promise<T | undefined> {
  return backend().findById<T>(collection, id)
}

export function insert<T extends Stamped>(
  collection: string,
  data: Omit<T, keyof Stamped>,
): Promise<T> {
  return backend().insert<T>(collection, data)
}

export function transaction<T extends Stamped, R>(
  collection: string,
  fn: (records: T[]) => { records: T[]; result: R },
): Promise<R> {
  return backend().transaction<T, R>(collection, fn)
}

export function update<T extends Stamped>(
  collection: string,
  id: string,
  patch: Partial<Omit<T, keyof Stamped>>,
): Promise<T | undefined> {
  return backend().update<T>(collection, id, patch)
}

/**
 * Append-only insert with no corresponding update/delete export from this
 * module — the shape `audit.ts` relies on to keep the log immutable.
 */
export function append<T extends Stamped>(collection: string, data: Omit<T, keyof Stamped>): Promise<T> {
  return backend().insert<T>(collection, data)
}
