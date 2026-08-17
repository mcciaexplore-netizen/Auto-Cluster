'use client'

import { useRef, useState } from 'react'
import { enquirySchema, fieldErrors } from '@/lib/validation'
import { services, getService } from '@/content/services'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/cn'

type Status = 'idle' | 'submitting' | 'success' | 'error'
type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; name: string }
  | { status: 'done'; name: string; token: string }
  | { status: 'error'; name: string; message: string }

/**
 * The one enquiry form — now the services list beside it too. Picking a
 * service both narrows which fields show (manufacturing vs testing vs plain
 * message, per the requirement list) and sets which team the enquiry is
 * routed to (src/content/services.ts -> src/server/routing.ts). Venue hire
 * hands off to its own booking page rather than collecting fields here a
 * second time.
 *
 * `lockedServiceId` is for pages that already know the service — /venues/book
 * embeds this with the picker hidden, exactly as it did before this form grew
 * one.
 *
 * `categoryPicker` is for pages that arrive already scoped to one machine —
 * /contact?machine=… — where the full ten-option sidebar (venue hire,
 * careers, tenders…) makes no sense next to a specific machine's enquiry.
 * It swaps the sidebar for one inline `<select>` of just the five equipment
 * categories, defaulted to the machine's own category but changeable.
 */
