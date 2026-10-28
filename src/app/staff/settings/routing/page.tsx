import { requireStaff } from '@/server/auth'
import { listRoutingMap } from '@/server/routing'
import { getService } from '@/content/services'
import { updateRoutingAction } from '../../actions'

export const metadata = { title: 'Routing — Staff', robots: { index: false, follow: false } }

/**
 * "Service-to-department-to-email mapping table, editable by staff, not
 * hardcoded." One row per service; each is its own tiny form so saving one
 * doesn't require re-submitting the whole table.
 */
export default async function StaffRoutingPage() {
  const user = await requireStaff('routing-map:edit')
  const map = await listRoutingMap()

  return (
    <div className="flex flex-col gap-6 max-w-[720px]">
      <div>
        <h1 className="text-[24px] font-display font-semibold m-0">Enquiry routing</h1>
        <p className="mt-1 text-[14px] text-ink-500">
          Which inbox each service's enquiries are emailed to. A service with no row here falls
          back to the marketing inbox and is flagged for review.
        </p>
      </div>

      <div className="border border-rule rounded-md bg-white divide-y divide-rule">
        {map.map((entry) => {
          const service = getService(entry.serviceId)
          return (
            <form
              key={entry.id}
              action={updateRoutingAction}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <input type="hidden" name="serviceId" value={entry.serviceId} />
              <span className="w-56 shrink-0 text-[14px] font-semibold text-ink-900">
                {service?.label ?? entry.serviceId}
              </span>
              <input
                type="email"
                name="email"
                defaultValue={entry.email}
                required
                className="flex-1 min-h-10 px-3 rounded-md border border-rule-strong text-[13.5px]"
              />
              <button
                type="submit"
                className="min-h-10 px-4 rounded-full border border-rule-strong text-[13px] font-semibold"
              >
                Save
              </button>
            </form>
          )
        })}
      </div>

      <p className="text-[12.5px] text-ink-400">Signed in as {user.email}.</p>
    </div>
  )
}
