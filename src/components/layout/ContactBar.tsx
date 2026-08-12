import { site } from '@/content/site'
import { Container } from '@/components/ui/Section'

/**
 * Phone, email and the NABL reference, as a full-width strip closing the
 * page beneath the footer.
 *
 * This used to sit above the masthead. Moved to the foot on request, which
 * also takes 37px of furniture off the top of every page and out of the
 * sticky header — see --header-h in globals.css, which the full-height hero
 * subtracts.
 *
 * White rather than the footer's tinted ground, so it reads as a final rule
 * under the footer instead of dissolving into it.
 *
 * Not a <footer>: the page already has one directly above, and a second
 * contentinfo landmark would leave a screen reader with two identically
 * named regions. This is a plain div whose links are the point.
 */
export function ContactBar() {
  return (
    <div className="bg-white border-t border-rule">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3 font-mono text-[11.5px] tracking-[0.05em] text-ink-500">
        <a href={site.phone.href} className="hover:text-brand-800 hover:underline">
          {site.phone.display}
        </a>
        {/* Shown at every width now. It was hidden below sm only because it
            crowded the logo and nav in the old header bar; at the foot of
            the page the row is free to wrap. */}
        <a
          href={`mailto:${site.email.marketing}`}
          className="hover:text-brand-800 hover:underline"
        >
          {site.email.marketing}
        </a>
        <span className="ml-auto text-brand-400">{site.accreditation.nabl}</span>
      </Container>
    </div>
  )
}
