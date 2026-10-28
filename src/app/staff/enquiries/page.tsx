import Link from 'next/link'
import { requireStaff } from '@/server/auth'
import { departmentScope } from '@/server/roles'
import { listEnquiries } from '@/server/enquiries'
import { getService } from '@/content/services'

export const metadata = { title: 'Enquiries — Staff', robots: { index: false, follow: false } }

export default async function StaffEnquiriesPage() {
  const user = await requireStaff('enquiries:view')
  const enquiries = await listEnquiries({ department: departmentScope(user) })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-display font-semibold m-0">Enquiries</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          {user.role === 'hod'
            ? `Scoped to ${user.department} — ${enquiries.length} enquiries.`
            : `${enquiries.length} enquiries, every department.`}
        </p>
      </div>

      {enquiries.length === 0 ? (
        <p className="text-ink-500">Nothing here yet.</p>
      ) : (
        <div className="overflow-x-auto border border-rule rounded-md bg-white">
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr className="border-b border-rule text-left">
                <th className="px-4 py-2.5 font-semibold">Reference</th>
                <th className="px-4 py-2.5 font-semibold">Service</th>
                <th className="px-4 py-2.5 font-semibold">From</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-b border-rule last:border-0">
                  <td className="px-4 py-2.5">
                    <Link href={`/staff/enquiries/${e.id}`} className="font-mono text-brand-800">
                      {e.referenceCode}
                    </Link>
                    {e.needsRoutingReview && (
                      <span className="ml-2 font-mono text-[10px] uppercase text-warning">
                        needs routing
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{getService(e.serviceId)?.label ?? e.serviceId}</td>
                  <td className="px-4 py-2.5">
                    {e.name}
                    {e.company && <span className="text-ink-400"> · {e.company}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-mono text-[11px] uppercase">{e.status}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-500">
                    {new Date(e.createdAt).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
