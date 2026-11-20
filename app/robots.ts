import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // private tools; student cabinet and sign-in pages carry noindex instead, so crawlers can see it
      disallow: ['/panel', '/braino', '/api/'],
    },
    sitemap: 'https://www.drasiiavinograd.com/sitemap.xml',
    host: 'https://www.drasiiavinograd.com',
  }
}
