/**
 * Legacy URL -> new URL map. Single source of truth.
 *
 * Sourced from docs/audit/01-CONTENT-INVENTORY.md and
 * docs/audit/00-ARCHITECTURE.md §4. Every URL that exists on
 * autoclusterpune.org today must resolve.
 *
 * Consumed twice:
 *   - src/middleware.ts   issues a single 301, before Next's trailing-slash
 *                         normalisation, so `/about-us/` reaches `/about` in
 *                         ONE hop rather than two. WordPress emitted trailing
 *                         slashes everywhere, so every inbound legacy backlink
 *                         carries one.
 *   - next.config.mjs     defence in depth, if middleware is ever bypassed.
 */

/** Exact-match map, written without trailing slashes. */
export const legacyMap = {
  // --- Main pages ---------------------------------------------------------
  '/about-us': '/about',
  '/contact-us': '/contact',
  '/life-at-autocluster': '/life-at-auto-cluster',

  // --- Facilities ---------------------------------------------------------
  '/prototype-production-facility': '/facilities/prototype-production-facility',
  '/rapid-prototyping': '/facilities/rapid-prototyping',
  '/environmental-testing': '/facilities/environmental-testing',
  '/environment-lab-env': '/facilities/environmental-testing', // dedupe
  '/rubber-polymer-mechanical-testing': '/facilities/rubber-polymer-testing',
  '/rubber-polymer-rpl': '/facilities/rubber-polymer-testing', // dedupe
  '/large-bed-cmm-services': '/facilities/large-bed-cmm-services',
  '/design-centre': '/facilities/design-centre', // orphaned in nav today
  '/skill-development': '/facilities/skill-development',
  '/incubation-centre': '/facilities/incubation-centre',

  // --- Venues -------------------------------------------------------------
  '/exhibition-centre-in-pune': '/venues/exhibition-centre',
  '/exhibition-center': '/venues/exhibition-centre', // 404 today, linked from home
  '/auditorium-hall-in-pune': '/venues/auditorium',
  '/auditorium-hall': '/venues/auditorium',
  '/training-seminar-hall-in-pune': '/venues/training-seminar-hall',
  '/training-seminar-hall': '/venues/training-seminar-hall',

  // --- Equipment ----------------------------------------------------------
  // Six pages orphaned from navigation; 30 machine records trapped in a modal
  // library. These become one filterable catalogue.
  '/our-machines': '/equipment',
  '/prototype-production-facility-machines': '/equipment?category=prototype',
  '/rapid-prototyping-machines': '/equipment?category=rapid-prototyping',
  '/environment-testing-machines': '/equipment?category=environmental',
  '/rpl-testing-machines': '/equipment?category=rubber-polymer',
  '/metrology-cmm-machines': '/equipment?category=metrology',

  // --- Life at Auto Cluster ----------------------------------------------
  // The menu label reads "Employment Engagement"; the slug and the page read
  // "Employee Engagement". We use Employee.
  '/announcement/our-achievements': '/life-at-auto-cluster/achievements',
  '/announcement/training': '/life-at-auto-cluster/training',
  '/announcement/employee-engagement': '/life-at-auto-cluster/employee-engagement',
  '/announcement/internal-training': '/life-at-auto-cluster/internal-training',
  '/announcement/annual-days-and-outings': '/life-at-auto-cluster/annual-days-outings',

  // --- Legal --------------------------------------------------------------
  // Two privacy policies exist; the footer links to the second. Which text is
  // authoritative is CONTENT_QUESTIONS.md CQ-65.
  '/privacy-policy': '/legal/privacy-policy',
  '/privacy-policy-2': '/legal/privacy-policy',
}

/**
 * Prefix rules, applied after the exact map misses.
 * Catches any announcement slug not enumerated above.
 */
export const legacyPrefixes = [
  { from: '/announcement/', to: '/life-at-auto-cluster/' },
]

/**
 * Resolve a legacy pathname to its destination, or null.
 * Accepts the path with or without a trailing slash.
 */
export function resolveLegacy(pathname) {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (legacyMap[clean]) return legacyMap[clean]

  for (const { from, to } of legacyPrefixes) {
    if (clean.startsWith(from)) {
      const slug = clean.slice(from.length)
      if (slug) return to + slug
    }
  }
  return null
}

/** Shape next.config.mjs expects. 301, not 308, per the rebuild brief. */
const configRedirects = [
  ...Object.entries(legacyMap).map(([source, destination]) => ({
    source,
    destination,
    statusCode: 301,
  })),
  ...legacyPrefixes.map(({ from, to }) => ({
    source: `${from}:slug`,
    destination: `${to}:slug`,
    statusCode: 301,
  })),
]

export default configRedirects
