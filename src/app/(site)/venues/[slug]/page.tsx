import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getVenue, venues } from '@/content/venues'
import { site } from '@/content/site'
import { expoTile, venuePhotos } from '@/content/images'
import { PageHero, Prose, Section } from '@/components/ui/Section'
import { Figure } from '@/components/ui/Figure'
import { SpecTable } from '@/components/ui/SpecTable'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Card'

export function generateStaticParams() {
  return venues.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const venue = getVenue(slug)
  if (!venue) return {}
  return { title: `${venue.name} on Rent in Pimpri Chinchwad`, description: venue.summary }
}

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const venue = getVenue(slug)
  if (!venue) notFound()

  const photo = venuePhotos[venue.slug]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: `${site.shortName} ${venue.name}`,
    description: venue.summary,
    ...(venue.slug === 'auditorium' && { maximumAttendeeCapacity: 172 }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.lines.join(', '),
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressRegion: site.address.region,
      addressCountry: 'IN',
    },
  }

  return (
    <>
      <PageHero eyebrow="Venue" title={venue.h1} subtitle={venue.h2}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/venues/book?venue=${venue.slug}`}>Request a booking</ButtonLink>
          <ButtonLink href="/venues/rate-card" variant="secondary">
            Rate card
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <h2>{venue.name}</h2>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start">
          <Prose paragraphs={venue.intro} />
          {photo && <Figure image={photo} sizes="(min-width: 1024px) 420px, 100vw" priority />}
        </div>
      </Section>

      <Section>
        <h2>Specification</h2>
        <p className="mt-4 text-ink-700">
          Dimensions, capacity and facilities, as text you can copy into a proposal.
        </p>
        <div className="mt-8">
          <SpecTable specs={venue.specs} caption={`${venue.name} · specification`} />
        </div>
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">Highlights</h2>
        <ul className="mt-5 card-grid gap-4 list-none m-0 p-0">
          {venue.highlights.map((h) => (
            <li key={h.label} className="border border-rule rounded-md bg-white p-5">
              <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400 block">
                {h.value ? h.label : 'Included'}
              </span>
              <span className="font-display font-semibold text-[18px] text-ink-900 block mt-1.5 tabular-nums">
                {h.value ?? h.label}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {venue.expoTypes && (
        <Section>
          <h2>Types of exhibition</h2>
          <p className="mt-4 text-ink-700">
            All {venue.expoTypes.length} categories are bookable. Pick one to start a
            request with it pre-selected.
          </p>
          {/* Each category carries the live site's own illustration for it.
              They are category art, not photographs of this hall — the
              Dental Expo tile is a dental surgery — so they are decorative
              and the link text is the only thing announced. The image is
              inside the anchor so the whole tile is one target. */}
          <ul className="mt-8 card-grid gap-4 list-none m-0 p-0">
            {venue.expoTypes.map((t) => {
              const tile = expoTile(t)
              return (
                <li key={t}>
                  <a
                    href={`/venues/book?venue=${venue.slug}&expo=${encodeURIComponent(t)}`}
                    className="group flex flex-col h-full bg-white border border-rule rounded-md overflow-hidden no-underline transition-colors duration-150 hover:border-brand-600"
                  >
                    {tile && (
                      <Image
                        src={tile.src}
                        alt=""
                        width={tile.width}
                        height={tile.height}
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 100vw"
                        className="block w-full h-auto aspect-[3/2] object-cover border-b border-rule"
                      />
                    )}
                    <span className="flex items-center flex-1 min-h-11 px-4 py-3 text-[14.5px] text-ink-900 group-hover:text-brand-600">
                      {t}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      <Section tone="white">
        <h2 className="text-[22px]">Documents</h2>
        <div className="mt-5 card-grid gap-4">
          <EmptyState
            title="Guidelines and rules"
            body="The booking guidelines and agreement document will be available here shortly. Ask us for a copy in the meantime and we will send it by email."
          />
          <EmptyState
            title="Floor plan"
            body="Floor plans and stall layout diagrams are being prepared. Contact us for the dimensions you need and we will send them over."
          />
        </div>
      </Section>

      <Section tone="accent">
        <h2 className="text-[24px]">Request a booking</h2>
        <p className="mt-3 text-ink-700">
          Send us your dates and requirements. We confirm availability and cost by return.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={`/venues/book?venue=${venue.slug}`}>Request a booking</ButtonLink>
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
