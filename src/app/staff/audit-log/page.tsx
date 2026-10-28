import { requireStaff } from '@/server/auth'
import { listAudit } from '@/server/audit'

export const metadata = { title: 'Audit log — Staff', robots: { index: false, follow: false } }

export default async function StaffAuditLogPage() {
  await requireStaff('audit-log:view')
  const entries = await listAudit()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-display font-semibold m-0">Audit log</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Every status change, routing edit and sign-in, oldest last, immutable. {entries.length}{' '}
          entries.
        </p>
      </div>

      <div className="border border-rule rounded-md bg-white divide-y divide-rule">
        {entries.length === 0 && <p className="px-5 py-4 text-ink-500">Nothing logged yet.</p>}
        {entries.map((e) => (
          <div key={e.id} className="px-5 py-3.5 text-[13.5px]">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase text-brand-600">{e.action}</span>
              <span className="font-mono text-[11px] text-ink-400">
                {new Date(e.createdAt).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="mt-1 text-ink-800 m-0">{e.summary}</p>
            <p className="mt-0.5 text-[12px] text-ink-400 m-0">
              {e.actorEmail ? `${e.actorEmail} (${e.actorRole})` : 'System'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
