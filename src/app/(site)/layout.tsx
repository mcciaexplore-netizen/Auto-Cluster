import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactBar } from '@/components/layout/ContactBar'
import { site } from '@/content/site'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const { address } = site

  /** Organization + LocalBusiness, sitewide. */
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#organization`,
    name: site.name,
    alternateName: site.abbr,
    url: site.url,
    telephone: site.phone.display,
    email: site.email.marketing,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.lines.join(', '),
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressRegion: address.region,
      addressCountry: 'IN',
    },
    hasCredential: [site.accreditation.nabl, site.accreditation.iso],
  }

  return (
    <>
      {/* The current site has a skip link. It is one of the few accessibility
          features already correct — keep it. */}
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <Header />

      <main id="content">{children}</main>

      <Footer />

      {/* Last thing on the page, below the footer. */}
      <ContactBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  )
}
