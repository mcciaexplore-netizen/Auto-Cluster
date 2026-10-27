import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Plain-JS module, shared with next.config.mjs so the map has one home.
import { resolveLegacy } from '../redirects.mjs'

/**
 * Legacy URL redirects, in a single hop.
 *
 * Next's `redirects()` runs *after* trailing-slash normalisation, so
 * `/about-us/` would 308 to `/about-us` and only then 301 to `/about` — two
 * hops on every inbound legacy link, and WordPress emitted trailing slashes
 * everywhere. Handling it here collapses that to one 301.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // 1. Legacy URL — one 301 straight to the destination, slash or no slash.
  const destination = resolveLegacy(pathname) as string | null
  if (destination) {
    const url = new URL(destination, request.url)

    // Preserve any query string the visitor arrived with, unless the
    // destination sets its own (the /equipment?category=… rules do).
    if (search && !destination.includes('?')) {
      url.search = search
    }

    return NextResponse.redirect(url, 301)
  }

  // 2. Not legacy, but has a trailing slash. `skipTrailingSlashRedirect`
  //    turned off Next's own normalisation, so do it here.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    // A plain URL, not nextUrl.clone() — NextURL re-applies its own trailing
    // slash handling on the pathname setter and the redirect loops.
    const url = new URL(request.url)
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Skip static assets, image optimisation and API routes.
  matcher: ['/((?!_next/static|_next/image|api/|favicon.ico|.*\\.[\\w]+$).*)'],
}
