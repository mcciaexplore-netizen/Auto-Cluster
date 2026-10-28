import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import type { ImageRef } from '@/lib/types'

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
  border = true,
  compact = false,
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
  /** Set false where two adjacent sections should read as one continuous run rather than separate bands. */
  border?: boolean
  /** Roughly half the standard vertical rhythm — for a section that should sit close to its neighbour instead of at the site's usual pacing. */
  compact?: boolean
}) {
  const backgrounds = {
    paper: 'bg-paper',
    white: 'bg-white',
    accent: 'bg-paper-2',
    glow: 'section-glow',
  }
  const borders = {
    paper: 'border-b border-rule',
    white: 'border-b border-rule',
    accent: 'border-y-2 border-rule',
    glow: 'border-b border-rule',
  }

  return (
    <section id={id} className={cn(backgrounds[tone], border && borders[tone], className)}>
      <Container className={compact ? 'py-8 md:py-10 xl:py-12' : 'py-14 md:py-20 xl:py-24'}>
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
  image,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  /** Opt-in — every other PageHero call site keeps its single-column layout unchanged. */
  image?: ImageRef
  children?: ReactNode
}) {
  return (
    /* Not full-height. The home hero fills the screen because it is the
       front door; making every subpage hero do the same would put a whole
       viewport of nothing between a visitor and the content they navigated
       to.

       38svh, not 58svh: every call site passes an eyebrow and a subtitle,
       whose actual content (with the Container's own py-20/py-24) already
       runs to ~44svh at a common 900px-tall viewport — 58svh's floor sat
       above that on every real page, forcing ~130px of pure padding beyond
       what the copy needed. 38svh is comfortably below that natural height,
       so it now works as an actual floor — a safety minimum for the rare
       thin-content page — rather than the thing setting every page's
       height regardless of how little it has to show. */
    <div className="bg-paper-2 border-b border-rule flex items-center min-h-[38svh]">
      <Container className="w-full py-20 md:py-24">
        <div className={cn('grid gap-10 lg:gap-16 items-center', image && 'lg:grid-cols-2')}>
          {/* The hero is above the fold, so this reveals on mount rather than
              on scroll — the observer fires immediately at this position.
              Staggered so the headline, the eyebrow and the subtitle arrive
              in reading order. The stagger applies to direct children, so it
              wraps the elements themselves, not the Container. */}
          <Reveal stagger>
            {/* No colour override — the h1 takes its gradient from the base
                stylesheet. The measure widens with the type: 18ch held at
                44px, but at 68px it forces a headline into five short lines. */}
            <h1 className="max-w-[20ch]">{title}</h1>
            {eyebrow && (
              <p className="font-poppins text-[13px] font-medium tracking-[0.1em] uppercase text-brand-400 mt-4 max-w-none">
                {eyebrow}
              </p>
            )}
            {subtitle && (
              <p className="mt-3 text-[clamp(18px,1.4vw,23px)] leading-relaxed text-ink-700 max-w-[58ch]">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-10">{children}</div>}
          </Reveal>

          {/* Stays inside the Container's own gutter rather than bleeding to
              the window edge the way the home hero's collage does — the
              same right-hand padding the text has on its left. */}
          {image && (
            <Reveal className="relative w-full aspect-[3/2]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain"
              />
            </Reveal>
          )}
        </div>
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
