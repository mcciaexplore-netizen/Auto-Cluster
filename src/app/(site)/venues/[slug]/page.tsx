import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVenue, venues } from '@/content/venues'
import { site } from '@/content/site'
import { venuePhotos } from '@/content/images'
import { PageHero, Prose, Section } from '@/components/ui/Section'
import { Figure } from '@/components/ui/Figure'
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
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_minmax(0,590px)] lg:items-stretch">
          <div className="flex flex-col gap-8">
            <Prose paragraphs={venue.intro} />
            <ul className="grid gap-4 sm:grid-cols-2 list-none m-0 p-0">
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
          </div>
          {photo && (
            <Figure image={photo} sizes="(min-width: 1024px) 590px, 100vw" priority fill />
          )}
        </div>
      </Section>

      {/* Types of exhibition moved to /events — browsing expo categories is
          an events-page concern, not this venue page's. The section still
          books through this same venue's flow (see events/page.tsx). */}

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
