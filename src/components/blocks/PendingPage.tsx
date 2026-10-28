import Link from 'next/link'
import { PageHero, Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { BuildNote } from '@/components/blocks/BuildNote'
import { site } from '@/content/site'

/**
 * A route that exists, resolves and is honest about its state.
 *
 * Nine pages on the current site still need a verbatim capture, and several
 * routes in the new IA have no source content at all. They ship as real pages
 * rather than dead links or 404s — the current site has seven `href="#"` nav
 * items, three of which point at pages that already exist.
 */
export function PendingPage({
  eyebrow,
  title,
  subtitle,
  reason,
  question,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  reason: string
  /** The CONTENT_QUESTIONS.md reference this page is blocked on. */
  question?: string
  children?: React.ReactNode
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <BuildNote variant="banner" question={question}>
        {reason}
      </BuildNote>

      {children}

      <Section>
        <h2 className="text-[22px]">In the meantime</h2>
        <p className="mt-4 text-ink-700">
          Call us on{' '}
          <a href={site.phone.href} className="text-brand-800">
            {site.phone.display}
          </a>
          , email{' '}
          <a href={`mailto:${site.email.marketing}`} className="text-brand-800">
            {site.email.marketing}
          </a>
          , or send an enquiry and it will reach the right team.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Send an enquiry</ButtonLink>
          <ButtonLink href="/equipment" variant="secondary">
            Browse equipment
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}

export function PendingList({
  heading,
  items,
}: {
  heading: string
  items: { label: string; href: string }[]
}) {
  return (
    <Section tone="white">
      <h2 className="text-[22px]">{heading}</h2>
      <ul className="mt-5 card-grid gap-3 list-none m-0 p-0">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              className="flex items-center min-h-11 px-4 bg-white border border-rule rounded-md text-[14.5px] text-ink-900 no-underline transition-colors duration-150 hover:border-brand-600 hover:text-brand-600"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
