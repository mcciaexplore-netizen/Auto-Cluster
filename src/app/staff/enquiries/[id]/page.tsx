import { notFound } from 'next/navigation'
import { redirect } from 'next/navigation'
import { requireStaff } from '@/server/auth'
import { ENQUIRY_STATUSES, getEnquiry } from '@/server/enquiries'
import { getService } from '@/content/services'
import { listAudit } from '@/server/audit'
import { updateStatusAction } from '../../actions'

export const metadata = { title: 'Enquiry — Staff', robots: { index: false, follow: false } }

const FIELD_LABELS: Record<string, string> = {
  partName: 'Part name',
  material: 'Material',
  quantity: 'Quantity',
  tolerance: 'Tolerance',
  deliveryDate: 'Delivery date needed',
  sampleDescription: 'Sample description',
  standardOrTest: 'Standard / test required',
  sampleCount: 'Sample count',
  nablScope: 'NABL scope required',
}

export default async function StaffEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireStaff('enquiries:view')
  const { id } = await params
  const enquiry = await getEnquiry(id)
  if (!enquiry) notFound()
  if (user.role === 'hod' && enquiry.department !== user.department) redirect('/staff/enquiries')

  const service = getService(enquiry.serviceId)
  const history = await listAudit({ targetCollection: 'enquiries', targetId: enquiry.id })

  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <div>
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
        <Row label="Consent given" value={new Date(enquiry.consentAt).toLocaleString('en-IN')} />
        <Row label="Routed to" value={enquiry.routedTo} />
        <Row label="Source page" value={enquiry.source || '—'} />
        {Object.entries(enquiry.fields).map(([key, value]) => (
          <Row key={key} label={FIELD_LABELS[key] ?? key} value={String(value)} />
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
      </section>

      <section className="border border-rule rounded-md bg-white p-5">
        <h2 className="text-[15px] font-semibold m-0 mb-3">Message</h2>
        <p className="text-[14px] text-ink-700 whitespace-pre-wrap m-0">{enquiry.message}</p>
      </section>

      <section className="border border-rule rounded-md bg-white p-5 flex flex-col gap-3">
        <h2 className="text-[15px] font-semibold m-0">Status</h2>
        <form action={updateStatusAction} className="flex items-center gap-3">
          <input type="hidden" name="id" value={enquiry.id} />
          <select
            name="status"
            defaultValue={enquiry.status}
            className="min-h-11 px-3 rounded-md border border-rule-strong text-[14px]"
          >
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="min-h-11 px-5 rounded-full bg-brand-600 text-white font-semibold text-[14px]"
          >
            Update
          </button>
        </form>
      </section>

      {history.length > 0 && (
        <section className="border border-rule rounded-md bg-white p-5">
          <h2 className="text-[15px] font-semibold m-0 mb-3">History</h2>
          <ul className="flex flex-col gap-2 list-none m-0 p-0 text-[13px] text-ink-600">
            {history.map((h) => (
              <li key={h.id}>
                <span className="font-mono text-ink-400">
                  {new Date(h.createdAt).toLocaleString('en-IN')}
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
    <div className="grid grid-cols-[160px_1fr] gap-3">
      <span className="text-ink-400">{label}</span>
      <span className="text-ink-900">{value}</span>
    </div>
  )
}
