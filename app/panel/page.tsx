import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isPanelAuthed } from '@/lib/panel'
import Panel from './Panel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Пульс USMLE',
  robots: { index: false, follow: false },
}

export default async function PanelPage() {
  if (!(await isPanelAuthed())) notFound()
  return <Panel />
}
