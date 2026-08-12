import type { Metadata } from 'next'
import { site } from '@/content/site'
import './globals.css'

/**
 * The font variables are defined without `next/font/google` so production
 * builds do not depend on fetching Google font CSS and woff2 files. The CSS
 * stacks below them still use the same custom-property contract.
 */
const fontVariables = '[--font-dm-sans:ui-sans-serif] [--font-jetbrains:ui-monospace]'

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
