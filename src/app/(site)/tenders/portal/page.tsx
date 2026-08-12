import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'

export const metadata: Metadata = {
  title: 'Vendor Portal',
  description:
    'Registered vendor area for submitting bids to the Auto Cluster Development and Research Institute.',
}

export default function TenderPortalPage() {
  return (
    <PendingPage
      eyebrow="Vendor portal"
      title="Vendor portal"
      subtitle="Register, manage your profile and submit bids. Tender notices themselves are public and need no account."
      reason="Vendor accounts are being migrated from the standalone PHP application. Source code, database access and the existing vendor registrations have been requested."
      question="CQ-62"
    />
  )
}
