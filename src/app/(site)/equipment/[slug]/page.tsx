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
  const related = equipment
    .filter((e) => e.slug !== item.slug && e.category === item.category)
    .slice(0, 3)

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

          <div className="flex flex-wrap items-start gap-3 mb-2">
            {item.isAccredited && (
              <span className="font-mono text-[10.5px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-2 py-1">
                {site.accreditation.nabl}
              </span>
            )}
          </div>

          <h1>{item.name}</h1>

          {(item.make || item.model) && (
            <p className="mt-2 font-mono text-[14px] text-ink-500">
              {[item.make, item.model, item.machineType].filter(Boolean).join(' · ')}
            </p>
          )}

          <p className="mt-4 text-[15px] text-ink-500">{item.summary}</p>
        </Container>
      </div>

      <Section>
        <h2 className="sr-only">Specification</h2>

        {/* The photograph leads the specification rather than the page. A
            machine record is read for its numbers, and a 500×333 asset from
            2020 stretched across the top of the page would be the first thing
            seen and the least useful thing on it. At this width it sits beside
            the table on a wide screen and above it on a narrow one. */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {item.image && (
            <Figure
              image={item.image}
              className="lg:w-[340px] lg:shrink-0"
              sizes="(min-width: 1024px) 340px, 100vw"
              priority
            />
          )}
          <div className="min-w-0 flex-1">
            <SpecTable specs={item.specs} caption="Specification · as verified against source" />
          </div>
        </div>

        {item.rate && (
          <div className="mt-8 border border-rule rounded-md bg-white p-6">
            <h3 className="text-[17px] m-0">Indicative rate</h3>
            <p className="mt-2 font-mono text-[20px] text-ink-900 tabular-nums m-0">
              {formatRupees(item.rate.min)} – {formatRupees(item.rate.max)}{' '}
              <span className="font-sans text-[13px] text-ink-500">
                {item.rate.uom.toLowerCase()}
              </span>
            </p>
            <p className="mt-2 text-[13px] text-ink-500 m-0">
              Core operation rate, effective 1 November 2025. The lower figure applies to
              MSMEs; MCCIA members receive a further 10% discount.{' '}
              <Link href="/venues/rate-card" className="text-brand-800">
                Full rate card
              </Link>
              .
            </p>
          </div>
        )}
      </Section>

      {(item.applications.length > 0 || item.standards.length > 0) && (
        <Section tone="white">
          <div className="grid gap-10 md:grid-cols-2">
            {item.applications.length > 0 && (
              <div>
                <h2 className="text-[22px]">Applications</h2>
                <ul className="mt-4 flex flex-col gap-2 list-none m-0 p-0">
                  {item.applications.map((a) => (
                    <li key={a} className="relative pl-6 text-ink-700 text-[15px]">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.standards.length > 0 && (
              <div>
                <h2 className="text-[22px]">Test standards</h2>
                <div className="mt-4">
                  <StandardList standards={item.standards} />
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section tone="accent">
        <h2 className="text-[24px]">Enquire about the {item.name}</h2>
        <p className="mt-3 text-ink-700">
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

      {related.length > 0 && (
        <Section>
          <h2 className="text-[22px]">Related equipment</h2>
          <ul className="mt-5 card-grid gap-4 list-none m-0 p-0">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/equipment/${r.slug}`}
                  className="block bg-white border border-rule rounded-md p-5 no-underline hover:border-brand-600 transition-colors duration-150"
                >
                  <span className="block font-display font-semibold text-[16px] text-brand-600">
                    {r.name}
                  </span>
                  {r.make && (
                    <span className="block mt-1 font-mono text-[12px] text-ink-400">{r.make}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
