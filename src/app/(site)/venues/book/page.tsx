import type { Metadata } from 'next'
import { expoTypes, venues } from '@/content/venues'
import { PageHero, Section } from '@/components/ui/Section'
import { EnquiryForm } from '@/components/EnquiryForm'

export const metadata: Metadata = {
  title: 'Book a Venue — Exhibition Centre, Auditorium, Training Hall',
  description:
    'Request a booking for the Auto Cluster Exhibition Centre, Auditorium or Training and Seminar Hall in Chinchwad, Pune. All 12 expo categories bookable.',
}

/**
 * /venues/book — the unified booking flow.
 *
 * The current booking form is a modal that loads in the DOM of every page and
 * offers 4 of the 12 advertised expo categories. All 12 are selectable here.
 */
export default async function BookVenuePage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string; expo?: string }>
}) {
  const { venue, expo } = await searchParams
  const selected = venues.find((v) => v.slug === venue)

  const subject = [selected?.name, expo].filter(Boolean).join(' — ')

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Request a venue booking"
        subtitle="Tell us the venue, your dates and the type of event. We confirm availability and cost by return."
      />

      <Section tone="white">
        <h2 className="text-[22px]">Venues available</h2>
        <ul className="mt-5 card-grid gap-4 list-none m-0 p-0">
          {venues.map((v) => (
            <li
              key={v.slug}
              className={
                'border rounded-md bg-white p-5 ' +
                (v.slug === venue ? 'border-brand-600' : 'border-rule')
              }
            >
              <span className="block font-display font-semibold text-[16px] text-brand-600">
                {v.name}
              </span>
              <span className="block mt-1 text-[13.5px] leading-snug text-ink-500">
                {v.summary}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="text-[22px]">All {expoTypes.length} expo categories are bookable</h2>
        <p className="mt-4 text-ink-700">
          From engineering and auto ancillary through to dental, education, property and
          jewellery. If your event does not fit one of these, tell us in the message and we
          will advise.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 list-none m-0 p-0">
          {expoTypes.map((t) => (
            <li
              key={t}
              className={
                'font-mono text-[12px] px-3 py-2 rounded-md border ' +
                (t === expo
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-ink-700 border-rule')
              }
            >
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <h2>Send your booking request</h2>
        <p className="mt-4 text-ink-700">
          Send us your dates and we will confirm availability, cost and setup access by
          return. Two days before and two days after your booked dates are reserved for
          setup and teardown.
        </p>
        {/* Left-aligned, not `mx-auto` — see the same fix on /contact for why:
            the page runs edge to edge, so a centred wrapper here floats away
            from the heading above it on anything wider than ~1600px. */}
        <div className="mt-8 max-w-[680px]">
          <EnquiryForm lockedServiceId="venue-hire" defaultSubject={subject} />
        </div>
      </Section>
    </>
  )
}