export function EnquiryForm({
  defaultServiceId = 'general',
  defaultSubject = '',
  lockedServiceId,
  categoryPicker = false,
}: {
  defaultServiceId?: string
  defaultSubject?: string
  lockedServiceId?: string
  categoryPicker?: boolean
}) {
  const [serviceId, setServiceId] = useState(lockedServiceId ?? defaultServiceId)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [referenceCode, setReferenceCode] = useState<string | null>(null)
  const [upload, setUpload] = useState<UploadState>({ status: 'idle' })
  // Captured once, on first render, for the server's timing check.
  const formRenderedAt = useRef(Date.now())

  const service = getService(serviceId) ?? services[0]
  const formKind = service.kind === 'manufacturing' || service.kind === 'testing' ? service.kind : 'general'

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUpload({ status: 'uploading', name: file.name })
    const body = new FormData()
    body.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) {
        setUpload({ status: 'error', name: file.name, message: json.message ?? 'Upload failed.' })
        return
      }
      setUpload({ status: 'done', name: json.name, token: json.token })
    } catch {
      setUpload({ status: 'error', name: file.name, message: 'Could not reach the server.' })
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const data = Object.fromEntries(new FormData(event.currentTarget))
    const payload: Record<string, unknown> = {
      ...data,
      kind: formKind,
      serviceId,
      consent: data.consent === 'on',
      formRenderedAt: formRenderedAt.current,
    }
    if (formKind === 'testing') payload.nablScope = data.nablScope === 'on'
    if ((formKind === 'manufacturing' || formKind === 'testing') && upload.status === 'done') {
      payload.cadFileToken = upload.token
    }

    const parsed = enquirySchema.safeParse(payload)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      setStatus('idle')
      const first = parsed.error.issues[0]?.path[0]
      if (first) document.getElementById(String(first))?.focus()
      return
    }

    setErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const resBody = await res.json().catch(() => ({}))

      if (!res.ok) {
        setErrors(resBody.errors ?? {})
        setFormError(
          resBody.message ?? 'We could not send your enquiry. Try again, or call +91 20 6633 3700.',
        )
        setStatus('error')
        return
      }

      setReferenceCode(resBody.referenceCode ?? null)
      setStatus('success')
    } catch {
      setFormError(
        'We could not reach the server. Check your connection and try again, or call +91 20 6633 3700.',
      )
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border border-success rounded-md bg-white p-6 flex flex-col gap-3">
        <h3 className="text-solid text-success text-[20px] m-0">Enquiry sent</h3>
        {referenceCode && (
          <p className="m-0">
            Your reference number is{' '}
            <span className="font-mono font-semibold text-ink-900">{referenceCode}</span>. Quote it in
            any follow-up.
          </p>
        )}
        <p className="text-ink-700 m-0">
          We have sent an acknowledgement to your email address, and the right team will reply. If it
          is urgent, call{' '}
          <a href="tel:+912066333700" className="text-brand-800">
            +91 20 6633 3700
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid gap-8',
        !lockedServiceId && !categoryPicker && 'lg:grid-cols-[1fr_280px] lg:items-start',
      )}
    >
      {!lockedServiceId && !categoryPicker && service.kind === 'venue' ? (
        <div className="border border-rule rounded-md bg-white p-6 flex flex-col gap-4">
          <h3 className="text-[18px] m-0">Venue hire has its own booking flow</h3>
          <p className="text-ink-700 m-0">
            Tell us the venue, your dates and the type of event on the booking page — it checks
            availability and starts the request directly.
          </p>
          <div>
            <ButtonLink href="/venues/book">Go to venue booking</ButtonLink>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          {service.kind === 'training' && (
            <p className="text-[13.5px] text-ink-500 border border-rule rounded-md bg-paper-2 px-4 py-3 m-0">
              Training registration isn&rsquo;t a self-serve flow yet — this reaches our training
              coordinator directly.
            </p>
          )}

          {formError && (
            <div role="alert" className="border border-error rounded-md bg-white px-4 py-3 text-[14px] text-error">
              {formError}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Your name" error={errors.name} required>
              <input id="name" name="name" type="text" autoComplete="name" className={inputCls(errors.name)} />
            </Field>

            <Field id="company" label="Company" error={errors.company} hint="Optional">
              <input id="company" name="company" type="text" autoComplete="organization" className={inputCls(errors.company)} />
            </Field>

            <Field id="email" label="Email" error={errors.email} required>
              <input id="email" name="email" type="email" autoComplete="email" className={inputCls(errors.email)} />
            </Field>

            <Field id="phone" label="Phone" error={errors.phone} required>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls(errors.phone)} />
            </Field>
          </div>

          <Field id="subject" label="Subject" error={errors.subject} hint="Optional">
            <input id="subject" name="subject" type="text" defaultValue={defaultSubject} className={inputCls(errors.subject)} />
          </Field>

          {categoryPicker && (
            <Field id="category" label="Machine category">
              <select
                id="category"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className={inputCls()}
              >
                {services
                  .filter((s) => s.kind === 'manufacturing' || s.kind === 'testing')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
              </select>
            </Field>
          )}

          {formKind === 'manufacturing' && (
            <div className="grid gap-5 sm:grid-cols-2 border-t border-rule pt-5">
              <Field id="partName" label="Part name" error={errors.partName} required>
                <input id="partName" name="partName" type="text" className={inputCls(errors.partName)} />
              </Field>
              <Field id="material" label="Material" error={errors.material} required>
                <input id="material" name="material" type="text" className={inputCls(errors.material)} />
              </Field>
              <Field id="quantity" label="Quantity" error={errors.quantity} required>
                <input id="quantity" name="quantity" type="text" className={inputCls(errors.quantity)} />
              </Field>
              <Field id="tolerance" label="Tolerance" error={errors.tolerance} hint="Optional">
                <input id="tolerance" name="tolerance" type="text" className={inputCls(errors.tolerance)} />
              </Field>
              <Field id="deliveryDate" label="Delivery date needed" error={errors.deliveryDate} required>
                <input id="deliveryDate" name="deliveryDate" type="date" className={inputCls(errors.deliveryDate)} />
              </Field>
              <FileField label="CAD / drawing" hint="PDF, DWG, DXF, STEP, IGES or ZIP — up to 25MB. Optional." upload={upload} onChange={onFileChange} />
            </div>
          )}

          {formKind === 'testing' && (
            <div className="grid gap-5 sm:grid-cols-2 border-t border-rule pt-5">
              <Field id="sampleDescription" label="Sample description" error={errors.sampleDescription} required className="sm:col-span-2">
                <textarea id="sampleDescription" name="sampleDescription" rows={3} className={inputCls(errors.sampleDescription)} />
              </Field>
              <Field id="standardOrTest" label="Standard / test required" error={errors.standardOrTest} required>
                <input id="standardOrTest" name="standardOrTest" type="text" className={inputCls(errors.standardOrTest)} />
              </Field>
              <Field id="sampleCount" label="Number of samples" error={errors.sampleCount} required>
                <input id="sampleCount" name="sampleCount" type="text" className={inputCls(errors.sampleCount)} />
              </Field>
              <label htmlFor="nablScope" className="flex items-start gap-3 text-[14.5px] text-ink-700 sm:col-span-2">
                <input id="nablScope" name="nablScope" type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-accent-700)]" />
                <span>This test must be within our NABL ISO/IEC 17025:2017 scope.</span>
              </label>
              <FileField label="Drawing / spec" hint="PDF, DWG, DXF, STEP, IGES or ZIP — up to 25MB. Optional." upload={upload} onChange={onFileChange} className="sm:col-span-2" />
            </div>
          )}

          <Field
            id="message"
            label="What do you need?"
            error={errors.message}
            hint="Anything above doesn't cover — deadline, budget, or context that helps us answer quickly."
            required
          >
            <textarea id="message" name="message" rows={5} className={inputCls(errors.message)} />
          </Field>

          {/* Honeypot. Off-screen rather than display:none, which some bots detect. */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="consent" className="flex items-start gap-3 text-[14.5px] text-ink-700">
              <input id="consent" name="consent" type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-accent-700)]" />
              <span>
                I agree that Auto Cluster may contact me about this enquiry.
                <span className="text-error"> *</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-[13px] text-error m-0" id="consent-error">
                {errors.consent}
              </p>
            )}
          </div>

          <div>
            <Button type="submit" loading={status === 'submitting'} disabled={upload.status === 'uploading'}>
              {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
            </Button>
          </div>
        </form>
      )}

      {!lockedServiceId && !categoryPicker && (
        // The picker (ten cards, a constant ~935px) is reliably taller than
        // the form (five fields for `general` at ~680px, more for
        // manufacturing/testing). A shared grid row takes the height of the
        // taller one regardless of alignment, so top-aligning both — same
        // row, unequal content — always left that difference as a bare
        // rectangle of page background in whichever column came up short.
        // Capping the picker at roughly the shortest form's height and
        // scrolling the rest internally keeps the row close to that height
        // for every service; `sticky` then absorbs what's left for the
        // taller (manufacturing/testing) forms, since a pinned column reads
        // as a nav following the page rather than a hole in the layout.
        <nav aria-label="Choose a service" className="lg:sticky lg:top-24">
          <Reveal
            as="div"
            stagger
            className="flex flex-col gap-2 lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:pr-1"
          >
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setServiceId(s.id)}
                aria-current={s.id === serviceId ? 'true' : undefined}
                className={cn(
                  'text-left rounded-md border px-4 py-3 transition-colors duration-150',
                  s.id === serviceId
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-rule bg-white hover:border-rule-strong',
                )}
              >
                <span className="block text-[14.5px] font-semibold text-ink-900">{s.label}</span>
                <span className="block mt-0.5 text-[12.5px] leading-snug text-ink-500">
                  {s.description}
                </span>
              </button>
            ))}
          </Reveal>
        </nav>
      )}
    </div>
  )
}

