import { memo } from 'react'

/**
 * The name under a machine plate.
 *
 * Always rendered, never revealed on hover. Two reasons: a map whose labels
 * appear one at a time cannot be read, and these names are the page's most
 * valuable text — 30 machine names that were invisible to search engines on
 * the old site. They are real text in the DOM, not set into the photograph.
 *
 * The two lines animate separately because the entrance sequence calls for
 * the name and then the category, but they are one block for layout so the
 * plate above them never moves as they arrive.
 */
export const MachineLabel = memo(function MachineLabel({
  name,
  category,
  index,
}: {
  name: string
  category: string
  index: number
}) {
  return (
    <span className="block px-1 pt-3 text-center">
      <span
        data-node-title=""
        className="block font-display font-semibold text-[13.5px] leading-[1.25] text-ink-900 text-balance"
      >
        {name}
      </span>
      <span
        data-node-cat=""
        className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[9.5px] tracking-[0.12em] uppercase text-ink-400"
      >
        <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
        <span aria-hidden="true" className="w-2 h-px bg-rule-strong/60" />
        <span className="truncate">{category}</span>
      </span>
    </span>
  )
})
