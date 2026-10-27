import { randomUUID } from 'node:crypto'
import { getPool } from './db'
import type { Stamped } from './store-types'

/**
 * The Postgres-backed store — one JSONB row per record in a single
 * `store_records` table (see src/server/db.ts), keyed by (collection, id).
 * Selected by store.ts whenever `DATABASE_URI` is set — required on Vercel,
 * where the filesystem outside `/tmp` is read-only and store-file.ts's
 * local JSON files simply crash the page.
 */

interface Row {
  id: string
  data: unknown
  created_at: Date
  updated_at: Date
}

function rowToRecord<T extends Stamped>(row: Row): T {
  return {
    ...(row.data as object),
    id: row.id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  } as T
}

export async function findAll<T extends Stamped>(collection: string): Promise<T[]> {
  const pool = await getPool()
  const { rows } = await pool.query<Row>(
    'SELECT id, data, created_at, updated_at FROM store_records WHERE collection = $1 ORDER BY created_at',
    [collection],
  )
  return rows.map((row) => rowToRecord<T>(row))
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
  const pool = await getPool()
  const id = randomUUID()
  const now = new Date()
  await pool.query(
    'INSERT INTO store_records (collection, id, data, created_at, updated_at) VALUES ($1, $2, $3, $4, $4)',
    [collection, id, JSON.stringify(data), now],
  )
  return { ...(data as object), id, createdAt: now.toISOString(), updatedAt: now.toISOString() } as T
}

/**
 * Read-modify-write under a Postgres transaction-scoped advisory lock keyed
 * on the collection name — serialises concurrent writers across every
 * server instance, not just within one process, closing the gap
 * store-file.ts's in-process lock leaves open.
 */
export async function transaction<T extends Stamped, R>(
  collection: string,
  fn: (records: T[]) => { records: T[]; result: R },
): Promise<R> {
  const pool = await getPool()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [collection])

    const { rows } = await client.query<Row>(
      'SELECT id, data, created_at, updated_at FROM store_records WHERE collection = $1 ORDER BY created_at',
      [collection],
    )
    const current = rows.map((row) => rowToRecord<T>(row))
    const { records: next, result } = fn(current)

    const nextIds = new Set(next.map((r) => r.id))
    for (const record of current) {
      if (!nextIds.has(record.id)) {
        await client.query('DELETE FROM store_records WHERE collection = $1 AND id = $2', [
          collection,
          record.id,
        ])
      }
    }
    for (const record of next) {
      const { id, createdAt, updatedAt, ...data } = record
      await client.query(
        `INSERT INTO store_records (collection, id, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (collection, id) DO UPDATE SET data = $3, updated_at = $5`,
        [collection, id, JSON.stringify(data), createdAt, updatedAt],
      )
    }

    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
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
