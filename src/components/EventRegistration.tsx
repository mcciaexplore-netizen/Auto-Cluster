'use client'
import { useState } from 'react'
import { Field, inputCls } from './EnquiryForm'
import { Button, ButtonLink } from './ui/Button'
export function EventRegistration({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [passUrl, setPassUrl] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setErrors({}); setPending(true)
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await fetch(`/api/events/${slug}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: data.consent === 'on' }) })
      const json = await response.json()
      if (!response.ok) { setError(json.message); setErrors(json.errors ?? {}); return }
      setPassUrl(json.passUrl)
    } catch { setError('Could not reach the server. Please try again.') } finally { setPending(false) }
  }
  if (passUrl) return <div role="status" className="p-6 border border-success bg-white rounded-md"><h3 className="text-2xl">You are registered.</h3><p className="mt-3 mb-5">Open and save your private pass for event check-in.</p><ButtonLink href={passUrl}>View event pass</ButtonLink></div>
  return <form onSubmit={submit} className="flex flex-col gap-5 max-w-[640px]">
    {error && <p role="alert" className="text-error">{error}</p>}
    <Field id="name" label="Your name" error={errors.name} required><input id="name" name="name" autoComplete="name" required maxLength={120} className={inputCls(errors.name)} /></Field>
    <Field id="email" label="Email" error={errors.email} required><input id="email" name="email" type="email" autoComplete="email" required maxLength={200} className={inputCls(errors.email)} /></Field>
    <Field id="company" label="Company" hint="Optional" error={errors.company}><input id="company" name="company" autoComplete="organization" maxLength={160} className={inputCls(errors.company)} /></Field>
    <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="text-sm"><input name="consent" type="checkbox" required className="mr-2" />I consent to Auto Cluster using these details to manage my registration and contact me about this event.</label>
    {errors.consent && <p className="text-error" role="alert">{errors.consent}</p>}
    <p className="text-sm"><a href="/legal/privacy-policy">Privacy information</a></p>
    <div><Button type="submit" disabled={pending} loading={pending}>{pending ? 'Registering…' : 'Register and get a pass'}</Button></div>
  </form>
}
