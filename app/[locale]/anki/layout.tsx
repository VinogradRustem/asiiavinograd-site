import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '/anki', {
    ru: ['Anki-карточки для USMLE Step 1 на русском и английском', 'Колоды Anki по разделам USMLE Step 1 для врачей: двуязычные карточки RU/EN по First Aid от кардиолога MD, PhD доктора Асии Виноград.'],
    en: ['USMLE Step 1 Anki Decks in English and Russian', 'Anki decks for every USMLE Step 1 discipline, built for international medical graduates by cardiologist Dr. Asiia Vinograd, MD, PhD.'],
  })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
