import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

// `ghost-on-dark` is gone with the dark grounds it existed for — the site
// is white throughout now, so `secondary` is the outline button everywhere.
type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

// Colour and transform only — no box-shadow in the transition list, for the
// same repaint reason as LinkCard. Buttons keep a static resting elevation.
// No `border` here any more — each variant owns its edge, because the
// gradient-edged ones need a transparent 1.5px border that a 1px
// `border-transparent` in the base would fight with.
const base =
  // Pill, not a rounded rectangle — see the reference CTA. `rounded-full`
  // on a min-h-11 button gives a 22px radius that tracks the height, so
  // sm and md buttons stay the same shape rather than the same radius.
  'inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full ' +
  'no-underline cursor-pointer ' +
  'transition-[background-color,border-color,transform] duration-200 ease-out ' +
  'active:translate-y-px motion-reduce:active:translate-y-0 ' +
  // 44x44 minimum touch target, everywhere.
  'min-h-11 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  // Blue, on request, with a gradient edge. The fill is the logo's own
  // "AUTO" indigo — white on it measures 10.76:1 — and the edge runs that
  // indigo into the "CLUSTER" cyan. `--edge-fill` is what `gradient-edge`
  // paints inside the border; `hover:` swaps it for the darker shade, which
  // is why the fill is a variable rather than a `bg-*` utility.
  primary:
    'gradient-edge text-white shadow-[var(--shadow-card)] ' +
    '[--edge-fill:var(--color-logo-indigo)] ' +
    'hover:[--edge-fill:#2b256a] active:[--edge-fill:#2b256a] ' +
    'disabled:[--edge-fill:var(--color-rule)] disabled:text-ink-500 disabled:shadow-none',
  secondary:
    'bg-white text-brand-600 border border-rule shadow-[var(--shadow-card)] ' +
    'hover:border-rule-strong hover:bg-paper-2 ' +
    'disabled:text-ink-400 disabled:border-rule disabled:bg-white disabled:shadow-none',
  ghost:
    'bg-transparent text-brand-600 border border-transparent hover:bg-paper-2 ' +
    'disabled:text-ink-400',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-6 py-2.5',
  md: 'text-[15px] px-8 py-3.5',
}

interface Common {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
  className?: string
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-3.5 rounded-full border-2 border-current/40 border-t-current animate-spin"
    />
  )
}

/** Anchor form. Used for navigation. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest
}: Common & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  )
}

/** Button form. Used for actions. */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: Common & ComponentProps<'button'>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
