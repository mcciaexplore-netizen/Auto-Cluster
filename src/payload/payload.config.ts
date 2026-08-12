import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { collections, Equipment } from './collections'
import { globals } from './globals'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Payload configuration.
 *
 * NOT yet wired into next.config.mjs — that step needs a live PostgreSQL
 * instance and the `@payloadcms/next` + `@payloadcms/db-postgres` packages.
 * See README.md "Connecting Payload". The schema is complete and type-checked
 * so it can be reviewed now; the site currently renders from the typed content
 * modules in src/content/, which share the same shapes.
 */
export default buildConfig({
  admin: {
    user: 'users',
    meta: { titleSuffix: ' · Auto Cluster' },
  },

  collections: [
    // Authoring users. Payload requires an auth-enabled collection.
    {
      slug: 'users',
      auth: true,
      admin: { useAsTitle: 'email', group: 'Settings' },
      fields: [
        { name: 'name', type: 'text' },
        {
          name: 'role',
          type: 'select',
          defaultValue: 'editor',
          options: [
            { label: 'Administrator', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
        },
      ],
    },
    Equipment,
    ...collections,
  ],

  globals,

  // Postgres, per docs/audit/00-ARCHITECTURE.md §1. Uncomment once
  // @payloadcms/db-postgres is installed and DATABASE_URI is set.
  //
  // db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: { outputFile: path.resolve(dirname, '../lib/payload-types.ts') },

  // India data residency may make Vercel unsuitable — CONTENT_QUESTIONS CQ-60.
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
} as Parameters<typeof buildConfig>[0])
