import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories, equipment, getEquipment } from '@/content/equipment'
import { formatRupees } from '@/content/rates'
import { site } from '@/content/site'
import { Container, Section } from '@/components/ui/Section'
import { SpecTable, StandardList } from '@/components/ui/SpecTable'
import { Figure } from '@/components/ui/Figure'
import { ButtonLink } from '@/components/ui/Button'

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getEquipment(slug)
  if (!item) return {}

  const makeModel = [item.make, item.model].filter(Boolean).join(' ')
  return {
    title: `${item.name}${makeModel ? ` — ${makeModel}` : ''} | Pune`,
    description: `${item.summary} Available at Auto Cluster, Chinchwad, Pune.${
      item.standards.length ? ` Tested to ${item.standards.join(', ')}.` : ''
    }`,
  }
}

/**
 * /equipment/[slug] — one indexable page per machine.
 *
 * The spec table shows its correction trail: corrected values lead, the
 * published value is cited beneath. See DESIGN_DIRECTION.md §4.
 */
export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getEquipment(slug)
  if (!item) notFound()

  const category = categories.find((c) => c.id === item.category)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.summary,
    ...(item.make && { brand: { '@type': 'Brand', name: item.make } }),
    ...(item.model && { model: item.model }),
    category: category?.label,
  }

  return (
    <>
      <div className="bg-white border-b border-rule">
        <Container className="py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap gap-1.5 list-none m-0 p-0 font-mono text-[11px] tracking-[0.08em] text-ink-400">
              <li>
                <Link href="/equipment" className="text-ink-400 no-underline hover:text-brand-800 hover:underline">
                  Equipment
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/equipment?category=${item.category}`}
                  className="text-ink-400 no-underline hover:text-brand-800 hover:underline"
                >
                  {category?.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink-700">
                {item.name}
              </li>
            </ol>
          </nav>

          {/* Large uncropped photograph, with all machine details alongside it. */}
          <div className={item.image ? 'grid gap-8 lg:gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start' : 'min-w-0'}>
            {item.image && (
              <Figure
                image={item.image}
                className="w-full min-w-0"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                {item.isAccredited && (
                  <span className="font-mono text-[10.5px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-2 py-1">
                    {site.accreditation.nabl}
                  </span>
                )}
              </div>

              <h1 className="text-[clamp(32px,3.4vw,56px)] [overflow-wrap:anywhere]">{item.name}</h1>

              {(item.make || item.model) && (
                <p className="mt-2 font-mono text-[15px] text-ink-500">
                  {[item.make, item.model, item.machineType].filter(Boolean).join(' · ')}
                </p>
              )}

              <p className="mt-3 text-[18px] text-ink-500 max-w-[58ch]">{item.summary}</p>
              <div className="mt-6">
                <h2 className="sr-only">Specification</h2>
                <SpecTable specs={item.specs} caption="Specification · as verified against source" className="[&_th]:py-2.5 [&_td]:py-2.5 [&>div]:mt-4 [&>div]:pt-3" />
              </div>

            </div>
          </div>
          {item.rate && (
            <div className="mt-6 border border-rule rounded-md bg-white p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-[19px] m-0">Indicative rate</h3>
              <p className="mt-2 font-mono text-[24px] text-ink-900 tabular-nums m-0">
                {formatRupees(item.rate.min)} – {formatRupees(item.rate.max)}{' '}
                <span className="font-sans text-[15px] text-ink-500">
                  {item.rate.uom.toLowerCase()}
                </span>
              </p>
              <p className="mt-2 text-[14.5px] text-ink-500 m-0">
                Core operation rate, effective 1 November 2025. The lower figure applies to
                MSMEs; MCCIA members receive a further 10% discount.{' '}
                <Link href="/venues/rate-card" className="text-brand-800">
                  Full rate card
                </Link>
                .
              </p>
            </div>
          )}
        </Container>
      </div>

      {(item.applications.length > 0 || item.standards.length > 0) && (
        <Section tone="white" compact>
          <div className={item.standards.length > 0 ? "grid gap-10 md:grid-cols-2" : "grid gap-10"}>
            {item.applications.length > 0 && (
              <div>
                <h2 className="text-[24px]">Applications</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 list-none m-0 p-0">
                  {item.applications.map((a) => (
                    <li key={a} className="min-w-0 border border-rule rounded-md p-4 font-poppins text-[16px] font-medium leading-relaxed text-brand-800">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.standards.length > 0 && (
              <div>
                <h2 className="text-[24px]">Test standards</h2>
                <div className="mt-4">
                  <StandardList standards={item.standards} />
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section tone="accent" compact>
        <h2 className="text-[26px]">Enquire about the {item.name}</h2>
        <p className="mt-3 text-[16px] text-ink-700">
          Tell us about your sample or part and we will confirm suitability, turnaround and
          cost.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/contact?machine=${item.slug}`}>Enquire about this machine</ButtonLink>
          {item.isAccredited && (
            <ButtonLink href="/facilities/nabl-scope" variant="secondary">
              Download NABL scope
            </ButtonLink>
          )}
        </div>
      </Section>

<script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
