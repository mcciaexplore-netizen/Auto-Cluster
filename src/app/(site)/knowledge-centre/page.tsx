import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'

export const metadata: Metadata = {
  title: 'Knowledge Centre',
  description:
    'Technical resources, test standards and guidance from the Auto Cluster Development and Research Institute, Pune.',
}

export default function KnowledgeCentrePage() {
  return (
    <PendingPage
      eyebrow="Resources"
      title="Knowledge Centre"
      subtitle="Technical resources and guidance for MSMEs on testing, validation and prototyping."
      reason="This page exists on the current site but is unlinked — its nav item is a dead link. Awaiting a verbatim capture."
      question="CQ-67"
    />
  )
}
