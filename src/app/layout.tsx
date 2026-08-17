import type { Metadata } from 'next'
import { DM_Sans, Poppins } from 'next/font/google'
import { site } from '@/content/site'
import './globals.css'

/**
 * DM Sans carries every heading and body paragraph; Poppins is scoped to
 * the small kicker/sub-heading line under each page's `<h1>` only (see
 * `font-poppins` in globals.css). Both are fetched once at build time and
 * self-hosted from this origin via `next/font` — no runtime request to
 * Google's servers, unlike a plain `<link>` to Google Fonts CSS.
 *
 * JetBrains Mono stays on the system monospace stack below; it was never
 * part of this request and changing it is out of scope here.
 */
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

const fontVariables = `${dmSans.variable} ${poppins.variable} [--font-jetbrains:ui-monospace]`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      'Auto Cluster Development and Research Institute — NABL Testing, Prototyping & Exhibition Facilities in Pune',
    template: `%s | ${site.shortName}`,
  },
  description:
    'NABL ISO/IEC 17025:2017 accredited testing, VMC machining, 3D printing and exhibition facilities for MSMEs in Chinchwad, Pune. Government-promoted, MCCIA-initiated.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: site.name,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning is scoped to this one element and is required,
    // not a papering-over: the inline script below adds `js` to this
    // className before React hydrates, so the server HTML and the client DOM
    // are *meant* to differ here. Without it React logs a mismatch on every
    // page load. It suppresses the warning for this element's attributes
    // only — children are still diffed normally.
    <html
      lang="en-IN"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint, which is what
            gates the scroll-reveal hidden state in globals.css. Without it
            the rule never matches and every section renders visible — the
            content must not depend on the animation running. Inline and
            synchronous by necessity: deferring it would flash the content. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
