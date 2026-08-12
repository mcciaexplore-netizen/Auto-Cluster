'use client'

import Image from 'next/image'
import { memo } from 'react'
import { cn } from '@/lib/cn'
import type { MapMachine } from '@/lib/map-layout'

/**
 * One machine, as a plate inside its category's box.
 *
 * Sizing now comes from the box's own CSS grid track rather than a computed
 * pixel width — see map-layout.ts for why the map stopped hand-computing
 * positions. `data-node-lift` and `data-node-plate` still exist as separate
 * layers for the same reason as before: hover/selection (CSS transition) and
 * the entrance (CSS transition, driven by the shared `Reveal` on the box)
 * must not fight over the same `transform`.
 */
export const MachineNode = memo(function MachineNode({
  machine,
  index,
  categoryLabel,
  selected,
  dimmed,
  onSelect,
}: {
  machine: MapMachine
  /** 1-based position in the whole map, for "12 / 30". */
  index: number
  categoryLabel: string
  selected: boolean
  /** Another node is selected; this one recedes. */
  dimmed: boolean
  onSelect: (slug: string) => void
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={selected}
      onClick={() => onSelect(machine.slug)}
      className={cn(
        'group relative block w-full p-0 m-0 bg-transparent border-0 text-left cursor-pointer',
        'rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600',
        'transition-opacity duration-300',
        dimmed ? 'opacity-40' : 'opacity-100',
      )}
    >
      <span
        data-node-lift=""
        className={cn(
          'flex flex-col items-center',
          'transition-transform duration-200 ease-out',
          selected ? '-translate-y-1.5 scale-[1.03]' : 'group-hover:-translate-y-1 group-hover:scale-[1.02]',
          'motion-reduce:transform-none',
        )}
      >
        {/* Idle drift. Compositor-only transform, so it is affordable
            unconditionally now that nothing else on the map runs every
            scroll frame — see EquipmentMap.tsx. */}
        <span
          className="block w-full map-float"
          style={{ '--float-offset': (index % 7) * 0.85 } as React.CSSProperties}
        >
          <span
            data-node-plate=""
            className={cn(
              'relative block w-full aspect-[3/2] rounded-md overflow-hidden bg-white',
              'border transition-[border-color,box-shadow] duration-200',
              selected
                ? 'border-brand-600 shadow-[var(--shadow-hover)]'
                : 'border-rule shadow-[var(--shadow-card)]',
            )}
          >
            {machine.image && (
              <Image
                src={machine.image.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 18vw, (min-width: 640px) 28vw, 42vw"
                loading="lazy"
                className="object-cover"
              />
            )}

            {/* Ambient blue. A box-shadow on its own element whose *opacity*
                is animated — animating the shadow itself would repaint the
                plate and its neighbours on every frame. */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-0 rounded-md pointer-events-none',
                'shadow-[inset_0_0_0_1px_rgba(0,160,227,0.35),0_0_22px_rgba(0,160,227,0.28)]',
                'transition-opacity duration-300',
                selected ? 'opacity-100' : 'opacity-0',
              )}
            />

            {machine.isAccredited && (
              <span className="absolute right-1.5 top-1.5 font-mono text-[8.5px] tracking-[0.08em] bg-paper/92 text-brand-600 border border-brand-600/50 rounded-sm px-1 py-px">
                NABL
              </span>
            )}
          </span>

          <span className="block px-1 pt-3 text-center">
            <span className="block font-display font-semibold text-[13.5px] leading-[1.25] text-ink-900 text-balance">
              {machine.name}
            </span>
            <span className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[9.5px] tracking-[0.12em] uppercase text-ink-400">
              <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
              <span aria-hidden="true" className="w-2 h-px bg-rule-strong/60" />
              <span className="truncate">{categoryLabel}</span>
            </span>
          </span>
        </span>
      </span>

      {/* Selection halo. Sits behind everything, outside the plate's overflow
          clip, so the ring is not cut off at the photograph's edge. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -inset-2 -z-10 rounded-xl border pointer-events-none',
          'transition-opacity duration-300',
          selected ? 'opacity-100 border-brand-600/45 map-pulse' : 'opacity-0 border-transparent',
        )}
      />

      <span className="sr-only">
        {machine.name}
        {machine.make ? `, ${machine.make}` : ''} — open specifications
      </span>
    </button>
  )
})
