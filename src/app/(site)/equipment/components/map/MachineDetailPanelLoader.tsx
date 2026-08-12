'use client'

import { useEffect, useState } from 'react'
import type { Equipment } from '@/lib/types'
import { MachineDetailPanel } from './MachineDetailPanel'

export function MachineDetailPanelLoader({
  slug,
  categoryLabel,
  onClose,
}: {
  slug: string | null
  categoryLabel: string
  onClose: () => void
}) {
  const [machine, setMachine] = useState<Equipment | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!slug) {
      setMachine(null)
      return
    }

    import('@/content/equipment').then(({ getEquipment }) => {
      if (!cancelled) setMachine(getEquipment(slug) ?? null)
    })

    return () => {
      cancelled = true
    }
  }, [slug])

  return <MachineDetailPanel machine={machine} categoryLabel={categoryLabel} onClose={onClose} />
}
