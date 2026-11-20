import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '/dashboard', {
    ru: ['Личный кабинет', 'Личный кабинет ученика.'],
    en: ['Student dashboard', 'Student dashboard.'],
  }, { noindex: true })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
