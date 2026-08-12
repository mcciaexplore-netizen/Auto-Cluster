import type { Metadata } from 'next'
import {
  formatRupees,
  rateConditions,
  rateDepartmentLabels,
  rates,
  ratesByDepartment,
} from '@/content/rates'
import { PageHero, Section } from '@/components/ui/Section'
import { EmptyState } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { BuildNote } from '@/components/blocks/BuildNote'
import type { RateLine } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Rate Card — Testing, Machining and 3D Printing Rates',
  description:
    'Core operation rates for environmental testing, rubber and polymer testing, rapid prototyping and VMC machining at Auto Cluster, Pune. MSME and OEM pricing, with an additional MCCIA member discount.',
}

const departments = Object.keys(rateDepartmentLabels) as RateLine['department'][]

/**
 * /venues/rate-card
 *
 * The only pricing published anywhere on the current site lives inside
 * `Core-Operation-Rates-1.jpg` — unreadable by search engines and screen
 * readers, unselectable, and unusable on mobile. Transcribed to HTML here;
 * provenance in docs/extracted/rate-card.md.
 */
export default function RateCardPage() {
  return (
    <>
      <PageHero
        eyebrow="Core operation rates"
        title="Rate card"
        subtitle={`${rates.length} priced operations across testing, prototyping and machining. Effective 1 November 2025.`}
      />

      <Section>
        <h2 className="sr-only">Rates by department</h2>

        <div className="flex flex-col gap-12">
          {departments.map((dept) => {
            const lines = ratesByDepartment(dept)
            if (lines.length === 0) return null
            return (
              <section key={dept}>
                <h3 className="text-[20px]">{rateDepartmentLabels[dept]}</h3>
                {/* Four columns, so it takes more width than the spec table
                    — but still capped: two right-aligned rupee columns
                    stranded 1200px from the process name is not a rate card
                    anyone can read across. Scrolls below 520px. */}
                <div className="mt-4 overflow-x-auto max-w-[68rem]">
                  <table className="w-full border-collapse text-[15px] min-w-[520px]">
                    <thead>
                      <tr className="border-b-2 border-brand-900">
                        <th scope="col" className="label text-left py-3 pr-4 font-medium">
                          Machine or process
                        </th>
                        <th scope="col" className="label text-left py-3 pr-4 font-medium">
                          Unit
                        </th>
                        <th scope="col" className="label text-right py-3 pr-4 font-medium">
                          MSME
                        </th>
                        <th scope="col" className="label text-right py-3 font-medium">
                          OEM / Tier 1–2
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.process} className="border-b border-rule">
                          <td className="py-3.5 pr-4 text-ink-900">{line.process}</td>
                          <td className="py-3.5 pr-4 text-ink-500 text-[13.5px]">{line.uom}</td>
                          <td className="py-3.5 pr-4 text-right font-mono tabular-nums text-ink-900">
                            {formatRupees(line.min)}
                          </td>
                          <td className="py-3.5 text-right font-mono tabular-nums text-ink-900">
                            {formatRupees(line.max)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">Conditions</h2>
        <ol className="mt-5 flex flex-col gap-3 list-none m-0 p-0 counter-reset-none">
          {rateConditions.map((c, i) => (
            <li key={c} className="flex gap-4 text-[15px] text-ink-700 max-w-[66ch]">
              <span className="font-mono text-[12px] text-ink-400 tabular-nums shrink-0 pt-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-[13.5px] text-ink-500">
          Rates effective 1 November 2025. Rates are indicative; we confirm the exact
          figure with your quotation.
        </p>
        <BuildNote question="CQ-58">
          Transcribed from Core-Operation-Rates-1.jpg. Confirm these figures are still
          current before launch.
        </BuildNote>
      </Section>

      <Section>
        <h2 className="text-[22px]">Venue hire rates</h2>
        <div className="mt-5 max-w-[560px]">
          <EmptyState
            title="Not yet published"
            body="Hire rates for the Exhibition Centre, Auditorium and Training Hall are quoted per event, based on your dates, hall and setup requirements."
            action={
              <ButtonLink href="/contact?department=venue" variant="secondary" size="sm">
                Ask for a venue quote
              </ButtonLink>
            }
          />
        </div>
      </Section>
    </>
  )
}
