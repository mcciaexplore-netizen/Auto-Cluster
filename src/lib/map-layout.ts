import type { EquipmentCategory, ImageRef } from '@/lib/types'

export interface MapMachine {
  slug: string
  name: string
  category: EquipmentCategory
  alsoIn?: EquipmentCategory[]
  make?: string
  image?: ImageRef
  isAccredited: boolean
}

/**
 * One category, as a box on the board.
 *
 * The map used to be a single vertical spine with every machine positioned
 * in real pixels down a ~6000px page — replaced on request with a compact
 * board where every zone is visible without a long scroll. That removed the
 * reason for hand-computed pixel positions: a zone's machines now flow in an
 * ordinary CSS grid inside its box, and the box itself sits in an ordinary
 * responsive grid alongside the others. Layout is the browser's job again.
 *
 * `startIndex` is the running count the *previous* zones' machines used up,
 * so a zone can label its own machines `09`, `10`, `11`… without every
 * zone needing to know about every other one.
 */
export interface MapZone {
  id: EquipmentCategory
  label: string
  facility: string
  /** The isometric illustration on the zone's overview card. */
  image: ImageRef
  machines: MapMachine[]
  /** 1-based position among rendered zones, for "Zone 02 / 05". */
  order: number
  /** How many machines preceded this zone's first, for global numbering. */
  startIndex: number
}

/**
 * Groups machines by category, in the category's declared order, skipping
 * any category with nothing to show.
 *
 * Primary membership only — `alsoIn` cross-listings are not duplicated here,
 * the same rule the old layout used, so the running total still reads as
 * "every machine once."
 */
export function groupByZone(
  machines: MapMachine[],
  categories: { id: EquipmentCategory; label: string; facility: string; image: ImageRef }[],
): MapZone[] {
  const zones: MapZone[] = []
  let startIndex = 0

  for (const category of categories) {
    const zoneMachines = machines.filter((m) => m.category === category.id)
    if (zoneMachines.length === 0) continue

    zones.push({
      id: category.id,
      label: category.label,
      facility: category.facility,
      image: category.image,
      machines: zoneMachines,
      order: zones.length + 1,
      startIndex,
    })
    startIndex += zoneMachines.length
  }

  return zones
}
