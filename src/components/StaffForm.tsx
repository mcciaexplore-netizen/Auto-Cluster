'use client'
import { useActionState } from 'react'
import { Button } from './ui/Button'
export type ActionState = { error?: string; success?: string }
export function StaffForm({ action, children, label = 'Save' }: { action: (state: ActionState, data: FormData) => Promise<ActionState>; children: React.ReactNode; label?: string }) {
  const [state, dispatch, pending] = useActionState(action, {})
  return <form action={dispatch} className="flex flex-col gap-4">
    {children}
    {state.error && <p role="alert" className="text-error text-sm">{state.error}</p>}
    {state.success && <p role="status" className="text-success text-sm">{state.success}</p>}
    <div><Button type="submit" loading={pending} disabled={pending}>{pending ? 'Saving…' : label}</Button></div>
  </form>
}
