import type { Venue } from '@/lib/types'

/**
 * All twelve expo categories.
 *
 * The current booking form offers four of these. Plasto, Renewable Energy,
 * Rubber Die & Mould, Consumer, Dental, Education, Property and Jewellery are
 * advertised on the Exhibition Centre page but cannot be selected when
 * booking — the single most costly conversion defect on the site.
 */
export const expoTypes = [
  'Engineering Expo',
  'Auto Ancillary Expo',
  'Automotive Engineering Expo',
  'Water Expo',
  'Plasto Expo',
  'Renewable Energy Expo',
  'Rubber, Die and Mould Expo',
  'Consumer Expo',
  'Dental Expo',
  'Education Expo',
  'Property Expo',
  'Jewellery Expo',
] as const

export type ExpoType = (typeof expoTypes)[number]

export const venues: Venue[] = [
  {
    slug: 'exhibition-centre',
    name: 'Exhibition Centre',
    navLabel: 'Exhibition Centre',
    h1: 'Exhibition Centre in Pune',
    h2: 'Exhibition halls for engineering, consumer and trade shows',
    bookable: true,
    summary:
      'Two permanent air-conditioned halls totalling 3,000 sq m, plus a 1,000 sq m open display area.',
    intro: [
      'The Auto Cluster Exhibition Centre was conceived and designed on international lines. The permanent exhibition centre, with its two halls and open display area, supports the display of engineering capabilities and gives visitors exposure to the latest technology trends.',
      'Over the last ten years more than 100 exhibitions have been held here by organisers including the Machine Tools Association, the Auto Components Manufacturers Association, rubber industry associations, media exhibition organisers and dental trade organisers.',
    ],
    // Specifications as structured text. On the current site every one of
    // these is baked into an image with no alt text.
    specs: [
      { label: 'Hall A', value: '2,000 sq m', unit: 'approx.' },
      { label: 'Hall B', value: '1,000 sq m', unit: 'approx.' },
      { label: 'Open display area', value: '1,000 sq m', unit: 'approx.' },
      { label: 'Total', value: '4,000 sq m' },
      {
        label: 'Rate',
        flag: {
          kind: 'missing',
          note: 'No venue hire rate is published anywhere on the current site (CQ-58).',
        },
      },
    ],
    highlights: [
      { label: 'Hall A', value: '2,000 sq m' },
      { label: 'Hall B', value: '1,000 sq m' },
      { label: 'Open display area', value: '1,000 sq m' },
      { label: 'Dedicated visitor parking' },
      { label: 'Both halls air conditioned' },
      { label: 'Cafeteria on site' },
    ],
    expoTypes: [...expoTypes],
  },

  {
    slug: 'auditorium',
    name: 'Auditorium',
    navLabel: 'Auditorium',
    h1: 'Auditorium for industrial events',
    h2: 'Seated, air-conditioned auditorium with stage and VIP room',
    bookable: true,
    summary:
      'A 172-seat air-conditioned auditorium with a 10.67 m stage, attached VIP room and power backup.',
    intro: [
      "Auto Cluster's auditorium has a built-in audio system and seats 172. Institutions, event managers, organisations, corporate companies and industry bodies all use this facility.",
    ],
    specs: [
      {
        label: 'Seating capacity',
        value: '172',
        flag: {
          kind: 'verify',
          published: '170 in the page body and on the homepage; 172 in the highlights block',
          note: 'Two of three occurrences say 170. Using the specification block figure pending confirmation (CQ-01).',
        },
      },
      {
        label: 'Stage',
        value: '10.67 m × 5.06 m',
        unit: '35 ft × 16.6 ft',
        flag: {
          kind: 'corrected',
          published: '35.00 ft * 16.60 ft',
          note: 'The only imperial measurement on an otherwise metric site; metric given first.',
        },
      },
      { label: 'Air conditioning', value: 'Throughout' },
      { label: 'VIP room', value: 'Attached, with toilet' },
      { label: 'Power backup', value: 'Yes' },
      { label: 'Audio system', value: 'Built in' },
      {
        label: 'Seating configurations',
        flag: {
          kind: 'missing',
          note: 'Theatre / classroom / conference variants requested from ACDRI (CQ-01).',
        },
      },
      {
        label: 'AV equipment',
        flag: {
          kind: 'missing',
          note: 'Projector, lighting and microphone inventory requested from ACDRI.',
        },
      },
    ],
    highlights: [
      { label: 'Seating capacity', value: '172' },
      { label: 'Stage', value: '10.67 m × 5.06 m' },
      { label: 'Air conditioned' },
      { label: 'Attached VIP room and toilet' },
      { label: 'Power backup' },
    ],
  },

  {
    slug: 'training-seminar-hall',
    name: 'Training and Seminar Hall',
    navLabel: 'Training & Seminar Hall',
    h1: 'Training and Seminar Halls in Pune',
    h2: 'Seminar rooms and a 30-workstation CAD/CAM training centre',
    bookable: true,
    summary:
      'Training and seminar halls for industry events, alongside a CAD/CAM training centre with 30 workstations.',
    intro: [
      'Auto Cluster has training and seminar halls for events of various sizes. Alongside them is a CAD/CAM training centre with 30 workstations.',
    ],
    specs: [
      { label: 'CAD/CAM workstations', value: '30' },
      {
        label: 'Hall capacity',
        flag: {
          kind: 'missing',
          note: 'Page not yet captured verbatim from the live site (CQ-67).',
        },
      },
      {
        label: 'Floor area',
        flag: { kind: 'missing', note: 'Page not yet captured verbatim (CQ-67).' },
      },
    ],
    highlights: [
      { label: 'CAD/CAM workstations', value: '30' },
      { label: 'Air conditioned' },
    ],
  },
]

export function getVenue(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug)
}
