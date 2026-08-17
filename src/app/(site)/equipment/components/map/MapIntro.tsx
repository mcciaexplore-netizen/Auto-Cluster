import { memo } from 'react'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The board's opening card.
 *
 * Reveals with the shared `Reveal` mechanism, same as every other block on
 * the site — there is no bespoke fade wiring here any more, and no cap mark
 * for a trunk to run out of: the board below is a grid of boxes, not a route
 * that starts here and runs down the page.
 */
export const MapIntro = memo(function MapIntro() {
  return (
    <Reveal stagger className="relative text-center pt-4 pb-14 md:pb-20">
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-400 m-0">
        Explore the system
      </p>
    </Reveal>
  )
})
