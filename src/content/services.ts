import type { EnquiryDepartment } from '@/lib/types'

/**
 * The service catalogue that sits beside the enquiry form.
 *
 * Picking a service does two things: it sets the fields the form shows
 * (`kind`), and it sets which team the enquiry is routed to (`department`) —
 * a finer grain than the department alone. "Prototype production" and
 * "Rapid prototyping" both route to the same `prototyping` inbox today, but
 * are recorded as the specific service the enquirer actually picked, so
 * staff can filter and report below the department level once there's
 * enough volume for that to matter.
 *
 * `venue` and `training` are not filled in here — selecting either hands the
 * visitor off to that module's own flow rather than showing inline fields
 * (see EnquiryForm). Venue's hand-off is a real page, `/venues/book`.
 * Training's isn't built yet, so it hands off to a contact card instead of a
 * form that would pretend to be one.
 */

export type ServiceKind = 'manufacturing' | 'testing' | 'venue' | 'training' | 'careers' | 'general'

export interface Service {
  id: string
  label: string
  kind: ServiceKind
  department: EnquiryDepartment
  description: string
}

export const services: Service[] = [
  {
    id: 'prototype-production',
    label: 'Prototype production',
    kind: 'manufacturing',
    department: 'prototyping',
    description: 'VMC machining, EDM and manual finishing for one-off and short-run parts.',
  },
  {
    id: 'rapid-prototyping',
    label: 'Rapid prototyping',
    kind: 'manufacturing',
    department: 'prototyping',
    description: '3D printing and additive processes for form, fit and function prototypes.',
  },
  {
    id: 'environmental-testing',
    label: 'Environmental testing',
    kind: 'testing',
    department: 'testing',
    description: 'Temperature, humidity, vibration and ingress testing to automotive standards.',
  },
  {
    id: 'rubber-polymer-testing',
    label: 'Rubber & polymer testing',
    kind: 'testing',
    department: 'testing',
    description: 'Mechanical and material testing of rubber, polymer and elastomer components.',
  },
  {
    id: 'metrology-cmm',
    label: 'Metrology & CMM',
    kind: 'testing',
    department: 'testing',
    description: 'Dimensional inspection and coordinate measurement against drawing tolerances.',
  },
  {
    id: 'venue-hire',
    label: 'Venue hire',
    kind: 'venue',
    department: 'venue',
    description: 'Exhibition Centre, Auditorium or Training & Seminar Hall — dates and availability.',
  },
  {
    id: 'training',
    label: 'Training programs',
    kind: 'training',
    department: 'training',
    description: 'Skill development and CAD/CAM training courses.',
  },
  {
    id: 'careers',
    label: 'Careers',
    kind: 'careers',
    department: 'careers',
    description: 'Apply for a role, or send a general career enquiry.',
  },
  {
    id: 'tenders',
    label: 'Tenders and procurement',
    kind: 'general',
    department: 'tenders',
    description: 'Questions about an open tender or the procurement process.',
  },
  {
    id: 'general',
    label: 'General enquiry',
    kind: 'general',
    department: 'general',
    description: 'Anything that doesn’t fit the categories above.',
  },
]

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

/** Equipment/facility `category` id -> the matching service, for pages that link into the enquiry form from a specific machine or facility. */
const CATEGORY_TO_SERVICE: Record<string, string> = {
  prototype: 'prototype-production',
  'rapid-prototyping': 'rapid-prototyping',
  environmental: 'environmental-testing',
  'rubber-polymer': 'rubber-polymer-testing',
  metrology: 'metrology-cmm',
}

export function serviceIdForCategory(category: string | undefined): string | undefined {
  return category ? CATEGORY_TO_SERVICE[category] : undefined
}

/** First service in a given department — for legacy `?department=` links that predate per-service routing. */
export function serviceIdForDepartment(department: string): string | undefined {
  return services.find((s) => s.department === department)?.id
}
