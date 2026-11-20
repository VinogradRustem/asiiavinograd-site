import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return pageMeta(locale, '/microbiology', {
    ru: ['Микробиология для USMLE Step 1: лекции для врачей', 'Микробиология к USMLE Step 1 на русском: бактерии, вирусы, грибы, антибиотики. Лекции и high-yield разборы для врачей от доктора Асии Виноград.'],
    en: ['Microbiology for USMLE Step 1: Lectures for IMGs', 'USMLE Step 1 microbiology: bacteria, viruses, fungi and antimicrobials. Lectures and high-yield reviews for IMGs by Dr. Asiia Vinograd.'],
  })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
