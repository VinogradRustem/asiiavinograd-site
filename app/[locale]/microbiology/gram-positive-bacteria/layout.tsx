import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '/microbiology/gram-positive-bacteria', {
    ru: ['Грамположительные бактерии — USMLE Step 1, лекция', 'Грамположительные бактерии для USMLE Step 1: стафилококки, стрептококки, клостридии, листерия. Лекция для врачей на русском.'],
    en: ['Gram-Positive Bacteria — USMLE Step 1 Lecture', 'Gram-positive bacteria for USMLE Step 1: staphylococci, streptococci, clostridia, Listeria. High-yield lecture for IMGs.'],
  })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
