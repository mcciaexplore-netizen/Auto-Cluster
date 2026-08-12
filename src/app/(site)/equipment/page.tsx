import type { Metadata } from 'next'
import Link from 'next/link'
import { categories, equipment } from '@/content/equipment'
import { Container, PageHero, Section } from '@/components/ui/Section'
import { StandardList } from '@/components/ui/SpecTable'
import { CardImage } from '@/components/ui/Figure'
import { EquipmentMap } from './components/map/EquipmentMap'
import type { EquipmentCategory } from '@/lib/types'
import type { MapMachine } from '@/lib/map-layout'

export const metadata: Metadata = {
  title: 'Equipment Catalogue — 30 Machines with Full Specifications',
  description:
    'Every machine at Auto Cluster Pune: VMC machining centres, 3D printers, environmental chambers, and NABL-accredited rubber and polymer test instruments. Make, model, capacity and applicable standards.',
}

/**
 * /equipment — the filterable catalogue.
 *
 * These 30 records were locked inside a modal library that rendered in the DOM
 * of every page and had no URL of its own. Engineers search by make, model and
 * standard; none of it was indexable. This is the single largest SEO gain
 * available on the project.
 */
export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const active = categories.find((c) => c.id === category)?.id as EquipmentCategory | undefined

  const shown = active
    ? equipment.filter((e) => e.category === active || e.alsoIn?.includes(active))
    : equipment
  const mapMachines: MapMachine[] = equipment.map(
    ({ slug, name, category, alsoIn, make, image, isAccredited }) => ({
      slug,
      name,
      category,
      alsoIn,
      make,
      image,
      isAccredited,
    }),
  )

  return (
    <>
      <PageHero
        eyebrow="Equipment catalogue"
        title="Every machine, with its specifications"
        subtitle={`${equipment.length} machines across prototype production, rapid prototyping, environmental testing, rubber and polymer testing, and metrology.`}
      />

      {/* The map. Sits between the heading block and the filter bar: it is
          the way into the catalogue, and the chips below are the way through
          it. It renders every machine regardless of the active filter —
          filtering it to six would contradict the one thing it says, that
          these are one connected system — so `?category=` lights the matching
          zone instead of hiding the rest. */}
      <EquipmentMap machines={mapMachines} categories={categories} activeCategory={active ?? null} />

      {/* Filters are links, not JS — the catalogue works with scripting off. */}
      <div className="bg-white border-b border-rule">
        <Container className="py-5">
          <nav aria-label="Filter by category">
            <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
              <li>
                <FilterChip href="/equipment" active={!active}>
                  All {equipment.length}
                </FilterChip>
              </li>
              {categories.map((c) => {
                const count = equipment.filter(
                  (e) => e.category === c.id || e.alsoIn?.includes(c.id),
                ).length
                return (
                  <li key={c.id}>
                    <FilterChip href={`/equipment?category=${c.id}`} active={active === c.id}>
                      {c.label} {count}
                    </FilterChip>
                  </li>
                )
              })}
            </ul>
          </nav>
        </Container>
      </div>

      <Section>
        <h2 className="sr-only">Equipment</h2>

        <ul className="card-grid gap-5 list-none m-0 p-0">
          {shown.map((item) => {
            const incomplete = item.specs.some((s) => s.flag?.kind === 'missing')
            return (
              <li key={item.slug}>
                <Link
                  href={`/equipment/${item.slug}`}
                  className="group h-full bg-white border-2 border-rule-strong rounded-md p-6 flex flex-col gap-3 no-underline shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 hover:border-brand-600 hover:shadow-[var(--shadow-hover)]"
                >
                  {/* The machine, so the catalogue can be scanned by eye as
                      well as by make and model. Decorative here: the name and
                      the make sit directly beneath every one of them, so the
                      alt text would be read out twice. */}
                  {item.image && (
                    <CardImage
                      image={{ ...item.image, alt: '' }}
                      bleed="-mx-6 -mt-6 rounded-t-[5px]"
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400">
                      {categories.find((c) => c.id === item.category)?.label}
                    </span>
                    {item.isAccredited && (
                      <span className="font-mono text-[10px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-1.5 py-0.5 shrink-0">
                        NABL
                      </span>
                    )}
                  </div>

                  <h3 className="text-[19px] leading-tight">{item.name}</h3>

                  {(item.make || item.model) && (
                    <p className="font-mono text-[12.5px] text-ink-500 m-0">
                      {[item.make, item.model].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  <p className="text-[14px] leading-snug text-ink-500 m-0">{item.summary}</p>

                  {item.standards.length > 0 && <StandardList standards={item.standards.slice(0, 3)} />}

                  {incomplete && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-warning">
                      Specifications pending
                    </span>
                  )}

                  <span className="mt-auto pt-2 text-sm font-semibold text-brand-800 group-hover:underline underline-offset-4">
                    View specification <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {shown.length === 0 && (
          <p className="text-ink-500">
            No machines in this category yet.{' '}
            <Link href="/equipment" className="text-brand-800">
              View all equipment
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  )
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={
        'inline-flex items-center min-h-11 px-4 rounded-md border font-mono text-[12px] tracking-[0.06em] uppercase no-underline transition-colors duration-150 ' +
        (active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'bg-white text-ink-700 border-rule hover:border-brand-600 hover:text-brand-600')
      }
    >
      {children}
    </Link>
  )
}
