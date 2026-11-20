import type { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '', {
    ru: ['Доктор Асия Виноград — подготовка к USMLE на русском', 'Врач-кардиолог MD, PhD готовит русскоязычных врачей к USMLE Step 1: лекции, Anki-карточки, разборы задач и медицинский английский.'],
    en: ['Dr. Asiia Vinograd | USMLE Educator for IMGs', 'Practicing cardiologist and USMLE educator helping international medical graduates achieve their dreams of practicing medicine in the United States.'],
  })
}

export default function Page() {
  return <HomePage />
}
