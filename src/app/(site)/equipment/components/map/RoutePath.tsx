'use client'

import { useEffect, useState, type RefObject } from 'react'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The connecting line between one zone card and the next.
 *
 * The route is a fixed shape now — five cards in a 2-2-1 pyramid, wired
 * 01→02, 01→03, 02→04, 03→04, and 03+04 converging into 05 — rather than a
 * generic "connect whatever number of zones there are" pattern, because the
 * pyramid only means anything for exactly this shape. `pairs` names which
 * card indices connect; everything else about *where* those cards actually
 * landed still has to be measured, because they sit in an ordinary CSS grid
 * and size themselves from their own content.
 *
 * Measured after paint and on resize, not computed up front. Re-fades in via
 * the shared `Reveal` mechanism (opacity + transform only) rather than a
 * per-path stroke-draw: a stroke-dashoffset animation needs to know the
 * path's final geometry before it can play, which reintroduces the timing
 * problem this component exists to avoid.
 */
export function RoutePath({
  containerRef,
  boxRefs,
  pairs,
}: {
  containerRef: RefObject<HTMLDivElement | null>
  boxRefs: RefObject<(HTMLButtonElement | null)[]>
  /** Which card indices connect to which, e.g. `[[0, 1], [0, 2]]`. */
  pairs: readonly (readonly [number, number])[]
}) {
  const [paths, setPaths] = useState<string[]>([])
  const [box, setBox] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const boxes = boxRefs.current
      if (boxes.length === 0 || boxes.some((el) => el === null)) {
        setPaths([])
        return
      }

      const origin = container.getBoundingClientRect()
      const rects = boxes.map((el) => {
        const r = el!.getBoundingClientRect()
        return { left: r.left - origin.left, top: r.top - origin.top, width: r.width, height: r.height }
      })

      setBox({ width: origin.width, height: origin.height })
      setPaths(pairs.map(([a, b]) => connectorPath(rects[a], rects[b])))
    }

    measure()

    // Boxes reflow when their images decode and when the viewport is
    // resized — both change where the next box's connector should start.
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    window.addEventListener('load', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', measure)
    }
  }, [containerRef, boxRefs, pairs])

  if (paths.length === 0) return null

  return (
    <Reveal as="div" className="hidden sm:block absolute inset-0 pointer-events-none">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${box.width} ${box.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-rule-strong)"
            strokeWidth={1.5}
            strokeOpacity={0.5}
            strokeDasharray="6 7"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </Reveal>
  )
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/** Roughly where each box's header pill sits, for a same-row line to anchor to. */
const HEADER_ANCHOR = 34

const r1 = (n: number) => Math.round(n * 10) / 10

/**
 * An elbow from one box to the next, leaving and arriving on whichever edges
 * face each other.
 *
 * "Same row" is decided by whether the two boxes share a top edge, not by
 * comparing their centres — a box with eleven machines and its row-mate with
 * one are still side by side, but their centres can sit hundreds of pixels
 * apart. Centre-based detection called that a stacked pair and drew a line
 * from deep inside the tall box up to the short one's top edge, cutting
 * straight through its own photographs.
 *
 * Same-row boxes connect with a straight line held at a fixed height near
 * both headers, so the connector reads as one tier of the board rather than
 * lurching to match whichever box happens to be taller. Boxes in different
 * rows connect with a right-angled dogleg — out of the bottom edge, across,
 * into the top edge — the same elbow language the rest of the site already
 * uses for connecting one card to another, rather than a diagonal that would
 * have to sweep the full width of the board to cover a three-column wrap.
 */
function connectorPath(a: Rect, b: Rect): string {
  const sameRow = Math.abs(a.top - b.top) < 8

  if (sameRow) {
    const [left, right] = a.left <= b.left ? [a, b] : [b, a]
    const y = Math.min(left.top, right.top) + HEADER_ANCHOR
    return `M ${r1(left.left + left.width)} ${r1(y)} L ${r1(right.left)} ${r1(y)}`
  }

  const [top, bottom] = a.top <= b.top ? [a, b] : [b, a]
  const x1 = top.left + top.width / 2
  const y1 = top.top + top.height
  const x2 = bottom.left + bottom.width / 2
  const y2 = bottom.top
  const midY = (y1 + y2) / 2
  return `M ${r1(x1)} ${r1(y1)} L ${r1(x1)} ${r1(midY)} L ${r1(x2)} ${r1(midY)} L ${r1(x2)} ${r1(y2)}`
}
