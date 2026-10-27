import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { Stamped } from './store-types'

/**
 * The local file-backed store — one JSON file per collection under
 * `.data/db/`, gitignored. Used whenever `DATABASE_URI` is not set, which is
 * the normal case for local development: `npm install && cp .env.example
 * .env.local && npm run dev` works with zero database setup.
 *
 * Fine for local dev; not a substitute for Postgres on a serverless host —
 * Vercel's filesystem is read-only outside `/tmp`, so this backend is never
 * selected there once `DATABASE_URI` is set (see store.ts and
 * store-postgres.ts). Writes go through a per-collection promise queue
 * (`withLock`) so two overlapping requests in the same process can't
 * interleave a read-modify-write and lose an update. That guarantee is
 * process-local — fine for one `next dev` process, not for multiple
 * instances, which is exactly the gap store-postgres.ts closes.
 */

const DATA_DIR = path.join(process.cwd(), '.data', 'db')

const locks = new Map<string, Promise<unknown>>()

function withLock<T>(collection: string, fn: () => Promise<T>): Promise<T> {
  const prior = locks.get(collection) ?? Promise.resolve()
  const next = prior.then(fn, fn)
  locks.set(
    collection,
    next.catch(() => undefined),
  )
  return next
}

async function filePath(collection: string): Promise<string> {
  await mkdir(DATA_DIR, { recursive: true })
  return path.join(DATA_DIR, `${collection}.json`)
}

async function readAll<T>(collection: string): Promise<T[]> {
  const file = await filePath(collection)
  try {
    const raw = await readFile(file, 'utf-8')
    return JSON.parse(raw) as T[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function writeAll<T>(collection: string, records: T[]): Promise<void> {
  const file = await filePath(collection)
  const tmp = `${file}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(records, null, 2), 'utf-8')
  await rename(tmp, file)
}

export async function findAll<T extends Stamped>(collection: string): Promise<T[]> {
  return withLock(collection, () => readAll<T>(collection))
}

export async function findOne<T extends Stamped>(
  collection: string,
  predicate: (record: T) => boolean,
): Promise<T | undefined> {
  const records = await findAll<T>(collection)
  return records.find(predicate)
}

export async function findById<T extends Stamped>(
  collection: string,
  id: string,
): Promise<T | undefined> {
  return findOne<T>(collection, (r) => r.id === id)
}

export async function insert<T extends Stamped>(
  collection: string,
  data: Omit<T, keyof Stamped>,
): Promise<T> {
  return withLock(collection, async () => {
    const records = await readAll<T>(collection)
    const now = new Date().toISOString()
    const record = { ...data, id: randomUUID(), createdAt: now, updatedAt: now } as T
    records.push(record)
    await writeAll(collection, records)
    return record
  })
}

export async function transaction<T extends Stamped, R>(
  collection: string,
  fn: (records: T[]) => { records: T[]; result: R },
): Promise<R> {
  return withLock(collection, async () => {
    const records = await readAll<T>(collection)
    const { records: next, result } = fn(records)
    await writeAll(collection, next)
    return result
  })
}

export async function update<T extends Stamped>(
  collection: string,
  id: string,
  patch: Partial<Omit<T, keyof Stamped>>,
): Promise<T | undefined> {
  return transaction<T, T | undefined>(collection, (records) => {
    const index = records.findIndex((r) => r.id === id)
    if (index === -1) return { records, result: undefined }
    const updated = { ...records[index], ...patch, updatedAt: new Date().toISOString() } as T
    const next = records.slice()
    next[index] = updated
    return { records: next, result: updated }
  })
}

export const append = insert
