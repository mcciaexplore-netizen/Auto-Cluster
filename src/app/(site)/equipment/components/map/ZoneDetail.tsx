import type { MapZone } from '@/lib/map-layout'
import { MachineNode } from './MachineNode'

/**
 * One zone's machines, opened in place of the overview.
 *
 * Pure content — `MapCanvas` owns the fade/collapse transition around it, so
 * this component only has to lay out a header (with the way back) and the
 * machine grid the old always-open `CategoryZone` used to render inline.
 */
export function ZoneDetail({
  zone,
  total,
  selectedSlug,
  onSelect,
  onBack,
}: {
  zone: MapZone
  total: number
  selectedSlug: string | null
  onSelect: (slug: string) => void
  onBack: () => void
}) {
  return (
    <div className="rounded-2xl border border-rule bg-paper p-6 sm:p-8 flex flex-col gap-7">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-400 bg-paper-2 px-3 py-1 rounded-full border border-rule whitespace-nowrap">
            Zone {String(zone.order).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <h3 className="mt-3 font-display font-semibold text-[clamp(22px,2.4vw,32px)] leading-tight text-brand-800 m-0">
            {zone.label}
          </h3>
          <p className="mt-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-400 m-0">
            {zone.machines.length} {zone.machines.length === 1 ? 'machine' : 'machines'}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="shrink-0 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-brand-600 border border-rule rounded-full px-4 py-2.5 min-h-11 hover:border-brand-600 hover:bg-brand-50 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <span aria-hidden="true">←</span> Back to map
        </button>
      </header>

      <ul
        className="grid gap-4 list-none m-0 p-0"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(9.5rem, 1fr))' }}
      >
        {zone.machines.map((machine, i) => (
          <li key={machine.slug}>
            <MachineNode
              machine={machine}
              index={zone.startIndex + i + 1}
              categoryLabel={zone.label}
              selected={selectedSlug === machine.slug}
              dimmed={selectedSlug !== null && selectedSlug !== machine.slug}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
