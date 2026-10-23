import { MetadataRoute } from 'next'
import { panelDb } from '@/lib/panel'
import { allLectures, lectureSlug } from '@/lib/lectures'

export const revalidate = 3600

const B = 'https://drasiiavinograd.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const base: MetadataRoute.Sitemap = [
    { url: B, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${B}/ru`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${B}/microbiology`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${B}/microbiology/gram-positive-bacteria`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${B}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${B}/ru/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${B}/consultation`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${B}/ru/consultation`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${B}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${B}/ru/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ]
  // section pages (app/[locale]/[section]) and resources
  for (const s of ['pharmacology', 'cardiology', 'pathology', 'gi-hepatology', 'immunology', 'nephrology-pulmonology', 'neurology-psychiatry',
                   'gastroenterology', 'cases', 'labs', 'medical-english', 'anki']) {
    base.push({ url: `${B}/${s}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 })
    base.push({ url: `${B}/ru/${s}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 })
  }
  for (const l of allLectures()) {
    base.push({ url: `${B}/ru/lectures/${lectureSlug(l)}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
    base.push({ url: `${B}/lectures/${lectureSlug(l)}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
  }
  try {
    const db = panelDb()
    const { data: secs } = await db.from('forum_sections').select('id')
    for (const s of secs || []) {
      base.push({ url: `${B}/forum/${s.id}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 })
      base.push({ url: `${B}/ru/forum/${s.id}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 })
    }
    const { data: tops } = await db.from('forum_topics').select('section,lang,slug,last_at').eq('status', 'published').limit(5000)
    for (const t of tops || []) {
      base.push({ url: `${B}${t.lang === 'ru' ? '/ru' : ''}/forum/${t.section}/${t.slug}`, lastModified: new Date(t.last_at), changeFrequency: 'weekly', priority: 0.5 })
    }
    const { data: posts } = await db.from('blog_posts').select('lang,slug,updated_at').eq('status', 'published').limit(5000)
    for (const p of posts || []) {
      base.push({ url: `${B}${p.lang === 'ru' ? '/ru' : ''}/blog/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.7 })
    }
  } catch {}
  return base
}
