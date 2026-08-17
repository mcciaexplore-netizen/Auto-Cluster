'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import { groupByZone } from '@/lib/map-layout'
import type { MapMachine } from '@/lib/map-layout'
import type { EquipmentCategory, ImageRef } from '@/lib/types'
import { MapIntro } from './MapIntro'
import { MapCanvas } from './MapCanvas'

const MachineDetailPanelLoader = dynamic(
  () => import('./MachineDetailPanelLoader').then((mod) => mod.MachineDetailPanelLoader),
  { ssr: false },
)

/**
 * The interactive equipment map.
 *
 * Sits between the catalogue's heading block and its filter bar. Every
 * machine, its category, its position in the running count and the counts in
 * the intro card are derived from `equipment` and `categories` — there is no
 * node list in this file or any other.
 *
 * Rebuilt as a compact board: every category is a box, visible together,
 * rather than a single spine run down a ~6000px page. That removes the
 * reason for almost everything that used to live here — GSAP, ScrollTrigger,
 * a width measurement pass, and a motion-tier watchdog that existed
 * specifically to keep a continuous scroll-linked animation affordable. None
 * of that has a job any more: layout is the browser's (plain CSS grid, see
 * map-layout.ts and CategoryZone.tsx), and the one entrance the board plays
 * — fading in together the moment it scrolls into view — is exactly what
 * `Reveal` already does for every other section on the site, for free.
 *
 * The one thing this still needs client JS for is the machine detail panel,
 * which is why the component stays `'use client'` and the panel itself is
 * still lazy-loaded — a click on one of 30-odd machines is common, but the
 * panel and the equipment content it renders should not cost anything on the
 * initial load of a page most visitors will only ever scroll past.
 */
export function EquipmentMap({
  machines,
  categories,
  activeCategory,
}: {
  machines: MapMachine[]
  categories: { id: EquipmentCategory; label: string; facility: string; image: ImageRef }[]
  /** The `?category=` filter from the catalogue chips, if one is set. */
  activeCategory: EquipmentCategory | null
}) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.label])),
    [categories],
  )

  // Machines without an image cannot be plotted as a plate. Every one of the
  // 30 has one today; this is here so a new record with no photograph yet
  // does not render an empty frame on the board.
  const plottable = useMemo(() => machines.filter((e) => e.image), [machines])

  const zones = useMemo(() => groupByZone(plottable, categories), [plottable, categories])

  const selected = useMemo(
    () => plottable.find((m) => m.slug === selectedSlug) ?? null,
    [plottable, selectedSlug],
  )

  const handleSelect = useCallback((slug: string) => setSelectedSlug(slug), [])
  const handleClose = useCallback(() => setSelectedSlug(null), [])

  return (
    <section
      aria-label="Interactive equipment map"
      className="relative bg-paper border-b border-rule overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-16 md:py-24">
        <MapIntro />

        <MapCanvas
          zones={zones}
          selectedSlug={selectedSlug}
          highlightedCategory={activeCategory}
          onSelect={handleSelect}
        />
      </div>

      {selectedSlug && (
        <MachineDetailPanelLoader
          slug={selectedSlug}
          categoryLabel={selected ? (categoryLabels[selected.category] ?? '') : ''}
          onClose={handleClose}
        />
      )}
    </section>
  )
}
