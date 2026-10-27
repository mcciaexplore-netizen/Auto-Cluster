import Link from 'next/link'
import { getStaffSession } from '@/server/auth'
import { can } from '@/server/roles'
import { logoutAction } from './actions'
export const metadata = { robots: { index: false, follow: false } }

/**
 * The staff console shell. Deliberately outside the `(site)` route group —
 * no public Header/Footer/LocalBusiness schema, an internal tool rather than
 * a page of the marketing site. Chrome only renders once a session exists;
 * /staff/login (and any page a signed-out visit lands on) renders its
 * children alone.
 */
export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffSession()

  return (
    <>
      {user && (
        <header className="border-b border-rule bg-white">
          <div className="max-w-[1100px] mx-auto px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <nav className="flex flex-wrap items-center gap-5 text-[14px]">
              <Link href="/staff" className="font-semibold text-brand-800 no-underline">
                Auto Cluster · Staff
              </Link>
              {(can(user, 'bookings:approve') || can(user, 'payments:record')) && <Link href="/staff/bookings">Bookings</Link>}
              {can(user, 'bookings:approve') && <Link href="/staff/venues">Venue documents</Link>}
              {can(user, 'rates:manage') && <Link href="/staff/rates">Rates</Link>}
              {can(user, 'events:manage') && <Link href="/staff/events">Events</Link>}
              {can(user, 'media:manage') && <Link href="/staff/media">Media</Link>}
              {can(user, 'staff:manage') && <Link href="/staff/users">Staff accounts</Link>}
              {can(user, 'enquiries:view') && <Link href="/staff/enquiries" className="text-ink-700 no-underline hover:text-brand-600">
                Enquiries
              </Link>}
              {can(user, 'routing-map:view') && (
                <Link
                  href="/staff/settings/routing"
                  className="text-ink-700 no-underline hover:text-brand-600"
                >
                  Routing
                </Link>
              )}
              {can(user, 'audit-log:view') && (
                <Link href="/staff/audit-log" className="text-ink-700 no-underline hover:text-brand-600">
                  Audit log
                </Link>
              )}
            </nav>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-ink-500">
              <span>
                {user.name} · <span className="font-mono uppercase">{user.role}</span>
              </span>
              <form action={logoutAction}>
                <button type="submit" className="text-brand-800 underline underline-offset-2">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      <main className="max-w-[1100px] min-w-0 mx-auto px-6 py-10">{children}</main>
    </>
  )
}
