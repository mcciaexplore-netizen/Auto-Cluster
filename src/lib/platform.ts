import { z } from 'zod'
import { localDateTime } from './validation'

export const amountSchema = z.string().trim().regex(/^\d{1,8}(\.\d{1,2})?$/, 'Enter an amount in rupees, with up to two decimals.')
  .transform((v) => Math.round(Number(v) * 100)).refine((v) => v > 0, 'Amount must be greater than zero.')

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
  description: z.string().trim().min(20).max(4000),
  startsAt: localDateTime, endsAt: localDateTime,
  location: z.string().trim().min(3).max(200),
  capacity: z.coerce.number().int().min(1).max(100000),
  category: z.enum(['exhibition', 'training', 'industry-event']),
  published: z.boolean(),
  registrationOpen: z.boolean(),
}).refine((v) => v.endsAt > v.startsAt, { path: ['endsAt'], message: 'End time must follow start time.' })

export const mediaCategories = ['videos', 'flyers', 'service-posters', 'publications', 'photo-galleries'] as const
export const mediaLabels: Record<(typeof mediaCategories)[number], string> = {
  videos: 'Videos', flyers: 'Flyers', 'service-posters': 'Service posters', publications: 'Publications', 'photo-galleries': 'Photo galleries',
}
export const publicAssetUrl = z.string().trim().max(2000).refine((value) => {
  if (/^\/images\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..')) return true
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password } catch { return false }
}, 'Use an HTTPS link or a local /images/ asset path.')
export const mediaSchema = z.object({
  title: z.string().trim().min(3).max(180), description: z.string().trim().min(10).max(600),
  category: z.enum(mediaCategories), url: publicAssetUrl, published: z.boolean(),
})

export function formatEventDate(value: string) {
  return new Date(`${value}:00+05:30`).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST'
}
