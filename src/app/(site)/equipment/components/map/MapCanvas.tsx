'use client'

import { useEffect, useRef, useState } from 'react'
import type { MapZone } from '@/lib/map-layout'
import type { EquipmentCategory } from '@/lib/types'
import { cn } from '@/lib/cn'
import { Reveal } from '@/components/motion/Reveal'
import { MapDecoration } from './MapDecoration'
import { CategoryZone } from './CategoryZone'
import { ZoneDetail } from './ZoneDetail'
import { RoutePath } from './RoutePath'

/**
 * The route: cards 01 and 02 side by side, 03 and 04 side by side beneath
 * them, and 05 centred under both — the shape asked for. Index pairs, not
 * zone ids, because the shape is fixed regardless of which five categories
 * happen to be in `zones`; if a category is ever added or removed this stops
 * being a pyramid, which is a content decision, not something to paper over
 * here.
 */
const CONNECTOR_PAIRS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 4],
] as const

/**
 * The board: an overview of five category cards in a fixed pyramid, and one
 * zone's machines opened in its place.
 *
 * Both states stay mounted the whole time and swap via a height + opacity
 * transition (a `grid-template-rows: 0fr → 1fr` collapse, not a
 * conditionally-rendered panel) so that closing a zone animates exactly as
 * smoothly as opening one — the overview does not have to reflow instantly
 * into existence the way the machine detail modal's close does.
 */
export function MapCanvas({
  zones,
  selectedSlug,
  highlightedCategory,
  onSelect,
}: {
  zones: MapZone[]
  selectedSlug: string | null
  highlightedCategory: EquipmentCategory | null
  onSelect: (slug: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [activeId, setActiveId] = useState<EquipmentCategory | null>(null)
  // The zone actually rendered in the detail pane. Kept around after
  // `activeId` clears so the machine grid fades out with the collapse
  // instead of vanishing out from under it — cleared once that fade
  // finishes, via `onTransitionEnd` below, so the DOM does not carry a
  // whole machine grid around indefinitely once the pane is shut.
  const [renderedZone, setRenderedZone] = useState<MapZone | null>(null)

  useEffect(() => {
    if (activeId) setRenderedZone(zones.find((z) => z.id === activeId) ?? null)
  }, [activeId, zones])

  const open = activeId !== null

  return (
    <div ref={containerRef} className="relative">
      <MapDecoration />

      {/* Overview: the route and its five cards. */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? '0fr' : '1fr' }}
        aria-hidden={open}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'relative transition-opacity duration-300 ease-out',
              open ? 'opacity-0' : 'opacity-100 delay-150',
            )}
          >
            <RoutePath containerRef={containerRef} boxRefs={boxRefs} pairs={CONNECTOR_PAIRS} />

            <Reveal
              as="div"
              stagger
              className="relative grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {zones.slice(0, 4).map((zone, i) => (
                <CategoryZone
                  key={zone.id}
                  ref={(el) => {
                    boxRefs.current[i] = el
                  }}
                  zone={zone}
                  total={zones.length}
                  highlighted={highlightedCategory === zone.id}
                  onOpen={(id) => setActiveId(id as EquipmentCategory)}
                />
              ))}
            </Reveal>

            {zones[4] && (
              <div className="relative mt-6 flex justify-center">
                <div className="w-full sm:w-[calc(50%-0.75rem)]">
                  <CategoryZone
                    ref={(el) => {
                      boxRefs.current[4] = el
                    }}
                    zone={zones[4]}
                    total={zones.length}
                    highlighted={highlightedCategory === zones[4].id}
                    onOpen={(id) => setActiveId(id as EquipmentCategory)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail: one zone's machines, opened in the overview's place. */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'transition-opacity duration-300 ease-out',
              open ? 'opacity-100 delay-150' : 'opacity-0',
            )}
            onTransitionEnd={(e) => {
              if (e.propertyName === 'opacity' && !open) setRenderedZone(null)
            }}
          >
            {renderedZone && (
              <ZoneDetail
                zone={renderedZone}
                total={zones.length}
                selectedSlug={selectedSlug}
                onSelect={onSelect}
                onBack={() => setActiveId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
