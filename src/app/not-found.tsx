import Link from 'next/link'
import { site } from '@/content/site'

/**
 * Designed 404. The current site has none, and `/exhibition-center/` — linked
 * from its own homepage — lands on the WordPress default.
 */
export default function NotFound() {
  const suggestions = [
    { href: '/facilities', label: 'Facilities', note: 'Testing, machining, prototyping' },
    { href: '/equipment', label: 'Equipment', note: '30 machines with full specifications' },
    { href: '/venues', label: 'Venues', note: 'Exhibition halls, auditorium, training rooms' },
    { href: '/contact', label: 'Contact', note: 'Send an enquiry or call us' },
  ]

  return (
    <main className="min-h-[70vh] flex items-center bg-paper-2">
      <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-20">
        <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-brand-400 mb-5 max-w-none">
          Error 404
        </p>
        <h1 className="max-w-[16ch]">We could not find that page.</h1>
        <p className="mt-5 text-[17px] text-ink-700 max-w-[52ch]">
          The link may be out of date, or the page may have moved during our site rebuild.
          Here is where most people are heading.
        </p>

        <ul className="mt-10 card-grid gap-4 list-none m-0 p-0">
          {suggestions.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block h-full bg-white border border-rule rounded-md p-5 no-underline transition-colors duration-150 hover:border-rule-strong hover:bg-brand-50"
              >
                <span className="block font-display font-semibold text-[17px] text-brand-800">
                  {s.label}
                </span>
                <span className="block mt-1 text-[13.5px] leading-snug text-ink-500">
                  {s.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[14.5px] text-ink-700">
          Still stuck? Call{' '}
          <a href={site.phone.href} className="text-brand-800 font-semibold underline underline-offset-4">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    </main>
  )
}
