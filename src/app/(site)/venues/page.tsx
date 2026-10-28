import type { Metadata } from 'next'
import Image from 'next/image'
import { venues } from '@/content/venues'
import { exhibitionBanner, venuePhotos } from '@/content/images'
import { PageHero, Section } from '@/components/ui/Section'
import { ServiceCard } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Venues — Exhibition Halls, Auditorium and Training Rooms in Pune',
  description:
    '4,000 sq m of exhibition space across two air-conditioned halls and an open display area, a 172-seat auditorium, and a 30-workstation CAD/CAM training centre in Chinchwad, Pune.',
}

/** The Venues hub. `Services` is `href="#"` on the current site. */
export default function VenuesPage() {
  return (
    <>
      <PageHero
        eyebrow="Venues"
        title="Exhibition halls, auditorium and training rooms"
        subtitle="More than 100 industrial exhibitions hosted over ten years, on a permanent site designed to international guidelines."
      />

      {/* The claim in the subtitle above, evidenced. An ACMA show in Hall A,
          and the only wide photograph in the library that is of this site
          rather than of a machine. Full-bleed rather than boxed: at 1900×600
          it is the one asset with the resolution to carry a band. */}
      <div className="border-b border-rule bg-paper-2">
        <Image
          src={exhibitionBanner.src}
          alt={exhibitionBanner.alt}
          width={exhibitionBanner.width}
          height={exhibitionBanner.height}
          sizes="100vw"
          priority
          className="block w-full h-auto max-h-[380px] object-cover"
        />
      </div>

      <Section>
        <h2 className="sr-only">All venues</h2>
        <ul className="card-grid gap-5 list-none m-0 p-0">
          {venues.map((v) => (
            <li key={v.slug}>
              <ServiceCard
                href={`/venues/${v.slug}`}
                title={v.name}
                description={v.summary}
                image={venuePhotos[v.slug]}
                data={v.highlights
                  .filter((h) => h.value)
                  .slice(0, 2)
                  .map((h) => ({ label: h.label, value: h.value as string }))}
                cta="View venue"
              />
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
