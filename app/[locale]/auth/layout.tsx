import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '/auth', {
    ru: ['Вход в кабинет', 'Вход и регистрация.'],
    en: ['Sign in', 'Sign in and registration.'],
  }, { noindex: true })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
