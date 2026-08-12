import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'

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
    />
  )
}
