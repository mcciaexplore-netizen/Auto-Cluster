import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, '')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The vendor area is authenticated and has nothing to index.
        disallow: ['/api/', '/tenders/portal'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
