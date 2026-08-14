import Image from 'next/image'
import Link from 'next/link'
import { footerNav, legalNav, promoters, site } from '@/content/site'
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
    <footer className="bg-paper-2 border-t border-rule text-ink-700">
      <Container className="py-16">
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
                href={`mailto:${site.email.info}`}
                className="text-ink-700 no-underline hover:text-brand-800 hover:underline"
              >
                {site.email.info}
              </a>
            </div>
          </div>
        </div>

        {/* Promoters */}
        <div className="mt-14 pt-8 border-t border-rule">
          <h2 className="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-ink-400 mb-6">
            Promoted and supported by
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 list-none m-0 p-0">
            {promoters.map((p) => (
              <li key={p.caption} className="flex items-center gap-3">
                {/* Always below the fold — lazy by default, and never a
                    render-blocking request the way the hot-linked originals
                    were. Dimensions are declared, so no layout shift. */}
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className="h-10 w-auto shrink-0 object-contain"
                />
                <span className="text-[13px] font-semibold leading-snug text-ink-900">{p.caption}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal row */}
        <div className="mt-12 pt-6 border-t border-rule flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11.5px] text-ink-400 m-0 max-w-none">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-[11.5px] text-ink-400 no-underline hover:text-brand-800 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
