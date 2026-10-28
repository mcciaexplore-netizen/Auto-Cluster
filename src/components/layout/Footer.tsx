import Image from 'next/image'
import Link from 'next/link'
import { footerNav, promoters, site } from '@/content/site'
import { Container } from '@/components/ui/Section'

/**
 * Three curated columns, a contact block, promoter logos and a legal row.
 *
 * Replaces the unstyled ~28-link WordPress "Pages" widget dump that sits below
 * the copyright on the current site, exposing both privacy policies and all
 * six orphaned equipment pages.
 */
export function Footer() {
  const { address } = site

  return (
    <footer className="bg-white border-t border-rule text-ink-700">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {footerNav.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-brand-400 mb-4">
                {col.heading}
              </h2>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[14.5px] text-ink-700 no-underline hover:text-brand-800 hover:underline underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-brand-400 mb-4">
              Contact
            </h2>
            <address className="not-italic text-[14.5px] leading-relaxed text-ink-700">
              {address.organisation}
              <br />
              {address.lines.join(', ')}
              <br />
              {address.city} – {address.postalCode}
              <br />
              {address.region}, {address.country}
            </address>

            <div className="mt-4 flex flex-col gap-2 text-[14.5px]">
              <a href={site.phone.href} className="text-brand-800 font-semibold no-underline hover:underline">
                {site.phone.display}
              </a>
              <a
                href={`mailto:${site.email.marketing}`}
                className="text-ink-700 no-underline hover:text-brand-800 hover:underline"
              >
                {site.email.marketing}
              </a>
              <a
                href={`mailto:${site.email.customerSupport}`}
                className="text-ink-700 no-underline hover:text-brand-800 hover:underline"
              >
                {site.email.customerSupport}
              </a>
            </div>
          </div>
        </div>

        {/* Promoters */}
        <div className="mt-10 pt-8 border-t border-rule">
          {/* Label above, logos full-width below */}
          <h2 className="font-mono text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brand-600 mb-6">
            Promoted &amp; supported by
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 list-none m-0 p-0">
            {promoters.map((p) => (
              <li key={p.caption} className="flex flex-col items-center gap-3 text-center">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className="h-14 w-auto max-w-[110px] object-contain transition-transform duration-300 hover:scale-105"
                />
                <span className="text-[11px] font-medium leading-snug text-ink-500">{p.caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
