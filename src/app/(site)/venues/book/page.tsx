import { PageHero, Section } from '@/components/ui/Section'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getVenue, expoTypes } from '@/content/venues'
export const metadata = { title: 'Request a venue booking', description: 'Request an exhibition, conference, video-conference or training venue at Auto Cluster, Pune.' }
export default async function BookVenuePage({ searchParams }: { searchParams: Promise<{ venue?: string; expo?: string }> }) {
  const query = await searchParams
  const venue = query.venue ? getVenue(query.venue) : undefined
  const expo = expoTypes.find((e) => e === query.expo) ?? ''
  return <>
    <PageHero eyebrow="Venue booking" title="Plan your next gathering." subtitle="One request for your venue, dates and arrangements. Our team will confirm availability and send a quotation before payment." />
    <Section tone="white"><div className="grid lg:grid-cols-[minmax(0,720px)_1fr] gap-12"><EnquiryForm lockedServiceId="venue-hire" defaultVenue={venue?.slug} defaultExpo={expo} defaultSubject={[venue?.name, expo].filter(Boolean).join(' — ')} />
      <aside className="lg:sticky lg:top-28 self-start border-t-2 border-brand-600 pt-6"><h2 className="text-2xl">What happens next</h2><ol className="list-decimal pl-5 mt-5 space-y-5 text-ink-700"><li>The venue team reviews your dates, room use and requirements.</li><li>You receive the confirmed quotation, guidelines and any requested floor plan privately.</li><li>Once approved, a payment link appears on your private booking page when issued by accounts.</li></ol><p className="mt-6 text-sm">All times are India Standard Time. Floor plans are shared directly with facility users.</p></aside>
    </div></Section>
  </>
}
