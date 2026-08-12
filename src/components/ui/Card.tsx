import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { ImageRef } from '@/lib/types'
import { CardImage } from './Figure'

/**
 * A card is a surface: soft radius, a resting elevation. No border — on
 * request, the shadow alone now does the job of separating the card from
 * the page it sits on.
 */
export function Card({
  children,
  className,
  as: As = 'article',
}: {
  children: ReactNode
  className?: string
  as?: 'article' | 'div' | 'li'
}) {
  return (
    <As
      className={cn(
        'bg-paper rounded-lg p-7 sm:p-8 flex flex-col gap-4',
        'shadow-[var(--shadow-card)]',
        className,
      )}
    >
      {children}
    </As>
  )
}

/**
 * A whole-card link. The hover state lifts the card off the page.
 *
 * No border, same as `Card` — the shadow alone separates it from the page,
 * at rest and on hover both. The lift animates `transform` and an overlay's
 * `opacity` only — both run on the compositor. Animating `box-shadow`
 * directly repaints the card and its surroundings every frame, which is
 * visible as jank on the 30-card equipment grid, so the hover shadow lives
 * on a stacked pseudo-element that just fades in. `isolate` keeps that
 * overlay behind the content.
 */
export function LinkCard({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate bg-paper rounded-lg p-7 sm:p-8',
        'flex flex-col gap-4 no-underline shadow-[var(--shadow-card)]',
        'transition-transform duration-200 ease-out',
        'hover:-translate-y-0.5',
        // The lift is the target signal; reduced-motion keeps the shadow only.
        'motion-reduce:hover:translate-y-0',
        // Hover elevation, faded in rather than recalculated.
        'before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]',
        'before:shadow-[var(--shadow-hover)] before:opacity-0',
        'before:transition-opacity before:duration-200 before:ease-out',
        'hover:before:opacity-100',
        className,
      )}
    >
      {children}
    </Link>
  )
}

/**
 * The facility / service card.
 *
 * Carries what a buyer scans for — how many instruments, which test methods
 * — so the card does qualifying work rather than deferring it.
 */
export function ServiceCard({
  href,
  title,
  description,
  eyebrow,
  badge,
  data,
  image,
  cta = 'View facility',
}: {
  href: string
  title: string
  description: string
  /** Small label chip above the title — the category this card belongs to. */
  eyebrow?: string
  badge?: string
  data?: { label: string; value: string }[]
  /**
   * The facility or venue itself. Decorative by construction — the title sits
   * immediately beneath it — so the alt is dropped rather than read out as a
   * duplicate of the heading a screen reader is about to reach anyway.
   */
  image?: ImageRef
  cta?: string
}) {
  return (
    <LinkCard href={href} className="h-full">
      {image && <CardImage image={{ ...image, alt: '' }} />}

      {eyebrow && (
        <span className="self-start inline-flex items-center font-mono text-[10px] tracking-[0.12em] uppercase text-brand-600 bg-brand-50 border border-brand-600/20 rounded-full px-2.5 py-1">
          {eyebrow}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[20px] leading-tight">{title}</h3>
        {badge && (
          <span className="font-mono text-[10.5px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-1.5 py-1 whitespace-nowrap shrink-0">
            {badge}
          </span>
        )}
      </div>

      <p className="text-[14.5px] leading-snug text-ink-500 m-0">{description}</p>

      {data && data.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 m-0">
          {data.map((d) => (
            <div key={d.label} className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400">
                {d.label}
              </dt>
              <dd className="font-display font-semibold text-[17px] text-ink-900 tabular-nums m-0">
                {d.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <span className="mt-auto pt-2 text-[14.5px] font-semibold text-brand-800 group-hover:underline underline-offset-4">
        {cta} <span aria-hidden="true">→</span>
      </span>
    </LinkCard>
  )
}

/** Empty state. Says what is missing and what to do instead. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="bg-paper-2/60 border border-dashed border-rule-strong rounded-md p-6 flex flex-col gap-3">
      <h3 className="text-solid text-ink-500 text-[19px] m-0">{title}</h3>
      <p className="text-[14px] text-ink-500 m-0">{body}</p>
      {action}
    </div>
  )
}
