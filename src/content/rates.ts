import type { RateLine } from '@/lib/types'

/**
 * Core operation rates.
 *
 * Transcribed from `Core-Operation-Rates-1.jpg` — the only pricing published
 * anywhere on the current site, and trapped inside a JPEG where it is
 * unreadable by search engines and screen readers, unselectable, and
 * unusable on mobile. Full transcription and provenance notes are in
 * docs/extracted/rate-card.md.
 *
 * Effective 1 Nov 2025. Currency of the figures is CONTENT_QUESTIONS.md CQ-58.
 */

export const rateCardEffectiveFrom = '2025-11-01'

export const rates: RateLine[] = [
  // Environmental testing
  { department: 'environmental', process: 'Thermal shock chamber', uom: 'Per hour', min: 190, max: 220 },
  { department: 'environmental', process: 'Water spray chamber', uom: 'Per hour', min: 400, max: 500 },
  { department: 'environmental', process: 'Dust spray chamber', uom: 'Per hour', min: 450, max: 550 },
  { department: 'environmental', process: 'High-low chamber', uom: 'Per hour', min: 275, max: 320 },
  { department: 'environmental', process: 'Mini salt spray chamber', uom: 'Per hour', min: 40, max: 50 },

  // Rubber and polymer testing
  { department: 'rubber-polymer', process: 'UTM', uom: 'Per sample', min: 1800, max: 2100 },
  { department: 'rubber-polymer', process: 'Ozone chamber', uom: 'Per hour', min: 200, max: 250 },
  { department: 'rubber-polymer', process: 'Hot air oven', uom: 'Per hour', min: 60, max: 80 },
  { department: 'rubber-polymer', process: 'FTIR', uom: 'Per sample', min: 2500, max: 3000 },
  { department: 'rubber-polymer', process: 'Xenon test chamber', uom: 'Per hour / per 3 samples', min: 80, max: 120 },
  { department: 'rubber-polymer', process: 'Melt flow index', uom: 'Per sample', min: 1500, max: 1800 },
  { department: 'rubber-polymer', process: 'QUV Weather-Ometer', uom: 'Per hour / per 3 samples', min: 80, max: 100 },
  { department: 'rubber-polymer', process: 'DSC', uom: 'Per sample', min: 2700, max: 3200 },

  // Rapid prototyping
  { department: 'rapid-prototyping', process: 'SLA — imported resin', uom: 'Per cc', min: 40, max: 80 },
  { department: 'rapid-prototyping', process: 'SLA — local resin', uom: 'Per cc', min: 25, max: 40 },
  { department: 'rapid-prototyping', process: 'Figure 4 Standalone Pro, black', uom: 'Per cc', min: 70, max: 100 },
  { department: 'rapid-prototyping', process: 'SLS', uom: 'Per cc', min: 30, max: 40 },
  { department: 'rapid-prototyping', process: 'Origin 1 SLA', uom: 'Per cc', min: 55, max: 75 },

  // Prototype production facility
  { department: 'prototype', process: '5-axis machining', uom: 'Per hour', min: 1800, max: 2000 },
  { department: 'prototype', process: '3+1 axis machining', uom: 'Per hour', min: 300, max: 400 },
]

/** Conditions, verbatim from the rate card with "Tire" corrected to "Tier". */
export const rateConditions = [
  'Minimum rates are for MSMEs.',
  'Maximum rates are for OEM, Tier 1 and Tier 2 customers.',
  'These are standard charges for a standard test; any extra operation is charged extra.',
  'MSME MCCIA members receive an additional 10% discount.',
  'Rates may change as per market conditions.',
]

export const rateDepartmentLabels: Record<RateLine['department'], string> = {
  environmental: 'Environmental testing',
  'rubber-polymer': 'Rubber and polymer testing',
  'rapid-prototyping': 'Rapid prototyping',
  prototype: 'Prototype production facility',
}

export function ratesByDepartment(department: RateLine['department']): RateLine[] {
  return rates.filter((r) => r.department === department)
}

/** Indian numbering, e.g. 1800 -> "1,800". */
export function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}
