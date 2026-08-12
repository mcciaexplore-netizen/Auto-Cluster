import type { Metadata } from 'next'
import { PendingPage } from '@/components/blocks/PendingPage'
import { Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Tenders and Notices',
  description:
    'Public tender notices from the Auto Cluster Development and Research Institute, Pune. Notices are viewable without registration; an account is needed only to submit a bid.',
}

/**
 * /tenders — public list, no login.
 *
 * Today `/tenders/` is a standalone PHP application where no tender is visible
 * without an account. For a body promoted by the Ministry of Commerce and
 * Industry that inverts the normal expectation: registration should be
 * required to submit a bid, not to read a notice.
 */
export default function TendersPage() {
  return (
    <PendingPage
      eyebrow="Procurement"
      title="Tenders and notices"
      subtitle="Tender notices are published here in full, with no login required. An account is needed only to submit a bid."
      reason="Tender records are being migrated from the standalone PHP application at /tenders/, which currently requires an account before any notice can be read."
      question="CQ-62"
    >
      <Section tone="white">
        <h2 className="text-[22px]">What changes here</h2>
        <ul className="mt-5 flex flex-col gap-3 list-none m-0 p-0">
          {[
            'Notices are public. Reference number, title, category, published and closing dates, EMD amount, documents and a named contact — all viewable without an account.',
            'Closed tenders stay online as a public archive.',
            'Registration and login are required only at the point of submitting a bid.',
            'Every notice links to its own documents directly, so nothing sits behind a broken or placeholder download.',
          ].map((item) => (
            <li key={item} className="relative pl-6 text-ink-700 text-[15px] max-w-[66ch]">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
              />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/tenders/portal" variant="secondary" size="sm">
            Vendor portal
          </ButtonLink>
        </div>
      </Section>
    </PendingPage>
  )
}
