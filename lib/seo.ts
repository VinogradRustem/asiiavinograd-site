import type { Metadata } from 'next'

// One place for canonical + hreflang on pages that are client components (they get metadata from a small layout.tsx).
// path is the English path without locale, e.g. '/anki' ('' for the home page).
export function pageMeta(locale: string, path: string, t: { ru: [string, string]; en: [string, string] }, opts: { noindex?: boolean } = {}): Metadata {
  const ru = locale === 'ru'
  const [title, description] = ru ? t.ru : t.en
  const en = path || '/'
  const rus = `/ru${path}`
  return {
    title,
    description,
    alternates: { canonical: ru ? rus : en, languages: { en, ru: rus, 'x-default': en } },
    openGraph: { title, description, url: ru ? rus : en },
    ...(opts.noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
