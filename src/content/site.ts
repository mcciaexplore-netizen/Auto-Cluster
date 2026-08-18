import type { Href, NavItem } from '@/lib/types'

/**
 * Sitewide settings, navigation and footer.
 * Becomes the Payload `siteSettings` / `navigation` / `footer` globals.
 */

export const site = {
  name: 'Auto Cluster Development and Research Institute',
  shortName: 'Auto Cluster',
  abbr: 'ACDRI',
  tagline: 'Testing, prototyping and exhibition facilities for Indian manufacturing.',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autoclusterpune.org',

  /** Header phone is `href="#"` today. It is a tel: link everywhere now. */
  phone: {
    display: '+91 20 6633 3700',
    href: 'tel:+912066333700' as Href,
  },

  /**
   * Three addresses appear across the current site with no stated purpose.
   * Department routing lives in src/lib/email.ts. CONTENT_QUESTIONS.md CQ-07.
   */
  email: {
    marketing: 'marketing@autoclusterpune.org',
    marketing2: 'marketing2@autoclusterpune.org',
    info: 'info@autoclusterpune.org',
  },

  address: {
    organisation: 'Auto Cluster Development and Research Institute',
    lines: ['H-Block, Plot No. C-181', 'Chinchwad East', 'Mumbai Pune Road'],
    city: 'Pune',
    postalCode: '411 019',
    region: 'Maharashtra',
    country: 'India',
  },

  accreditation: {
    nabl: 'NABL ISO/IEC 17025:2017',
    iso: 'ISO 9001:2015',
  },

  /** The MD's message. Loads as a facade; the embed only on click. */
  video: {
    youtubeId: 'LI4k2qjh-Xw',
    title: "Auto Cluster | MD's Message",
    poster: 'https://i.ytimg.com/vi/LI4k2qjh-Xw/maxresdefault.jpg',
  },

  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
} as const

/**
 * Main navigation.
 *
 * Every href resolves. The `Href` type makes `#` a compile error — seven items
 * are dead links on the current site (Facilities, Services, Design Centre,
 * Infrastructure Support, Knowledge Centre, Timeline, Careers), three of which
 * point at pages that already exist and are simply unlinked.
 */
