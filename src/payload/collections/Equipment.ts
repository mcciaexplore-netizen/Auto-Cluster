import type { CollectionConfig } from 'payload'

/**
 * `equipment` — replaces the 30 modals and the 6 orphaned "machines" pages.
 *
 * Every machine gets a real indexable URL. This is the single biggest SEO gain
 * available on the project: roughly 30 pages of genuine technical content
 * currently locked inside invisible modal markup.
 *
 * Schema follows docs/audit/00-ARCHITECTURE.md §3, extended with the
 * provenance fields the correction trail needs (DESIGN_DIRECTION.md §4).
 */
export const Equipment: CollectionConfig = {
  slug: 'equipment',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'make', 'isAccredited'],
    group: 'Catalogue',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL segment. Changing this breaks existing links.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Prototype production', value: 'prototype' },
        { label: 'Rapid prototyping', value: 'rapid-prototyping' },
        { label: 'Environmental testing', value: 'environmental' },
        { label: 'Rubber & polymer', value: 'rubber-polymer' },
        { label: 'Metrology & CMM', value: 'metrology' },
      ],
    },
    {
      name: 'alsoIn',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Prototype production', value: 'prototype' },
        { label: 'Rapid prototyping', value: 'rapid-prototyping' },
        { label: 'Environmental testing', value: 'environmental' },
        { label: 'Rubber & polymer', value: 'rubber-polymer' },
        { label: 'Metrology & CMM', value: 'metrology' },
      ],
      admin: {
        description:
          'Cross-listed categories. The Xenon chamber serves both environmental and RPL.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'make', type: 'text' },
        { name: 'model', type: 'text' },
        { name: 'machineType', type: 'text' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },

    {
      name: 'specs',
      type: 'array',
      labels: { singular: 'Specification', plural: 'Specifications' },
      admin: {
        description:
          'Repeatable, because spec shapes vary widely between a VMC and an FTIR.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text' },
        { name: 'unit', type: 'text' },
        {
          name: 'flag',
          type: 'select',
          options: [
            { label: 'Corrected — error in source, fixed', value: 'corrected' },
            { label: 'Verify — awaiting ACDRI confirmation', value: 'verify' },
            { label: 'Not supplied — data does not exist yet', value: 'missing' },
          ],
          admin: {
            description:
              'Drives the public correction trail. Leave empty for values carried over unchanged.',
          },
        },
        {
          name: 'published',
          type: 'text',
          admin: {
            condition: (_, sibling) => sibling?.flag === 'corrected' || sibling?.flag === 'verify',
            description: 'The value as it appears on the old site, cited beneath the correction.',
          },
        },
        {
          name: 'note',
          type: 'textarea',
          admin: { condition: (_, sibling) => Boolean(sibling?.flag) },
        },
      ],
    },

    { name: 'applications', type: 'array', fields: [{ name: 'value', type: 'text', required: true }] },
    {
      name: 'standards',
      type: 'array',
      fields: [{ name: 'value', type: 'text', required: true }],
      admin: { description: 'ASTM / ISO numbers. Powers filtering, the standards index and SEO.' },
    },

    {
      name: 'maxJobSize',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'x', type: 'number' },
            { name: 'y', type: 'number' },
            { name: 'z', type: 'number' },
            { name: 'unit', type: 'text', defaultValue: 'mm' },
          ],
        },
      ],
    },

    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'suitableFor', type: 'richText' },

    {
      type: 'row',
      fields: [
        {
          name: 'isAccredited',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Within NABL ISO/IEC 17025:2017 scope.' },
        },
        { name: 'enquiryEnabled', type: 'checkbox', defaultValue: true },
      ],
    },

    {
      name: 'rate',
      type: 'group',
      admin: { description: 'Indicative rate from the core operation rate card.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'uom', type: 'text' },
            { name: 'min', type: 'number' },
            { name: 'max', type: 'number' },
          ],
        },
      ],
    },
  ],
}
