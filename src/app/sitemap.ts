import type { MetadataRoute } from 'next'
import { site } from '@/content/site'
import { equipment } from '@/content/equipment'
import { facilities } from '@/content/facilities'
import { venues } from '@/content/venues'
import { legalPages, lifeCategories } from '@/content/life'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '')
  const now = new Date()

  const staticRoutes = [
    '/',
    '/about',
    '/facilities',
    '/equipment',
    '/venues',
    '/venues/book',
    '/venues/rate-card',
    '/events',
    '/knowledge-centre',
    '/life-at-auto-cluster',
    '/tenders',
    '/careers',
    '/contact',
  ]

  return [
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
