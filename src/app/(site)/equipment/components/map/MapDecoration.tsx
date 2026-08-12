import { memo } from 'react'

/**
 * The ground the board sits on: a drafting grid, faded at the edges.
 *
 * No parallax any more — that moved the grid against the route as you
 * scrolled past it, which only reads as depth over a long scroll. The board
 * is a few screens tall at most now, so the grid is a static backdrop: one
 * `<rect>` filled with a tiled SVG `<pattern>`, same reasoning as before —
 * cheaper than laying out real grid lines, and there is nothing here that
 * needs repainting on scroll.
 */
export const MapDecoration = memo(function MapDecoration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="map-grid" width={44} height={44} patternUnits="userSpaceOnUse">
          <path
            d="M 44 0 L 0 0 0 44"
            fill="none"
            stroke="var(--color-rule)"
            strokeWidth={1}
            strokeOpacity={0.4}
          />
        </pattern>
        <linearGradient id="map-grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="10%" stopColor="white" stopOpacity={1} />
          <stop offset="90%" stopColor="white" stopOpacity={1} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
        <mask id="map-grid-mask">
          <rect width="100%" height="100%" fill="url(#map-grid-fade)" />
        </mask>
      </defs>

      <rect width="100%" height="100%" fill="url(#map-grid)" mask="url(#map-grid-mask)" />
    </svg>
  )
})
