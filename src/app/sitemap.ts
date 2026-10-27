import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { equipment } from '@/content/equipment'
import { facilities } from '@/content/facilities'
import { venues } from '@/content/venues'
import { legalPages, lifeCategories } from '@/content/life'
import { listEvents } from '@/server/platform'
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, '')
  const now = new Date()

  const staticRoutes = [
    '/',
    '/about',
    '/facilities',
    '/equipment',
    '/venues',
    '/venues/book',
    '/rate-card',
    '/startups',
    '/media',
    '/events',
    '/knowledge-centre',
    '/life-at-auto-cluster',
    '/tenders',
    '/careers',
    '/contact',
  ]

  return [
    ...(await listEvents()).filter((e) => e.published).map((e) => ({ url: `${base}/events/${e.slug}`, lastModified: new Date(e.updatedAt), changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
    })),
    ...facilities.map((f) => ({
      url: `${base}/facilities/${f.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    // 30 machine records that have never had a URL. The highest-value pages
    // on the site for search.
    ...equipment.map((e) => ({
      url: `${base}/equipment/${e.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...venues.map((v) => ({
      url: `${base}/venues/${v.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...lifeCategories.map((c) => ({
      url: `${base}/life-at-auto-cluster/${c.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
    ...legalPages.map((p) => ({
      url: `${base}/legal/${p.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
