import { forwardRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'
import type { MapZone } from '@/lib/map-layout'

/**
 * A category, as a summary card on the board's overview — a stop on the
 * route, not the machines themselves. Click it and `MapCanvas` swaps the
 * whole overview for that zone's machine list; see `ZoneDetail`.
 *
 * Forwards its ref so `RoutePath` can measure where each card actually
 * landed and draw the connecting line between it and the next one — the one
 * thing about this layout that still needs real pixels, because CSS has no
 * way to draw a line between two boxes it placed itself.
 */
export const CategoryZone = forwardRef<
  HTMLButtonElement,
  {
    zone: MapZone
    total: number
    highlighted: boolean
    onOpen: (id: string) => void
  }
>(function CategoryZone({ zone, total, highlighted, onOpen }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      data-map-zone={zone.id}
      onClick={() => onOpen(zone.id)}
      className={cn(
        'group relative w-full text-left cursor-pointer rounded-2xl border p-6 sm:p-7',
        'flex flex-col gap-5 bg-paper shadow-[var(--shadow-card)]',
        'transition-[border-color,box-shadow,transform] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        highlighted ? 'border-brand-600/60' : 'border-rule',
      )}
    >
      <div className="relative -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 h-32 sm:h-36 bg-paper-2 border-b border-rule rounded-t-2xl overflow-hidden">
        <Image
          src={zone.image.src}
          alt={zone.image.alt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain p-3 transition-transform duration-200 ease-out group-hover:scale-105"
        />
      </div>

      <span className="self-start font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-400 bg-paper-2 px-3 py-1 rounded-full border border-rule whitespace-nowrap">
        {String(zone.order).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>

      <h3
        className={cn(
          'font-display font-semibold text-[clamp(19px,1.8vw,26px)] leading-tight m-0',
          highlighted ? 'text-brand-800' : 'text-brand-600',
        )}
      >
        {zone.label}
      </h3>

      <span className="mt-auto pt-2 flex items-center justify-between gap-3 border-t border-rule">
        <span className="pt-3 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-400">
          {zone.machines.length} {zone.machines.length === 1 ? 'machine' : 'machines'}
        </span>
        <span className="pt-3 font-mono text-[11px] font-semibold text-brand-800 group-hover:underline underline-offset-4">
          View <span aria-hidden="true">→</span>
        </span>
      </span>
    </button>
  )
})
