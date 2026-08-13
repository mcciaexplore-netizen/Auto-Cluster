/**
 * Shared content types.
 *
 * These mirror the Payload collections in src/payload/collections/ so that the
 * static content modules in src/content/ can be swapped for CMS queries later
 * without touching a single component.
 */

/**
 * A link target that is guaranteed to resolve.
 *
 * The current site has `href="#"` on seven navigation items. This type makes
 * that a compile error rather than a QA finding — see docs/audit §7.
 */
export type Href =
  | `/${string}`
  | `tel:${string}`
  | `mailto:${string}`
  | `https://${string}`

export interface NavItem {
  label: string
  href: Href
  description?: string
  children?: NavItem[]
}

/**
 * Provenance flag on a specification value.
 *
 * The source material contains real technical errors (`1100 M` of crosshead
 * travel, `6000C` for 600 °C). We correct them and show the trail rather than
 * amending silently — see DESIGN_DIRECTION.md §4.
 */
export type SpecFlag =
  | { kind: 'corrected'; published: string; note?: string }
  | { kind: 'verify'; published?: string; note: string }
  | { kind: 'missing'; note: string }

export interface Spec {
  label: string
  /** Omitted when flag.kind is 'missing'. */
  value?: string
  unit?: string
  flag?: SpecFlag
}

export type EquipmentCategory =
  | 'prototype'
  | 'rapid-prototyping'
  | 'environmental'
  | 'rubber-polymer'
  | 'metrology'

export interface Equipment {
  slug: string
  name: string
  category: EquipmentCategory
  /** Cross-listed categories. The Xenon chamber serves both env. and RPL. */
  alsoIn?: EquipmentCategory[]
  make?: string
  model?: string
  machineType?: string
  summary: string
  specs: Spec[]
  applications: string[]
  /** ASTM / ISO numbers. Powers the standards index and equipment filtering. */
  standards: string[]
  image?: ImageRef
  /** Within NABL ISO/IEC 17025:2017 scope. */
  isAccredited: boolean
  /** Indicative rate, transcribed from Core-Operation-Rates-1.jpg. */
  rate?: RateLine
}

export interface ImageRef {
  src: string
  /** Never a filename, never null, never empty on a meaningful image. */
  alt: string
  width?: number
  height?: number
  /** Set when the asset is missing, low-res or a stale 2020 watermark. */
  needsPhotography?: boolean
}

export interface RateLine {
  department: 'environmental' | 'rubber-polymer' | 'rapid-prototyping' | 'prototype'
  process: string
  uom: string
  min: number
  max: number
}

export interface TeamMember {
  name: string
  /** Nobody on the current site has one. CONTENT_QUESTIONS.md CQ-11. */
  role?: string
  facilities: string[]
}

export interface Facility {
  slug: string
  name: string
  navLabel: string
  h1: string
  h2: string
  summary: string
  intro: string[]
  category?: EquipmentCategory
  isAccredited: boolean
  industries: string[]
  tests?: TestMethod[]
  projects?: string[]
  team?: string[]
  /** Set when the page still needs a verbatim capture from the live site. */
  pendingCapture?: boolean
}

export interface TestMethod {
  name: string
  body: string[]
  standards?: string[]
}

export interface Venue {
  slug: string
  name: string
  navLabel: string
  h1: string
  h2: string
  summary: string
  intro: string[]
  specs: Spec[]
  highlights: { label: string; value?: string }[]
  bookable: boolean
  expoTypes?: string[]
}

export type EnquiryDepartment =
  | 'testing'
  | 'prototyping'
  | 'venue'
  | 'training'
  | 'careers'
  | 'tenders'
  | 'general'