export const mainNav: NavItem[] = [
  {
    label: 'Facilities',
    href: '/facilities',
    children: [
      {
        label: 'Prototype Production Facility',
        href: '/facilities/prototype-production-facility',
        description: 'VMC machining, fixturing, tooling and laser cutting',
      },
      {
        label: 'Rapid Prototyping',
        href: '/facilities/rapid-prototyping',
        description: 'SLA, SLS, FDM and vacuum casting',
      },
      {
        label: 'Environmental Testing',
        href: '/facilities/environmental-testing',
        description: 'Thermal shock, salt spray, humidity, water and dust ingress',
      },
      {
        label: 'Rubber & Polymer Testing',
        href: '/facilities/rubber-polymer-testing',
        description: 'FTIR, TGA, DSC, UTM, ozone and weathering',
      },
      {
        label: 'Large Bed CMM & Metrology',
        href: '/facilities/large-bed-cmm-services',
        description: 'Co-ordinate measuring for dies and large parts',
      },
      { label: 'Design Centre', href: '/facilities/design-centre' },
      { label: 'Skill Development', href: '/facilities/skill-development' },
      { label: 'Incubation Centre', href: '/facilities/incubation-centre' },
      {
        label: 'NABL Scope',
        href: '/facilities/nabl-scope',
        description: 'Our accredited scope of testing',
      },
    ],
  },
  {
    label: 'Equipment',
    href: '/equipment',
    description: '30 machines with full specifications',
  },
  {
    label: 'Venues',
    href: '/venues',
    children: [
      {
        label: 'Exhibition Centre',
        href: '/venues/exhibition-centre',
        description: '3,000 sq m across two halls, plus open display area',
      },
      {
        label: 'Auditorium',
        href: '/venues/auditorium',
        description: '172 seats, air conditioned, VIP room',
      },
      {
        label: 'Training & Seminar Hall',
        href: '/venues/training-seminar-hall',
        description: '30-workstation CAD/CAM training centre',
      },
      { label: 'Book a venue', href: '/venues/book' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Overview', href: '/about#overview' },
      { label: 'Certifications', href: '/about#certifications' },
      { label: 'Vision & Mission', href: '/about#vision-mission' },
      { label: "MD's Message", href: '/about#md-message' },
      { label: 'Our Team', href: '/about#team' },
      { label: 'Board of Directors', href: '/about#board' },
      { label: 'Timeline', href: '/about#timeline' },
    ],
  },
  {
    label: 'Life at Auto Cluster',
    href: '/life-at-auto-cluster',
    children: [
      { label: 'Our Achievements', href: '/life-at-auto-cluster/achievements' },
      { label: 'Training', href: '/life-at-auto-cluster/training' },
      // Menu label says "Employment Engagement"; slug and page say "Employee".
      { label: 'Employee Engagement', href: '/life-at-auto-cluster/employee-engagement' },
      { label: 'Internal Training', href: '/life-at-auto-cluster/internal-training' },
      { label: 'Annual Days & Outings', href: '/life-at-auto-cluster/annual-days-outings' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Knowledge Centre', href: '/knowledge-centre' },
  { label: 'Tenders', href: '/tenders' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

/**
 * Footer: three curated columns.
 * Replaces the unstyled ~28-link WordPress "Pages" widget dump, which exposed
 * both privacy policies and all six orphaned equipment pages.
 */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Facilities',
    items: [
      { label: 'Prototype Production', href: '/facilities/prototype-production-facility' },
      { label: 'Rapid Prototyping', href: '/facilities/rapid-prototyping' },
      { label: 'Environmental Testing', href: '/facilities/environmental-testing' },
      { label: 'Rubber & Polymer Testing', href: '/facilities/rubber-polymer-testing' },
      { label: 'Large Bed CMM & Metrology', href: '/facilities/large-bed-cmm-services' },
      { label: 'Equipment catalogue', href: '/equipment' },
      { label: 'NABL scope', href: '/facilities/nabl-scope' },
    ],
  },
  {
    heading: 'Venues',
    items: [
      { label: 'Exhibition Centre', href: '/venues/exhibition-centre' },
      { label: 'Auditorium', href: '/venues/auditorium' },
      { label: 'Training & Seminar Hall', href: '/venues/training-seminar-hall' },
      { label: 'Book a venue', href: '/venues/book' },
      { label: 'Rate card', href: '/venues/rate-card' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    heading: 'Institute',
    items: [
      { label: 'About ACDRI', href: '/about' },
      { label: 'Life at Auto Cluster', href: '/life-at-auto-cluster' },
      { label: 'Knowledge Centre', href: '/knowledge-centre' },
      { label: 'Tenders', href: '/tenders' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export const legalNav: NavItem[] = [
  { label: 'Privacy policy', href: '/legal/privacy-policy' },
  { label: 'Terms of use', href: '/legal/terms' },
  { label: 'Accessibility', href: '/legal/accessibility' },
]

/**
 * "Promoted and Supported by". Alt text is written from the caption, not from
 * the filename — the source assets are named `Govt-og-india.png` (sic),
 * `logo-mh.png`, `mccia`.
 *
 * Self-hosted from /public/logos. These were previously hot-linked from the
 * live WordPress install, which cost four cross-origin round-trips to a slow
 * host on every page render — the footer is global. Originals were also 2–4x
 * their display size; they are stored at 2x and served as AVIF/WebP.
 */
export const promoters = [
  {
    caption: 'Ministry of Commerce and Industry, Govt. of India',
    alt: 'Emblem of the Ministry of Commerce and Industry, Government of India',
    src: '/logos/govt-india.png',
    width: 112,
    height: 112,
  },
  {
    caption: 'Government of Maharashtra',
    alt: 'Emblem of the Government of Maharashtra',
    src: '/logos/maharashtra.png',
    width: 156,
    height: 112,
  },
  {
    caption: 'Pimpri-Chinchwad Municipal Corporation',
    alt: 'Logo of the Pimpri-Chinchwad Municipal Corporation',
    src: '/logos/pcmc.png',
    width: 156,
    height: 112,
  },
  {
    caption: 'Mahratta Chamber of Commerce, Industries and Agriculture',
    alt: 'Logo of the Mahratta Chamber of Commerce, Industries and Agriculture',
    src: '/logos/mccia.png',
    width: 156,
    height: 112,
  },
]

/** The masthead logo. Self-hosted for the same reason as the promoters. */
export const logo = {
  src: '/logos/logo-new-w.png',
  width: 224,
  height: 118,
}

/**
 * Statistics with a verifiable source, and only those.
 *
 * The current homepage animates five counters that all render `1 +` — the real
 * figures exist only as JS animation targets. Those five stay off the page
 * until ACDRI supplies numbers (CONTENT_QUESTIONS.md CQ-57).
 */
export const credentials = [
  {
    key: 'Accreditation',
    value: '17025',
    note: 'NABL ISO/IEC 17025:2017',
    source: 'Rubber & Polymer Testing Lab page',
    // Animated on request. Worth knowing: this is the ISO/IEC standard
    // number, not a quantity, so it climbs 0 -> 17025 alongside three tiles
    // that are genuine counts. Set to false to hold it static.
    countUp: true,
  },
  {
    key: 'RPL customers',
    value: '900+',
    note: '100+ added each year',
    source: 'Rubber & Polymer Testing Lab page',
    countUp: true,
  },
  {
    key: 'Environmental testing',
    value: '200+',
    note: 'MSME, OEM and MNC customers',
    source: 'Environmental Testing page',
    countUp: true,
  },
  {
    key: 'Exhibitions hosted',
    value: '100+',
    note: 'over ten years',
    source: 'Exhibition Centre page',
    countUp: true,
  },
]
