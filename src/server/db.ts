import { Pool } from 'pg'

/**
 * Shared Postgres pool for the operational store (src/server/store.ts,
 * files.ts) — the staff/enquiry/booking/event/rate/upload data that used to
 * live in local JSON files under `.data/`. That worked for local dev but not
 * on Vercel: serverless functions have a read-only filesystem outside
 * `/tmp`, so every read/write there threw and crashed the page.
 *
 * Connection string resolution checks three names, in order: `DATABASE_URI`
 * (what this codebase names it everywhere else — docs, .env.example),
 * `DATABASE_URL` and `POSTGRES_URL` (what Vercel's own Postgres/Neon
 * integration auto-creates when you "Connect" a database to the project —
 * the exact name depends on the prefix chosen on that screen). Whichever is
 * set decides the store backend in store.ts/files.ts too, so they always
 * agree on whether Postgres is configured.
 */
export function resolveDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL
}

let pool: Pool | undefined
let schemaReady: Promise<void> | undefined

function createPool(): Pool {
  const connectionString = resolveDatabaseUrl()
  if (!connectionString) {
    throw new Error('DATABASE_URI (or DATABASE_URL / POSTGRES_URL) is not set.')
  }
  // Managed Postgres (Vercel Postgres, Neon, Supabase) requires TLS and
  // presents a cert most Node trust stores don't chain to directly; a local
  // database has neither TLS nor that problem.
  const isLocal = /^(postgres(ql)?:\/\/)?[^@]*@?(localhost|127\.0\.0\.1)/.test(connectionString)
  return new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    max: 5,
  })
}

async function ensureSchema(p: Pool): Promise<void> {
  await p.query(`
    CREATE TABLE IF NOT EXISTS store_records (
      collection text NOT NULL,
      id uuid NOT NULL,
      data jsonb NOT NULL,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL,
      PRIMARY KEY (collection, id)
    );
    CREATE INDEX IF NOT EXISTS store_records_collection_idx ON store_records (collection);

    CREATE TABLE IF NOT EXISTS stored_files (
      stored_name text PRIMARY KEY,
      bytes bytea NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `)
}

/** Lazily creates the pool and applies the (idempotent) schema once per process. */
export async function getPool(): Promise<Pool> {
  if (!pool) pool = createPool()
  if (!schemaReady) schemaReady = ensureSchema(pool)
  await schemaReady
  return pool
}
