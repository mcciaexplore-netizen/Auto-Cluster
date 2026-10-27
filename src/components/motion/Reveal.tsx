'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Scroll-triggered reveal.
 *
 * One IntersectionObserver is shared by every instance on the page rather
 * than one per element — a facility page mounts ~40 of these, and 40
 * observers is 40 sets of callbacks competing on the same scroll.
 *
 * Elements unobserve themselves once shown. The reveal is a first-impression
 * effect; re-animating on scroll-back is noise.
 *
 * The hidden state lives behind `html.js` (see layout.tsx) so that without
 * JavaScript the content renders visible rather than stranded at opacity 0.
 * prefers-reduced-motion is handled globally in globals.css, which collapses
 * the transition to ~0s — the element still shows, it just does not travel.
 */

let shared: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (shared) return shared
  shared = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-shown', '')
        shared?.unobserve(entry.target)
      }
    },
    {
      // Fire a little before the element is fully in view, so the motion
      // reads as "already happening" rather than starting under the cursor.
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05,
    },
  )
  return shared
}

type Tag = 'div' | 'section' | 'li' | 'ul' | 'span'

export function Reveal({
  children,
  className,
  as: As = 'div',
  delay,
  stagger = false,
}: {
  children: ReactNode
  className?: string
  as?: Tag
  /** Milliseconds. Use sparingly — `stagger` handles lists. */
  delay?: number
  /** Stagger direct children instead of revealing as one block. */
  stagger?: boolean
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No observer support: show immediately rather than never.
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-shown', '')
      return
    }

    const observer = getObserver()
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])

  return (
    <As
      ref={ref as React.Ref<never>}
      data-reveal=""
      data-stagger={stagger ? '' : undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </As>
  )
}
