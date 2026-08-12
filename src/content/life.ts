/**
 * Life at Auto Cluster categories.
 *
 * The menu label on the current site reads "Employment Engagement" while the
 * slug and the page itself read "Employee Engagement". We use Employee.
 */
export const lifeCategories = [
  { slug: 'achievements', title: 'Our Achievements' },
  { slug: 'training', title: 'Training' },
  { slug: 'employee-engagement', title: 'Employee Engagement' },
  { slug: 'internal-training', title: 'Internal Training' },
  { slug: 'annual-days-outings', title: 'Annual Days and Outings' },
] as const

export function getLifeCategory(slug: string) {
  return lifeCategories.find((c) => c.slug === slug)
}

/**
 * Legal pages. Two privacy policies exist on the current site and the footer
 * links to the second — which text is authoritative is CQ-65.
 */
export const legalPages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    summary: 'How we collect, use and protect the information you give us.',
    reason:
      'Two privacy policies exist on the current site — /privacy-policy/ and /privacy-policy-2/ — and the footer links to the second. Which text is authoritative has been requested from ACDRI.',
    question: 'CQ-65',
  },
  {
    slug: 'terms',
    title: 'Terms of Use',
    summary: 'The terms under which this website and our services are provided.',
    reason: 'No terms of use page exists on the current site. Copy needs to be supplied or drafted.',
    question: 'CQ-65',
  },
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    summary:
      'Our commitment to WCAG 2.1 AA and GIGW 3.0, and how to report an accessibility problem.',
    reason:
      'A GIGW requirement for a government-promoted body, and absent from the current site. This statement will be published once the full WCAG audit completes in the final build phase.',
  },
] as const

export function getLegalPage(slug: string) {
  return legalPages.find((p) => p.slug === slug)
}
