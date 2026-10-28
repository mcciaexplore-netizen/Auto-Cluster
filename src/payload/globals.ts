import type { GlobalConfig } from 'payload'

/**
 * Sitewide globals.
 *
 * The navigation global enforces the rule the current site breaks seven times:
 * every menu item must have a resolvable target. `href="#"` is rejected by
 * validation, not caught in QA.
 */

const hrefField = {
  name: 'href',
  type: 'text' as const,
  required: true,
  admin: {
    description: 'A path (/equipment), tel:, mailto:, or an absolute https:// URL.',
  },
  validate: (value: string | null | undefined) => {
    if (!value) return 'Every navigation item needs a destination.'
    const v = value.trim()
    if (v === '#' || v === '' || v.startsWith('#')) {
      return 'A bare "#" is not a destination. Link to a real page, or remove the item.'
    }
    if (/localhost|ivl-staging|\/staging\//i.test(v)) {
      return 'That points at a local or staging host. Use the production URL.'
    }
    if (!/^(\/|tel:|mailto:|https:\/\/)/.test(v)) {
      return 'Use a path starting with /, or a tel:, mailto: or https:// URL.'
    }
    return true
  },
}

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        hrefField,
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            hrefField,
            { name: 'description', type: 'text' },
          ],
        },
      ],
    },
  ],
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    { name: 'organisationName', type: 'text', required: true },
    { name: 'tagline', type: 'text' },
    {
      name: 'phone',
      type: 'group',
      fields: [
        { name: 'display', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'Must be a tel: link. Plain text numbers are not tappable.' },
          validate: (value: string | null | undefined) =>
            value?.startsWith('tel:') || 'Phone numbers must be tel: links.',
        },
      ],
    },
    {
      name: 'emails',
      type: 'array',
      admin: {
        description:
          'One row per department, so a visitor can tell which address to use — the old site showed three with no explanation.',
      },
      fields: [
        { name: 'purpose', type: 'text', required: true },
        { name: 'address', type: 'email', required: true },
        { name: 'owner', type: 'text' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'lines', type: 'text', hasMany: true },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text' },
            { name: 'postalCode', type: 'text' },
            { name: 'region', type: 'text' },
          ],
        },
        {
          name: 'placeId',
          type: 'text',
          admin: {
            description:
              'Google Place ID. Pins the map precisely — the old embed used an address query at zoom 10.',
          },
        },
      ],
    },
    {
      name: 'accreditation',
      type: 'group',
      fields: [
        { name: 'nabl', type: 'text' },
        { name: 'nablCertificateNo', type: 'text' },
        { name: 'nablValidUntil', type: 'date' },
        { name: 'iso', type: 'text' },
      ],
    },
    {
      name: 'statistics',
      type: 'array',
      admin: {
        description:
          'Only publish figures with a source. A statistic with no verified value is not rendered — the old site shipped five counters that all read "1 +".',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'note', type: 'text' },
        { name: 'source', type: 'text', required: true },
      ],
    },
    {
      name: 'legal',
      type: 'group',
      fields: [
        { name: 'gstNumber', type: 'text' },
        { name: 'registrationNumber', type: 'text' },
        { name: 'openingHours', type: 'text' },
      ],
    },
  ],
}

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 3,
      admin: { description: 'Three curated columns. Never an automatic page dump.' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'label', type: 'text', required: true }, hrefField],
        },
      ],
    },
    {
      name: 'promoters',
      type: 'array',
      fields: [
        { name: 'caption', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}

export const globals: GlobalConfig[] = [SiteSettings, Navigation, FooterGlobal]
