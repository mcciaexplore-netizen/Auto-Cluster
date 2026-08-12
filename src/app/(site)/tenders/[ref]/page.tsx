import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'

export const metadata: Metadata = {
  title: 'Tender Notice',
  description: 'Tender notice from the Auto Cluster Development and Research Institute, Pune.',
}

/**
 * /tenders/[ref] — the individual tender notice.
 *
 * Renders full description, documents, eligibility and submission
 * instructions. "Submit a bid" prompts login only at that point.
 */
export default async function TenderPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params

  return (
    <PendingPage
      eyebrow={`Tender ${ref}`}
      title="Tender notice"
      subtitle="Full notice, documents, eligibility and submission instructions — public, with no account required to read."
      reason="Historical tenders are being exported from the standalone PHP application so the archive can be republished publicly."
      question="CQ-62"
    />
  )
}
