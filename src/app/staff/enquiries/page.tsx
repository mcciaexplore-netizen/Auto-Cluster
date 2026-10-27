import Link from 'next/link'
import { requireStaff } from '@/server/auth'
import { can, departmentScope } from '@/server/roles'
import { ENQUIRY_STATUSES, listEnquiries, type EnquiryFilters } from '@/server/enquiries'
import { getService } from '@/content/services'
import { departments } from '@/lib/validation'

export const metadata = { title: 'Enquiries — Staff', robots: { index: false, follow: false } }
const control = 'w-full min-h-11 px-3 rounded-md border border-rule-strong bg-white font-normal'
const pageSize = 25

export default async function StaffEnquiriesPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireStaff('enquiries:view')
  const params = await searchParams
  const value = (key: string) => typeof params[key] === 'string' ? params[key] as string : ''
  const query = value('query').trim().slice(0, 120)
  const status = ENQUIRY_STATUSES.find((s) => s === value('status'))
  const department = departments.find((d) => d === value('department'))
  const ownership = (['all', 'mine', 'unassigned'] as const).find((o) => o === value('ownership')) ?? 'all'
  const filters: EnquiryFilters = { query, status, department, ownership, needsRoutingReview: value('routing') === 'review' }
  const enquiries = await listEnquiries(user, filters)
  const pages = Math.max(1, Math.ceil(enquiries.length / pageSize))
  const requestedPage = /^\d{1,6}$/.test(value('page')) ? Number(value('page')) : 1
  const page = Math.max(1, Math.min(requestedPage, pages))
  const start = (page - 1) * pageSize
  const visible = enquiries.slice(start, start + pageSize)
  const scope = departmentScope(user)
  const pageLink = (nextPage: number) => {
    const next = new URLSearchParams()
    if (query) next.set('query', query)
    if (status) next.set('status', status)
    if (department) next.set('department', department)
    if (ownership !== 'all') next.set('ownership', ownership)
    if (filters.needsRoutingReview) next.set('routing', 'review')
    next.set('page', String(nextPage))
    return '/staff/enquiries?' + next
  }

  return <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-[24px] font-display font-semibold m-0">Enquiries</h1>
      <p className="mt-1 text-[14px] text-ink-500">
        {can(user, 'enquiries:view-all-departments') ? 'All departments' : scope ? scope[0].toUpperCase() + scope.slice(1) + ' department' : 'No department access'} · Find requests, review ownership and track progress.
      </p>
    </div>
    <form key={[query, status, department, ownership, filters.needsRoutingReview].join('|')} action="/staff/enquiries" method="get" className="p-5 border border-rule rounded-md bg-white space-y-4" aria-label="Filter enquiries">
      <label className="flex flex-col gap-2 text-sm font-medium">Search enquiries
        <input type="search" name="query" defaultValue={query} maxLength={120} placeholder="Reference, name, company, email or service" className={control} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium">Status
          <select name="status" defaultValue={status ?? ''} className={control}>
            <option value="">All statuses</option>
            {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase()}{s.slice(1)}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">Ownership
          <select name="ownership" defaultValue={ownership} className={control}>
            <option value="all">All owners</option><option value="mine">Assigned to me</option><option value="unassigned">Unassigned</option>
          </select>
        </label>
        {can(user, 'enquiries:view-all-departments') && <label className="flex flex-col gap-2 text-sm font-medium">Department
          <select name="department" defaultValue={department ?? ''} className={control}>
            <option value="">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d[0].toUpperCase()}{d.slice(1)}</option>)}
          </select>
        </label>}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <label className="text-sm inline-flex items-center gap-2 min-h-11"><input type="checkbox" name="routing" value="review" defaultChecked={filters.needsRoutingReview} />Needs routing review</label>
        <button type="submit" className="min-h-11 px-5 rounded-full bg-brand-600 text-white font-semibold text-sm">Apply filters</button>
        <Link href="/staff/enquiries" className="text-sm inline-flex items-center min-h-11">Clear filters</Link>
      </div>
    </form>
    <p className="text-sm text-ink-500 m-0" aria-live="polite">
      {enquiries.length ? 'Showing ' + (start + 1) + '–' + Math.min(start + pageSize, enquiries.length) + ' of ' + enquiries.length + ' enquiries' : 'No enquiries match these filters.'}
    </p>
    {visible.length > 0 && <div className="overflow-x-auto border border-rule rounded-md bg-white">
      <table className="w-full text-[13.5px] border-collapse">
        <caption className="sr-only">Enquiries matching your filters, newest first</caption>
        <thead><tr className="border-b border-rule text-left">
          {['Reference', 'Service', 'From', 'Owner', 'Status', 'Received (IST)'].map((title) => <th key={title} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{title}</th>)}
        </tr></thead>
        <tbody>{visible.map((e) => <tr key={e.id} className="border-b border-rule last:border-0">
          <td className="px-4 py-3"><Link href={'/staff/enquiries/' + e.id} className="font-mono text-brand-800 whitespace-nowrap">{e.referenceCode}</Link>{e.needsRoutingReview && <span className="block mt-1 font-mono text-[10px] uppercase text-warning">Needs routing</span>}</td>
          <td className="px-4 py-3">{getService(e.serviceId)?.label ?? e.serviceId}</td>
          <td className="px-4 py-3">{e.name}{e.company && <span className="block text-ink-500">{e.company}</span>}</td>
          <td className="px-4 py-3">{e.owner ? e.owner.name + (e.owner.active ? '' : ' (inactive)') : e.assignedTo ? 'Former staff member' : <span className="text-ink-500">Unassigned</span>}</td>
          <td className="px-4 py-3"><span className="font-mono text-[11px] uppercase">{e.status}</span></td>
          <td className="px-4 py-3 text-ink-500 whitespace-nowrap">{new Date(e.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}</td>
        </tr>)}</tbody>
      </table>
    </div>}
    {pages > 1 && <nav aria-label="Enquiry pages" className="flex flex-wrap items-center gap-5 text-sm">
      {page > 1 && <Link href={pageLink(page - 1)} className="inline-flex items-center min-h-11">← Previous</Link>}
      <span>Page {page} of {pages}</span>
      {page < pages && <Link href={pageLink(page + 1)} className="inline-flex items-center min-h-11">Next →</Link>}
    </nav>}
  </div>
}
