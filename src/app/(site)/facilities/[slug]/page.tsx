import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { facilities, getFacility } from '@/content/facilities'
import { getEquipmentByCategory } from '@/content/equipment'
import { site } from '@/content/site'
import { facilityHeroImages, facilityPhotos } from '@/content/images'
import { PageHero, Prose, Section } from '@/components/ui/Section'
import { CardImage, Figure } from '@/components/ui/Figure'
import { StandardList } from '@/components/ui/SpecTable'
import { ButtonLink } from '@/components/ui/Button'
import { BuildNote } from '@/components/blocks/BuildNote'
import { cn } from '@/lib/cn'

export function generateStaticParams() {
  return facilities.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const facility = getFacility(slug)
  if (!facility) return {}
  return { title: `${facility.name} in Pune`, description: facility.summary }
}

export default async function FacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const facility = getFacility(slug)
  if (!facility) notFound()

  const machines = facility.category ? getEquipmentByCategory(facility.category) : []
  const photos = facilityPhotos[facility.slug] ?? []
  const standards = [
    ...new Set([
      ...machines.flatMap((m) => m.standards),
      ...(facility.tests?.flatMap((t) => t.standards ?? []) ?? []),
    ]),
  ].sort()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: facility.name,
    description: facility.summary,
    areaServed: 'Pune',
    provider: { '@type': 'Organization', name: site.name },
  }

  return (
    <>
      <PageHero
        eyebrow={facility.isAccredited ? site.accreditation.nabl : 'Facility'}
        title={facility.h1}
        subtitle={facility.h2}
        image={facilityHeroImages[facility.slug]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/contact?facility=${facility.slug}`}>Send an enquiry</ButtonLink>
          {machines.length > 0 && (
            <ButtonLink href={`/equipment?category=${facility.category}`} variant="secondary">
              {machines.length} machines
            </ButtonLink>
          )}
        </div>
      </PageHero>

      {facility.pendingCapture && (
        <BuildNote variant="banner" question="CQ-67">
          This page is awaiting a verbatim capture from the live site and copy
          confirmation from ACDRI.
        </BuildNote>
      )}

      {facility.intro.length > 0 && (
        <Section tone="white">
          <h2>About our {facility.name.toLowerCase()}</h2>
          <Prose className="mt-5" paragraphs={facility.intro} />

          {/* Whatever photography exists for this facility — the team, the
              room, or a machine that has no catalogue record of its own.
              Two columns only once there are two photos to fill them — one
              photo alone in a sm:grid-cols-2 left a blank half behind it. */}
          {photos.length > 0 && (
            <div
              className={cn(
                'mt-10 grid gap-5',
                photos.length > 1 ? 'sm:grid-cols-2' : 'max-w-[520px]',
              )}
            >
              {photos.map((p) => (
                <Figure
                  key={p.src}
                  image={p}
                  aspect="4 / 3"
                  sizes={photos.length > 1 ? '(min-width: 640px) 45vw, 100vw' : '520px'}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      {facility.capabilities && facility.capabilities.length > 0 && (
        <Section>
          <h2 className="text-[22px]">Our {facility.name.toLowerCase()} capabilities</h2>
          <p className="mt-4 text-ink-700">
            Auto Cluster Development and Research Institute Pune is equipped with the
            following chamber types.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 list-none m-0 p-0">
            {facility.capabilities.map((c) => (
              <li key={c} className="relative pl-6 text-ink-700 text-[15px]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
                />
                {c}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {machines.length > 0 && (
        <Section>
          <h2>Equipment</h2>
          <p className="mt-4 text-ink-700">
            Every machine has a full specification page with make, model, capacity and
            applicable standards.
          </p>
          {/* flex-wrap, not card-grid: card-grid's auto-fit columns are
              fixed for the whole grid, so a trailing row with fewer items
              than a full row left empty column tracks behind it. grow lets
              a short last row's cards widen to fill the row, and
              justify-center centres whatever growth the max-width cap below
              stops from closing the row completely — a lone or short pair of
              cards reads as centred, not stranded on the left. */}
          <ul className="mt-8 flex flex-wrap justify-center gap-4 list-none m-0 p-0">
            {machines.map((m) => (
              <li key={m.slug} className="grow basis-[16.25rem] max-w-[23rem]">
                <Link
                  href={`/equipment/${m.slug}`}
                  className="group block h-full bg-white rounded-md p-5 no-underline shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-hover)]"
                >
                  {m.image && (
                    <CardImage
                      image={{ ...m.image, alt: '' }}
                      bleed="-mx-5 -mt-5 rounded-t-md"
                    />
                  )}

                  <span className="block mt-1 font-display font-semibold text-[17px] leading-tight text-brand-600">
                    {m.name}
                  </span>
                  {m.make && (
                    <span className="block mt-1 font-mono text-[12px] text-ink-400">
                      {[m.make, m.model].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  <span className="block mt-2 text-[13.5px] leading-snug text-ink-500">
                    {m.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {facility.tests && facility.tests.length > 0 && (
        <Section tone="white">
          <h2>Tests conducted at Auto Cluster</h2>
          <p className="mt-4 text-ink-700">
            {facility.tests.length} test methods, each with the applicable standard where
            it is on record.
          </p>

          <div className="mt-8 border-t border-rule">
            {facility.tests.map((test) => (
              <details key={test.name} className="group border-b border-rule">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-4 min-h-11">
                  <h3 className="text-solid text-[18px] m-0 text-ink-900 group-open:text-brand-600">
                    {test.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-ink-400 group-open:rotate-45 transition-transform duration-150"
                  >
                    +
                  </span>
                </summary>
                <div className="pb-5 flex flex-col gap-3">
                  {test.body.map((p, i) => (
                    <p key={i} className="text-[15px] text-ink-700 m-0">
                      {p}
                    </p>
                  ))}
                  {test.standards && test.standards.length > 0 && (
                    <div className="pt-1">
                      <StandardList standards={test.standards} />
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}

      {standards.length > 0 && (
        <Section>
          <h2>Standards we test to</h2>
          <div className="mt-5">
            <StandardList standards={standards} />
          </div>
          <BuildNote question="CQ-53">
            Twenty of the thirty machine records carry no standards in the source material.
            The list above is what is currently on record.
          </BuildNote>
        </Section>
      )}

      {facility.industries.length > 0 && (
        <Section tone="white">
          <h2 className="text-[22px]">Industries we serve</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 list-none m-0 p-0">
            {facility.industries.map((i) => (
              <li key={i} className="relative pl-6 text-ink-700 text-[15px]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
                />
                {i}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {facility.projects && facility.projects.length > 0 && (
        <Section>
          <h2 className="text-[22px]">Special projects undertaken</h2>
          <ul className="mt-5 flex flex-col gap-3 list-none m-0 p-0">
            {facility.projects.map((p) => (
              <li key={p} className="relative pl-6 text-ink-700 text-[15px] max-w-[66ch]">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
                />
                {p}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {facility.team && facility.team.length > 0 && (
        <Section tone="white">
          <h2 className="text-[22px]">Meet the team</h2>
          {/* flex-wrap, same reasoning as the Equipment list above — team
              size varies a lot page to page, and tile-grid's fixed auto-fit
              columns left a blank trailing row for the ones that didn't
              divide evenly into a full row. */}
          <ul className="mt-5 flex flex-wrap gap-3 list-none m-0 p-0">
            {facility.team.map((name) => (
              <li key={name} className="grow basis-[13rem] max-w-[17rem] border-b border-rule pb-3">
                <span className="block text-[15px] font-semibold text-ink-900">{name}</span>
                <span className="block font-mono text-[11px] tracking-[0.1em] uppercase text-ink-400 mt-1">
                  Designation pending
                </span>
              </li>
            ))}
          </ul>
          <BuildNote question="CQ-11">
            No team member on the current site carries a job title. Designations have been
            requested from ACDRI.
          </BuildNote>
        </Section>
      )}

      <Section tone="accent">
        <h2 className="text-[24px]">Talk to the {facility.name} team</h2>
        <p className="mt-3 text-ink-700">
          Tell us about your part or sample and we will confirm suitability, turnaround and
          cost.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/contact?facility=${facility.slug}`}>Send an enquiry</ButtonLink>
          <ButtonLink href={site.phone.href} variant="secondary">
            Call {site.phone.display}
          </ButtonLink>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
