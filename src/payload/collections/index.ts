import type { CollectionConfig } from 'payload'

export { Equipment } from './Equipment'

/**
 * The remaining collections from docs/audit/00-ARCHITECTURE.md §3.
 *
 * Grouped in one file because most are small; Equipment earns its own module
 * because it is the largest content asset on the site.
 */

// ---------------------------------------------------------------------------
// Media — every image ships real, specific alt text. Never a filename, never
// null, never empty on a meaningful image. Enforced at the schema level.
// ---------------------------------------------------------------------------
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
    ],
    formatOptions: { format: 'webp' },
  },
  access: { read: () => true },
  admin: { group: 'Media' },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what the image shows. Not the filename. Leave a single space only if the image is purely decorative.',
      },
      validate: (value: string | null | undefined) => {
        if (!value) return 'Alt text is required.'
        if (/\.(jpe?g|png|gif|webp|avif)$/i.test(value)) {
          return 'That looks like a filename. Describe what the image shows.'
        }
        if (/^(null|undefined|image|photo|img)$/i.test(value.trim())) {
          return 'Describe what the image shows.'
        }
        return true
      },
    },
    { name: 'credit', type: 'text' },
    {
      name: 'needsPhotography',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Flags a stale, low-resolution or placeholder asset for replacement.' },
    },
  ],
}

// ---------------------------------------------------------------------------
// Venues
// ---------------------------------------------------------------------------
export const Venues: CollectionConfig = {
  slug: 'venues',
  admin: { useAsTitle: 'name', group: 'Catalogue' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'tagline', type: 'text' },
    { name: 'intro', type: 'richText' },
    {
      name: 'highlights',
      type: 'array',
      admin: { description: 'Currently images on the old site. These are text.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text' },
      ],
    },
    {
      name: 'capacityConfigs',
      type: 'array',
      fields: [
        { name: 'layout', type: 'text', required: true },
        { name: 'capacity', type: 'number', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'areaSqm', type: 'number' },
        { name: 'stageDimensions', type: 'text' },
      ],
    },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'floorPlan', type: 'upload', relationTo: 'media' },
    {
      name: 'expoTypes',
      type: 'relationship',
      relationTo: 'expo-types',
      hasMany: true,
      admin: { description: 'All 12 categories. The old booking form offered 4.' },
    },
    { name: 'rateCard', type: 'upload', relationTo: 'media' },
    { name: 'guidelinesDoc', type: 'upload', relationTo: 'media' },
    { name: 'bookable', type: 'checkbox', defaultValue: true },
  ],
}

export const ExpoTypes: CollectionConfig = {
  slug: 'expo-types',
  admin: { useAsTitle: 'name', group: 'Catalogue' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'icon', type: 'upload', relationTo: 'media' },
  ],
}

