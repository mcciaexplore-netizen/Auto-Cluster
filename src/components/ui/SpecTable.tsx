import type { Spec, SpecFlag } from '@/lib/types'
import { cn } from '@/lib/cn'

/**
 * The specification table — the atomic unit of the whole site.
 *
 * Shows its working. The source material carries real technical errors
 * (`1100 M` of crosshead travel, `6000C` for 600 °C, a chamber listed as 6 mm
 * deep). We correct them and cite the published value beneath, rather than
 * amending silently. See DESIGN_DIRECTION.md §4.
 */

const flagStyles: Record<SpecFlag['kind'], string> = {
  corrected: 'bg-flag-ok-bg text-flag-ok-fg border-flag-ok-edge',
  verify: 'bg-flag-warn-bg text-flag-warn-fg border-flag-warn-edge',
  missing: 'bg-paper-2 text-ink-500 border-rule-strong',
}

const flagLabels: Record<SpecFlag['kind'], string> = {
  corrected: 'Corrected',
  verify: 'Verify',
  missing: 'Not supplied',
}

export function FlagChip({ kind, className }: { kind: SpecFlag['kind']; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block font-mono text-[9.5px] tracking-[0.1em] uppercase',
        'px-1.5 py-0.5 rounded-sm border align-middle whitespace-nowrap',
        flagStyles[kind],
        className,
      )}
    >
      {flagLabels[kind]}
    </span>
  )
}

export function SpecTable({
  specs,
  caption,
  className,
}: {
  specs: Spec[]
  caption?: string
  className?: string
}) {
  const hasFlags = specs.some((s) => s.flag)

  // A spec table is a reading surface, not a layout that should fill the
  // page. It is two columns; run it to the full 1500px content column and a
  // label ends up half a metre from its value. Capped like prose, and the
  // cap is what keeps the 38% label column a sane width in absolute terms.
  return (
    <div className={cn('overflow-x-auto max-w-[54rem]', className)}>
      <table className="w-full border-collapse text-[15px]">
        {caption && (
          <caption className="label caption-top text-left pb-3 border-b-2 border-brand-900">
            {caption}
          </caption>
        )}
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-b border-rule last:border-b-0">
              <th
                scope="row"
                className="label text-left align-top w-[38%] py-4 pr-4 font-medium normal-nums"
              >
                {spec.label}
              </th>
              <td className="align-top py-4 tabular-nums text-ink-900">
                {spec.value ? (
                  <span className="font-mono text-[15px] leading-relaxed">
                    {spec.value}
                    {spec.unit && (
                      <span className="ml-2 font-sans text-[13px] text-ink-500 normal-nums">
                        {spec.unit}
                      </span>
                    )}
                  </span>
                ) : null}

                {spec.flag && (
                  <>
                    <FlagChip kind={spec.flag.kind} className={spec.value ? 'ml-2' : ''} />
                    <span className="block mt-1.5 font-sans text-[12.5px] leading-snug text-ink-400 normal-nums">
                      {spec.flag.kind !== 'missing' && spec.flag.published && (
                        <>Published as &ldquo;{spec.flag.published}&rdquo;. </>
                      )}
                      {spec.flag.note}
                    </span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasFlags && (
        <div className="mt-6 pt-4 border-t border-rule flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <FlagChip kind="corrected" /> error in source, fixed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FlagChip kind="verify" /> awaiting ACDRI confirmation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FlagChip kind="missing" /> data does not exist yet
          </span>
        </div>
      )}
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
