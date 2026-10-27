import type { Spec } from '@/lib/types'
import { cn } from '@/lib/cn'

/**
 * The specification table — the atomic unit of the whole site.
 *
 * Values are shown as corrected where the source material carried a real
 * technical error (`1100 M` of crosshead travel, `6000C` for 600 °C, a
 * chamber listed as 6 mm deep) — see src/content/equipment.ts. The
 * corrected-value provenance (chip + "published as" note) that used to
 * surface that trail in the UI has been removed by request; the data itself
 * still carries it for reference.
 */

export function SpecTable({
  specs,
  caption,
  className,
}: {
  specs: Spec[]
  caption?: string
  className?: string
}) {
  // A spec table is a reading surface, not a layout that should fill the
  // page. It is two columns; run it to the full 1500px content column and a
  // label ends up half a metre from its value. Capped like prose, and the
  // cap is what keeps the 38% label column a sane width in absolute terms.
  return (
    <div className={cn('overflow-x-auto max-w-[54rem]', className)}>
      <table className="w-full border-collapse text-[17px]">
        {caption && (
          <caption className="font-mono text-[13px] font-medium tracking-[0.14em] uppercase text-ink-400 caption-top text-left pb-3 border-b-2 border-brand-900">
            {caption}
          </caption>
        )}
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-b border-rule last:border-b-0">
              <th
                scope="row"
                className="font-mono text-[13px] font-medium tracking-[0.1em] uppercase text-ink-400 text-left align-top w-[38%] py-4 pr-4 normal-nums"
              >
                {spec.label}
              </th>
              <td className="align-top py-4 tabular-nums text-ink-900">
                {spec.value ? (
                  <span className="font-mono text-[17px] leading-relaxed">
                    {spec.value}
                    {spec.unit && (
                      <span className="ml-2 font-sans text-[14.5px] text-ink-500 normal-nums">
                        {spec.unit}
                      </span>
                    )}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** ASTM / ISO number, rendered as a scannable chip. */
export function StandardChip({ children }: { children: string }) {
  return (
    <code className="font-mono text-[11px] bg-paper-2 border border-rule rounded-sm px-1.5 py-1 text-ink-700">
      {children}
    </code>
  )
}

export function StandardList({ standards }: { standards: string[] }) {
  if (standards.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
      {standards.map((s) => (
        <li key={s}>
          <StandardChip>{s}</StandardChip>
        </li>
      ))}
    </ul>
  )
}
