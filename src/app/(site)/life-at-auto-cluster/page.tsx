import type { Metadata } from 'next'
import { PendingList, PendingPage } from '@/components/blocks/PendingPage'
import { Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { lifeCategories } from '@/content/life'

export const metadata: Metadata = {
  title: 'Life at Auto Cluster',
  description:
    'Achievements, training, employee engagement and events at the Auto Cluster Development and Research Institute, Pune.',
}

export default function LifeAtAutoClusterPage() {
  return (
    <PendingPage
      eyebrow="Our people"
      title="Life at Auto Cluster"
      subtitle="Achievements, training programmes, employee engagement and the events that mark our year."
      reason="The five announcement sub-pages are awaiting a verbatim capture from the live site."
      question="CQ-67"
    >
      <PendingList
        heading="Sections"
        items={lifeCategories.map((c) => ({
          label: c.title,
          href: `/life-at-auto-cluster/${c.slug}`,
        }))}
      />

      <Section tone="white">
        <h2>Apply at Auto Cluster</h2>
        <p className="mt-4 text-ink-700 max-w-[60ch]">
          If our testing labs, machining facility and venues sound like somewhere you&rsquo;d
          want to work, send us your résumé — students, fresh graduates and working
          professionals are all welcome to apply.
        </p>
        <div className="mt-6">
          <ButtonLink href="/careers#apply">Apply now</ButtonLink>
        </div>
      </Section>
    </PendingPage>
  )
}
