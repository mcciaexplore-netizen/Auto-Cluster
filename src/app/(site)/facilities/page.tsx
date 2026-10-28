import type { Metadata } from 'next'
import { primaryFacilities } from '@/content/facilities'
import { categories, getEquipmentByCategory } from '@/content/equipment'
import { serviceTiles } from '@/content/images'
import { PageHero, Section } from '@/components/ui/Section'
import { ServiceCard } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Facilities — Testing, Machining and Prototyping in Pune',
  description:
    'Environmental testing, NABL-accredited rubber and polymer testing, VMC machining, rapid prototyping, metrology, design, skill development and incubation at Auto Cluster, Chinchwad.',
}

/** The Facilities hub. `Facilities` is `href="#"` on the current site. */
export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Facilities"
        title="Infrastructure MSMEs cannot justify buying alone"
        subtitle="Testing, machining, prototyping and metrology under one roof in Chinchwad, with NABL ISO/IEC 17025:2017 accreditation on the laboratories."
      />

      <Section tone="glow">
        <h2 className="sr-only">All facilities</h2>
        {/* `items-start`, against `card-grid`'s own default stretch: three of
            these eight have no isometric figure (Design Centre, Skill
            Development, Incubation Centre) — real content-pending pages,
            not photography this project owns yet. Stretched to match a
            row-mate that does have one, their card was mostly blank interior
            below the "View facility" link. Left to their own height instead,
            each card is only as tall as what it actually has to show. */}
        <ul className="card-grid items-start gap-5 list-none m-0 p-0">
          {primaryFacilities.map((f) => {
            const machines = f.category ? getEquipmentByCategory(f.category) : []
            const data = [
              ...(machines.length ? [{ label: 'Machines', value: String(machines.length) }] : []),
              ...(f.tests ? [{ label: 'Test methods', value: String(f.tests.length) }] : []),
            ]
            return (
              <li key={f.slug}>
                <ServiceCard
                  href={`/facilities/${f.slug}`}
                  title={f.name}
                  description={f.summary}
                  eyebrow={categories.find((c) => c.id === f.category)?.label}
                  image={f.category ? serviceTiles[f.category] : undefined}
                  badge={f.isAccredited ? 'NABL 17025' : undefined}
                  data={data}
                />
              </li>
            )
          })}
        </ul>
      </Section>
    </>
  )
}
