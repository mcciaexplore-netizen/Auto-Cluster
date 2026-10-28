'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * A statistic that counts up when it scrolls into view.
 *
 * The real figure is server-rendered and is what a crawler, a reader with
 * JavaScript off, and a screen reader all receive. The animation only ever
 * replaces it on the client, after mount. This is deliberate: the audit's
 * complaint about the current site (CONTENT_QUESTIONS.md CQ-57) is that its
 * five counters render `1 +` in the markup and the real numbers exist only
 * as JavaScript animation targets, invisible to search engines. Animating a
 * number must not cost us the number.
 *
 * Values arrive as display strings — "900+", "17025", "4,000 sq m" — so the
 * numeric run is isolated and the surrounding characters are preserved
 * verbatim rather than reconstructed.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Splits "900+" into ["", 900, "+"]. Returns null when there is no number. */
function parse(value: string): { prefix: string; target: number; suffix: string; grouped: boolean } | null {
  const match = value.match(/^(\D*?)(\d[\d,]*)(.*)$/s)
  if (!match) return null
  const [, prefix, digits, suffix] = match
  const target = Number(digits.replace(/,/g, ''))
  if (!Number.isFinite(target)) return null
  return { prefix, target, suffix, grouped: digits.includes(',') }
}

/** Long enough that the digits are readable while they climb, not a blur. */
const DURATION = 1100
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const callbacks = new WeakMap<Element, () => void>()
let sharedObserver: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        sharedObserver?.unobserve(entry.target)
        callbacks.get(entry.target)?.()
        callbacks.delete(entry.target)
      }
    },
    { threshold: 0.4 },
  )
  return sharedObserver
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement>(null)
  /** The node holding the painted digits. Written to directly — see below. */
  const digits = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  // The digits are written straight to the DOM node rather than held in
  // state. This used to call setState once per animation frame, which meant
  // React reconciled the component ~60 times a second, per counter, for the
  // whole run — four counters on the home page was ~240 renders a second and
  // was visible as jank in the band above it. Nothing else on the page reads
  // this value, so there is no reason for React to know about it mid-flight.
  //
  // SSR still emits the real figure: the JSX below renders `value`, and this
  // node is only taken over after mount.
  useIsomorphicLayoutEffect(() => {
    if (!parsed || !digits.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return
    // Before paint, drop to zero — no frame where the final value flashes
    // and rewinds.
    digits.current.textContent = `${parsed.prefix}0${parsed.suffix}`
    // parsed is derived from `value`; re-running on identity churn is wasted work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el || !parsed || done.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    let frame = 0

    callbacks.set(el, () => {
      if (done.current) return
      done.current = true

      const { prefix, target, suffix, grouped } = parsed
      const start = performance.now()
      let painted = ''
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1)
        const current = Math.round(easeOutCubic(progress) * target)
        const next = `${prefix}${grouped ? current.toLocaleString('en-IN') : current}${suffix}`
        // Skip the write when the rounded figure has not changed — a
        // counter ending at 100 only has 100 distinct states, so most
        // frames of a 1.1s run would otherwise rewrite the same string.
        if (next !== painted && digits.current) {
          digits.current.textContent = next
          painted = next
        }
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })

    const observer = getObserver()
    observer.observe(el)
    return () => {
      observer.unobserve(el)
      callbacks.delete(el)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // The accessible name stays the real figure throughout; only the painted
  // digits change, so assistive tech never announces a ticking number.
  return (
    <span ref={ref} className={className}>
      <span ref={digits} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
