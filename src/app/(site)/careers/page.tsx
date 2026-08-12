import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Work at the Auto Cluster Development and Research Institute, Chinchwad, Pune.',
}

export default function CareersPage() {
  return (
    <PendingPage
      eyebrow="Careers"
      title="Work at Auto Cluster"
      subtitle="Roles across our testing laboratories, machining facility and operations team."
      reason="This page exists on the current site but is unlinked — its nav item is a dead link. Awaiting a verbatim capture and current vacancies."
      question="CQ-67"
    />
  )
}
