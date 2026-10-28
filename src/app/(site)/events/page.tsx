import type { Metadata } from 'next'
import Image from 'next/image'
import { PendingPage } from '@/components/blocks/PendingPage'
import { Section } from '@/components/ui/Section'
import { expoTypes } from '@/content/venues'
import { expoTile } from '@/content/images'

export const metadata: Metadata = {
  title: 'Events — Past and Upcoming Exhibitions',
  description:
    'Exhibitions and industry events hosted at the Auto Cluster Exhibition Centre, Chinchwad, Pune.',
}

export default function EventsPage() {
  return (
    <PendingPage
      eyebrow="Events"
      title="Exhibitions and events"
      subtitle="More than 100 industrial exhibitions have been held here over the last ten years, by organisers including the Machine Tools Association and the Auto Components Manufacturers Association."
      reason="No event archive exists on the current site — a significant untapped asset. Past exhibition records, dates and photography have been requested from ACDRI."
      question="CQ-55"
    >
      <Section tone="white">
        <h2>Types of exhibition</h2>
        <p className="mt-4 text-ink-700">
          All {expoTypes.length} categories are bookable at the Exhibition Centre. Pick one to
          start a request with it pre-selected.
        </p>
        {/* Each category carries the live site's own illustration for it.
            They are category art, not photographs of the hall itself — the
            Dental Expo tile is a dental surgery — so they are decorative
            and the link text is the only thing announced. The image is
            inside the anchor so the whole tile is one target. */}
        <ul className="mt-8 card-grid gap-4 list-none m-0 p-0">
          {expoTypes.map((t) => {
            const tile = expoTile(t)
            return (
              <li key={t}>
                <a
                  href={`/venues/book?venue=exhibition-centre&expo=${encodeURIComponent(t)}`}
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
    </PendingPage>
  )
}
