import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Page gutter. One measure for the whole site.
 *
 * Both values come from `--page-max` / `--page-gutter` in globals.css, so
 * the site's width is a token rather than a number repeated in a dozen
 * components. The shell is the viewport at every realistic screen size —
 * the max width only stops an ultrawide from running content to 3000px.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * A content section.
 *
 * Used to carry a small "01 · LABEL" eyebrow above the heading — removed on
 * request: at the section's own width it read as a short, low-contrast
 * fragment rather than a real piece of the page.
 */
export function Section({
  children,
  className,
  id,
  tone = 'paper',
}: {
  children: ReactNode
  className?: string
  id?: string
  /**
   * `accent` replaces the old `dark`. The site is white throughout now, so
   * the emphasis band is carried by the faint blue wash and a heavier top
   * rule rather than by inverting to a near-black ground.
   *
   * `glow` is the same idea in the brand's own gradient rather than a flat
   * wash — two soft radial stops (indigo, cyan) instead of one flat tint.
   */
  tone?: 'paper' | 'white' | 'accent' | 'glow'
}) {
  const tones = {
    paper: 'bg-paper border-b border-rule',
    white: 'bg-white border-b border-rule',
    accent: 'bg-paper-2 border-y-2 border-rule',
    glow: 'section-glow border-b border-rule',
  }

  return (
    <section id={id} className={cn(tones[tone], className)}>
      <Container className="py-20 md:py-28 xl:py-36">
        <Reveal className="min-w-0">{children}</Reveal>
      </Container>
    </section>
  )
}

/** Running text. Measure is capped at 66ch by the base stylesheet. */
export function Prose({
  paragraphs,
  className,
  wide = false,
}: {
  paragraphs: string[]
  className?: string
  /** Opt out of the 66ch reading measure and run to the section's own width. */
  wide?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {paragraphs.map((p, i) => (
        <p key={i} className={cn('text-ink-700', wide && 'max-w-none')}>
          {p}
        </p>
      ))}
    </div>
  )
}

/** The page hero. One h1 per page, and it lives here. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    /* Not full-height. The home hero fills the screen because it is the
       front door; making every subpage hero do the same would put a whole
       viewport of nothing between a visitor and the content they navigated
       to. 58svh is substantial without being an obstacle. */
    <div className="bg-paper-2 border-b border-rule flex items-center min-h-[58svh]">
      <Container className="w-full py-20 md:py-24">
        {/* The hero is above the fold, so this reveals on mount rather than
            on scroll — the observer fires immediately at this position.
            Staggered so eyebrow, headline and subtitle arrive in reading
            order. The stagger applies to direct children, so it wraps the
            elements themselves, not the Container. */}
        <Reveal stagger>
          {eyebrow && (
            <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-brand-400 mb-6 max-w-none">
              {eyebrow}
            </p>
          )}
          {/* No colour override — the h1 takes its gradient from the base
              stylesheet. The measure widens with the type: 18ch held at
              44px, but at 68px it forces a headline into five short lines. */}
          <h1 className="max-w-[20ch]">{title}</h1>
          {subtitle && (
            <p className="mt-6 text-[clamp(16px,1.25vw,21px)] leading-relaxed text-ink-700 max-w-[58ch]">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </Container>
    </div>
  )
}

/**
 * A statistic. Renders nothing when there is no verified value — the current
 * site ships five counters that all read `1 +`. See CONTENT_QUESTIONS CQ-57.
 */
export function Stat({
  label,
  value,
  note,
  count = false,
}: {
  label: string
  value?: string
  note?: string
  /**
   * Animate the figure up from zero when it scrolls into view.
   *
   * Off by default, and deliberately so: not every figure on this site is a
   * quantity. `17025` is a standards reference, and a standards reference
   * that ticks upward reads as a performance metric.
   */
  count?: boolean
}) {
  if (!value) return null
  // One appearance now. The `onDark` variant went with the dark grounds.
  const valueClass =
    'font-display font-semibold text-[clamp(26px,2vw,34px)] leading-tight tabular-nums text-brand-800'
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-400">
        {label}
      </span>
      {count ? (
        <CountUp value={value} className={valueClass} />
      ) : (
        <span className={valueClass}>{value}</span>
      )}
      {note && <span className="text-[13.5px] text-ink-500">{note}</span>}
    </div>
  )
}