function inputCls(error?: string) {
  return cn(
    'w-full min-h-11 px-3.5 py-2.5 bg-white rounded-md border text-[15px] text-ink-900',
    'transition-colors duration-150',
    error ? 'border-error' : 'border-rule-strong hover:border-ink-400',
  )
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-semibold text-ink-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {/* Always rendered, even without a hint — a sibling field's "Optional"
          line would otherwise push its input down a row while this one's
          stays put, and the two no longer line up across the grid. */}
      <p
        className="text-[12.5px] text-ink-400 m-0 max-w-none"
        id={hint ? `${id}-hint` : undefined}
        aria-hidden={hint ? undefined : true}
      >
        {hint || '\u00A0'}
      </p>
      {children}
      {error && (
        <p className="text-[13px] text-error m-0 max-w-none" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function FileField({
  label,
  hint,
  upload,
  onChange,
  className,
}: {
  label: string
  hint?: string
  upload: UploadState
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor="cadFile" className="text-[14px] font-semibold text-ink-900">
        {label}
      </label>
      <p className="text-[12.5px] text-ink-400 m-0 max-w-none" aria-hidden={hint ? undefined : true}>
        {hint || ' '}
      </p>
      <input
        id="cadFile"
        type="file"
        onChange={onChange}
        className="text-[13.5px] file:mr-3 file:min-h-11 file:px-4 file:rounded-md file:border file:border-rule-strong file:bg-white file:text-[13.5px] file:font-semibold file:cursor-pointer"
      />
      {upload.status === 'uploading' && (
        <p className="text-[13px] text-ink-500 m-0">Uploading {upload.name}…</p>
      )}
      {upload.status === 'done' && (
        <p className="text-[13px] text-success m-0">Uploaded: {upload.name}</p>
      )}
      {upload.status === 'error' && (
        <p className="text-[13px] text-error m-0" role="alert">
          {upload.message}
        </p>
      )}
    </div>
  )
}
