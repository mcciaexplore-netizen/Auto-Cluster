import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireStaff } from '@/server/auth'
import { ENQUIRY_STATUSES, getEnquiry, listEnquiryAssignees } from '@/server/enquiries'
import { can } from '@/server/roles'
import { StaffForm } from '@/components/StaffForm'
import { getService } from '@/content/services'
import { applicantTypeLabels, type ApplicantType } from '@/lib/validation'
import { listAudit } from '@/server/audit'
import { assignEnquiryAction, updateStatusAction } from '../../actions'

export const metadata = { title: 'Enquiry — Staff', robots: { index: false, follow: false } }

const FIELD_LABELS: Record<string, string> = {
  venueSlug: 'Venue', roomUse: 'Room use', startsAt: 'Start (IST)', endsAt: 'End (IST)', attendees: 'Attendees', eventType: 'Event type', floorPlanRequested: 'Floor plan requested', wifiRequired: 'Wi-Fi required', parkingRequired: 'Parking required', startupName: 'Startup name', stage: 'Startup stage', supportNeeded: 'Support needed',
  partName: 'Part name',
  material: 'Material',
  quantity: 'Quantity',
  tolerance: 'Tolerance',
  deliveryDate: 'Delivery date needed',
  sampleDescription: 'Sample description',
  standardOrTest: 'Standard / test required',
  sampleCount: 'Sample count',
  nablScope: 'NABL scope required',
  applicantType: 'Applicant type',
  position: 'Applying for',
  education: 'Education / qualification',
}

function fieldValue(key: string, value: string | boolean): string {
  if (key === 'applicantType') return applicantTypeLabels[value as ApplicantType] ?? String(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function dateTime(value: string) {
  return new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
}

export default async function StaffEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireStaff('enquiries:view')
  const { id } = await params
  const enquiry = await getEnquiry(id, user)
  if (!enquiry) notFound()

  const service = getService(enquiry.serviceId)
  const [history, assignees] = await Promise.all([
    listAudit({ targetCollection: 'enquiries', targetId: enquiry.id }),
    listEnquiryAssignees(enquiry.id, user),
  ])

  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <div>
        <Link href="/staff/enquiries" className="inline-block mb-5 text-sm">← Enquiries</Link>
        <p className="font-mono text-[12px] text-ink-400 m-0">{enquiry.referenceCode}</p>
        <h1 className="text-[24px] font-display font-semibold m-0">{service?.label ?? enquiry.serviceId}</h1>
        {enquiry.needsRoutingReview && (
          <p className="mt-2 font-mono text-[11px] uppercase text-warning">
            No routing mapped for this service — sent to the fallback inbox.
          </p>
        )}
      </div>

      <section className="border border-rule rounded-md bg-white p-5 flex flex-col gap-2 text-[14px]">
        <Row label="Name" value={enquiry.name} />
        <Row label="Company" value={enquiry.company || '—'} />
        <Row label="Email" value={enquiry.email} />
        <Row label="Phone" value={enquiry.phone} />
        <Row label="Subject" value={enquiry.subject || '—'} />
        <Row label="Consent given" value={dateTime(enquiry.consentAt)} />
        <Row label="Routed to" value={enquiry.routedTo} />
        <Row label="Source page" value={enquiry.source || '—'} />
        {Object.entries(enquiry.fields).map(([key, value]) => (
          <Row key={key} label={FIELD_LABELS[key] ?? key} value={fieldValue(key, value)} />
        ))}
        {enquiry.cadFileToken && (
          <Row
            label="Attachment"
            value={
              <a href={`/api/files/${enquiry.cadFileToken}`} className="text-brand-800 underline">
                Download
              </a>
            }
          />
        )}
        {enquiry.resumeFileToken && (
          <Row
            label="Résumé"
            value={
              <a href={`/api/files/${enquiry.resumeFileToken}`} className="text-brand-800 underline">
                Download
              </a>
            }
          />
        )}
      </section>

      <section className="border border-rule rounded-md bg-white p-5">
        <h2 className="text-[15px] font-semibold m-0 mb-3">Message</h2>
        <p className="text-[14px] text-ink-700 whitespace-pre-wrap m-0">{enquiry.message}</p>
      </section>

      <section className="border border-rule rounded-md bg-white p-5 flex flex-col gap-3">
        <h2 className="text-[15px] font-semibold m-0">Owner</h2>
        <p className="m-0 text-sm">{enquiry.owner ? `${enquiry.owner.name}${enquiry.owner.active ? '' : ' (inactive)'}` : enquiry.assignedTo ? 'Former staff member' : 'Unassigned'}</p>
        {enquiry.assignedAt && <p className="text-xs text-ink-500 m-0">Last assignment change: {dateTime(enquiry.assignedAt)}</p>}
        {can(user, 'enquiries:assign') && <StaffForm action={assignEnquiryAction} label="Save owner">
          <input type="hidden" name="id" value={enquiry.id} />
          <input type="hidden" name="expectedAssigneeId" value={enquiry.assignedTo ?? ''} />
          <label className="flex flex-col gap-2 text-sm">Assign to
            <select key={enquiry.assignedTo ?? 'unassigned'} name="assigneeId" defaultValue={enquiry.assignedTo ?? ''} className="w-full min-h-11 px-3 rounded-md border border-rule-strong">
              <option value="">Unassigned</option>
              {enquiry.assignedTo && !assignees.some((u) => u.id === enquiry.assignedTo) && <option value={enquiry.assignedTo} disabled>{enquiry.owner?.name ?? 'Former staff member'} (unavailable)</option>}
              {assignees.map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
            </select>
          </label>
          <p className="text-xs text-ink-500 m-0">Only active staff with access to this department can be assigned. A new enquiry moves to Assigned when an owner is selected.</p>
        </StaffForm>}
      </section>

      <section className="border border-rule rounded-md bg-white p-5 flex flex-col gap-3">
        <h2 className="text-[15px] font-semibold m-0">Status</h2>
        {can(user, 'enquiries:update-status') ? <StaffForm action={updateStatusAction} label="Update status">
          <input type="hidden" name="id" value={enquiry.id} />
          <input type="hidden" name="expectedStatus" value={enquiry.status} />
          <label className="flex flex-col gap-2 text-sm">Enquiry status<select
            key={enquiry.status}
            name="status"
            defaultValue={enquiry.status}
            className="w-full min-h-11 px-3 rounded-md border border-rule-strong text-[14px]"
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s} disabled={s === 'assigned' && !enquiry.assignedTo}>
                {s}
              </option>
            ))}
          </select></label>
        </StaffForm> : <p className="m-0 text-sm capitalize">{enquiry.status}</p>}
        {enquiry.booking && can(user, 'bookings:approve') && <Link href={`/staff/bookings?query=${encodeURIComponent(enquiry.referenceCode)}`} className="text-sm">Review venue approval and payment status →</Link>}
      </section>

      {history.length > 0 && (
        <section className="border border-rule rounded-md bg-white p-5">
          <h2 className="text-[15px] font-semibold m-0 mb-3">History</h2>
          <ul className="flex flex-col gap-2 list-none m-0 p-0 text-[13px] text-ink-600">
            {history.map((h) => (
              <li key={h.id}>
                <span className="font-mono text-ink-400">
                  {dateTime(h.createdAt)}
                </span>{' '}
                — {h.summary}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-3 break-words">
      <span className="text-ink-400">{label}</span>
      <span className="text-ink-900">{value}</span>
    </div>
  )
}
