'use client'

import { useState } from 'react'
import { departmentLabels, departments, enquirySchema, fieldErrors } from '@/lib/validation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * The one enquiry form. Writes to the database, emails the routed department,
 * acknowledges the sender, and renders success and error inline — never a
 * redirect.
 */
export function EnquiryForm({
  defaultDepartment = 'general',
  defaultSubject = '',
}: {
  defaultDepartment?: (typeof departments)[number]
  defaultSubject?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const data = Object.fromEntries(new FormData(event.currentTarget))
    const parsed = enquirySchema.safeParse({ ...data, consent: data.consent === 'on' })

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      setStatus('idle')
      // Move focus to the first field with a problem.
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

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrors(body.errors ?? {})
        setFormError(
          body.message ??
            'We could not send your enquiry. Try again, or call +91 20 6633 3700.',
        )
        setStatus('error')
        return
      }

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
      <div
        role="status"
        className="border border-success rounded-md bg-white p-6 flex flex-col gap-3"
      >
        <h3 className="text-solid text-success text-[20px] m-0">Enquiry sent</h3>
        <p className="text-ink-700 m-0">
          Thank you. We have sent an acknowledgement to your email address, and the right
          team will reply. If it is urgent, call{' '}
          <a href="tel:+912066333700" className="text-brand-800">
            +91 20 6633 3700
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {formError && (
        <div
          role="alert"
          className="border border-error rounded-md bg-white px-4 py-3 text-[14px] text-error"
        >
          {formError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name} required>
          <input id="name" name="name" type="text" autoComplete="name" className={inputCls(errors.name)} />
        </Field>

        <Field id="company" label="Company" error={errors.company} hint="Optional">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputCls(errors.company)}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email} required>
          <input id="email" name="email" type="email" autoComplete="email" className={inputCls(errors.email)} />
        </Field>

        <Field id="phone" label="Phone" error={errors.phone} required>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls(errors.phone)} />
        </Field>
      </div>

      <Field
        id="department"
        label="Which team should receive this?"
        error={errors.department}
        required
      >
        <select
          id="department"
          name="department"
          defaultValue={defaultDepartment}
          className={inputCls(errors.department)}
        >
          {departments.map((d) => (
            <option key={d} value={d}>
              {departmentLabels[d]}
            </option>
          ))}
        </select>
      </Field>

      <Field id="subject" label="Subject" error={errors.subject} hint="Optional">
        <input
          id="subject"
          name="subject"
          type="text"
          defaultValue={defaultSubject}
          className={inputCls(errors.subject)}
        />
      </Field>

      <Field
        id="message"
        label="What do you need?"
        error={errors.message}
        hint="Material, part size, quantity, standard and any deadline all help us answer quickly."
        required
      >
        <textarea id="message" name="message" rows={6} className={inputCls(errors.message)} />
      </Field>

      {/* Honeypot. Off-screen rather than display:none, which some bots detect. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="consent" className="flex items-start gap-3 text-[14.5px] text-ink-700">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent-700)]"
          />
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
        <Button type="submit" loading={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
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
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold text-ink-900">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {hint && (
        <p className="text-[12.5px] text-ink-400 m-0 max-w-none" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="text-[13px] text-error m-0 max-w-none" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
