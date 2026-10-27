import { getPool } from './db'

/** Postgres-backed file bytes — used whenever `DATABASE_URI` is set (see files.ts). */

export async function saveFileBytes(storedName: string, bytes: Buffer): Promise<void> {
  const pool = await getPool()
  await pool.query(
    'INSERT INTO stored_files (stored_name, bytes) VALUES ($1, $2) ON CONFLICT (stored_name) DO UPDATE SET bytes = $2',
    [storedName, bytes],
  )
}

export async function readFileBytes(storedName: string): Promise<Buffer> {
  const pool = await getPool()
  const { rows } = await pool.query<{ bytes: Buffer }>(
    'SELECT bytes FROM stored_files WHERE stored_name = $1',
    [storedName],
  )
  if (!rows[0]) throw new Error(`File not found: ${storedName}`)
  return rows[0].bytes
}

export async function fileBytesExist(storedName: string): Promise<boolean> {
  const pool = await getPool()
  const { rows } = await pool.query('SELECT 1 FROM stored_files WHERE stored_name = $1', [storedName])
  return rows.length > 0
}
