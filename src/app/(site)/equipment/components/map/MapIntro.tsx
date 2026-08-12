import { memo } from 'react'
import { Reveal } from '@/components/motion/Reveal'

/**
 * The board's opening card.
 *
 * Every figure is counted from the data at render time. Nothing here is a
 * literal, so adding a machine or a category updates the intro along with
 * the board below it — this component takes no numbers of its own.
 *
 * Reveals with the shared `Reveal` mechanism, same as every other block on
 * the site — there is no bespoke fade wiring here any more, and no cap mark
 * for a trunk to run out of: the board below is a grid of boxes, not a route
 * that starts here and runs down the page.
 */
export const MapIntro = memo(function MapIntro({
  machineCount,
  categoryCount,
}: {
  machineCount: number
  categoryCount: number
}) {
  const stats = [
    { value: String(machineCount).padStart(2, '0'), label: 'Machines' },
    { value: String(categoryCount).padStart(2, '0'), label: 'Categories' },
    { value: '01', label: 'Ecosystem' },
  ]

  return (
    <Reveal stagger className="relative text-center pt-4 pb-14 md:pb-20">
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-brand-400 m-0">
        Equipment map
      </p>

      <div className="mt-8 inline-flex flex-wrap items-stretch justify-center divide-x divide-rule border-y border-rule">
        {stats.map((s) => (
          <span key={s.label} className="flex flex-col gap-1 px-7 py-5 sm:px-10">
            <span className="font-display font-semibold text-[clamp(28px,3.4vw,44px)] leading-none tabular-nums text-brand-800">
              {s.value}
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-400">
              {s.label}
            </span>
          </span>
        ))}
      </div>

      <p className="mt-8 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-400 m-0">
        Explore the system
      </p>
    </Reveal>
  )
})