// ---------------------------------------------------------------------------
// Tenders — public list. Login only to submit.
// ---------------------------------------------------------------------------
export const Tenders: CollectionConfig = {
  slug: 'tenders',
  admin: { useAsTitle: 'title', defaultColumns: ['refNo', 'title', 'closingDate', 'status'], group: 'Procurement' },
  // Notices are always publicly viewable. For a body promoted by the Ministry
  // of Commerce and Industry, a login wall on tender notices inverts the
  // normal expectation.
  access: { read: () => true },
  fields: [
    { name: 'refNo', type: 'text', required: true, unique: true, index: true },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Works', value: 'works' },
        { label: 'Goods', value: 'goods' },
        { label: 'Services', value: 'services' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'publishedDate', type: 'date', required: true },
        { name: 'closingDate', type: 'date', required: true },
        { name: 'emdAmount', type: 'number' },
      ],
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Public. No account required to download.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closing soon', value: 'closing-soon' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'contactPerson',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Enquiries & bookings — everything is stored, not just emailed. This gives
// ACDRI an enquiry history they have never had.
// ---------------------------------------------------------------------------
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'department', 'status', 'createdAt'],
    group: 'Enquiries',
  },
  access: { read: () => false, create: () => true },
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'enquiry',
      options: [
        { label: 'Enquiry', value: 'enquiry' },
        { label: 'Quote request', value: 'quote' },
        { label: 'Booking request', value: 'booking' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'department',
      type: 'select',
      required: true,
      options: [
        { label: 'Testing', value: 'testing' },
        { label: 'Prototyping', value: 'prototyping' },
        { label: 'Venue hire', value: 'venue' },
        { label: 'Careers', value: 'careers' },
        { label: 'Tenders', value: 'tenders' },
        { label: 'General', value: 'general' },
      ],
    },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'machine', type: 'relationship', relationTo: 'equipment' },
    { name: 'venue', type: 'relationship', relationTo: 'venues' },
    {
      type: 'row',
      fields: [
        { name: 'source', type: 'text', admin: { description: 'Page the enquiry came from.' } },
        { name: 'gclid', type: 'text' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Answered', value: 'answered' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: { useAsTitle: 'name', group: 'Enquiries' },
  access: { read: () => false, create: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'venue', type: 'relationship', relationTo: 'venues', required: true },
    { name: 'expoType', type: 'relationship', relationTo: 'expo-types' },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date', required: true },
      ],
    },
    {
      name: 'numberOfStalls',
      type: 'number',
      admin: {
        description:
          'Two days before and two days after the booked dates are auto-reserved for setup and teardown.',
      },
    },
    { name: 'guidelinesAccepted', type: 'checkbox', required: true },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Declined', value: 'declined' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// Supporting collections
// ---------------------------------------------------------------------------
export const Team: CollectionConfig = {
  slug: 'team',
  admin: { useAsTitle: 'name', group: 'Institute' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      admin: {
        description:
          'Required before launch. Nobody on the old site carries a job title — see CONTENT_QUESTIONS.md CQ-11.',
      },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'group',
      type: 'select',
      options: [
        { label: 'Board of directors', value: 'board' },
        { label: 'Facility team', value: 'facility' },
        { label: 'Leadership', value: 'leadership' },
      ],
    },
    { name: 'facilities', type: 'text', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'author', group: 'Institute' },
  access: { read: () => true },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'designation', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'service',
      type: 'select',
      options: [
        { label: 'Testing', value: 'testing' },
        { label: 'Prototyping', value: 'prototyping' },
        { label: 'Venue', value: 'venue' },
      ],
    },
  ],
}

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'startDate', 'venue'], group: 'Catalogue' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'organiser', type: 'text' },
    { name: 'description', type: 'richText' },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date' },
      ],
    },
    { name: 'venue', type: 'relationship', relationTo: 'venues' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
  ],
}

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: { useAsTitle: 'title', group: 'Institute' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'department', type: 'text' },
    { name: 'location', type: 'text', defaultValue: 'Chinchwad, Pune' },
    {
      name: 'employmentType',
      type: 'select',
      options: [
        { label: 'Full time', value: 'FULL_TIME' },
        { label: 'Part time', value: 'PART_TIME' },
        { label: 'Contract', value: 'CONTRACTOR' },
        { label: 'Internship', value: 'INTERN' },
      ],
    },
    { name: 'description', type: 'richText' },
    { name: 'closingDate', type: 'date' },
    { name: 'isOpen', type: 'checkbox', defaultValue: true },
  ],
}

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  admin: { useAsTitle: 'title', group: 'Media' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'kind',
      type: 'select',
      options: [
        { label: 'NABL scope', value: 'nabl-scope' },
        { label: 'Rate card', value: 'rate-card' },
        { label: 'Venue guidelines', value: 'guidelines' },
        { label: 'Certificate', value: 'certificate' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'h1', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'body', type: 'richText' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}

export const collections: CollectionConfig[] = [
  Pages,
  Media,
  Downloads,
  Venues,
  ExpoTypes,
  Events,
  Tenders,
  Enquiries,
  Bookings,
  Team,
  Testimonials,
  Jobs,
]
