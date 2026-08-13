'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '../actions'

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-[360px]">
      {state.error && (
        <div role="alert" className="border border-error rounded-md bg-white px-4 py-3 text-[14px] text-error">
          {state.error}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[14px] font-semibold text-ink-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full min-h-11 px-3.5 py-2.5 bg-white rounded-md border border-rule-strong text-[15px] text-ink-900"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[14px] font-semibold text-ink-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full min-h-11 px-3.5 py-2.5 bg-white rounded-md border border-rule-strong text-[15px] text-ink-900"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 px-6 rounded-full bg-brand-600 text-white font-semibold disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
