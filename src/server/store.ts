import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * The interim record store — stands in for the Payload/Postgres connection
 * described in README.md "Connecting Payload", which needs a live database
 * that does not exist yet. Every collection here is shaped to match its
 * counterpart in src/payload/collections/ exactly, so swapping a call in
 * this file for a Payload local-API call is the same one-line-per-call
 * change the README already promises for the read-only src/content/ modules.
 *
 * One JSON file per collection under `.data/db/`, gitignored. Writes go
 * through a per-collection promise queue (`withLock`) so two overlapping
 * requests in the same process can't interleave a read-modify-write and lose
 * an update — the property `transaction()` exists for. That guarantee is
 * process-local: it does not hold across multiple server instances, which is
 * exactly the gap a real database closes. Fine for local dev, staging and a
 * single-instance deploy; not a substitute for Postgres at scale.
 */

const DATA_DIR = path.join(process.cwd(), '.data', 'db')

const locks = new Map<string, Promise<unknown>>()

/** Serialises every read-modify-write against one collection's file. */
function withLock<T>(collection: string, fn: () => Promise<T>): Promise<T> {
  const prior = locks.get(collection) ?? Promise.resolve()
  const next = prior.then(fn, fn)
  // Swallow so one failed operation doesn't wedge the queue for the next.
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

/** Write-temp-then-rename so a crash mid-write never truncates the file. */
async function writeAll<T>(collection: string, records: T[]): Promise<void> {
  const file = await filePath(collection)
  const tmp = `${file}.${randomUUID()}.tmp`
  await writeFile(tmp, JSON.stringify(records, null, 2), 'utf-8')
  await rename(tmp, file)
}

export interface Stamped {
  id: string
  createdAt: string
  updatedAt: string
}

/** Every record in every collection. */
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

/**
 * Read-modify-write under the collection's lock — the primitive every
 * "don't lose a concurrent update" requirement (seat counts, hold slots,
 * enquiry status) is built on. `fn` receives the current array and returns
 * the next one; whatever it also returns as `result` comes back to the
 * caller.
 */
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

/**
 * Append-only insert with no corresponding update/delete export from this
 * module — the shape `audit.ts` relies on to keep the log immutable.
 */
export const append = insert
