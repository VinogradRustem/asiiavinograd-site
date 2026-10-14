import type { Metadata } from 'next'
import { PANEL_NAMES, panelUser } from '@/lib/panel'
import Panel from './Panel'
import Login from './Login'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Пульс USMLE',
  robots: { index: false, follow: false },
}

export default async function PanelPage() {
  const user = await panelUser()
  if (!user) return <Login />
  return <Panel userName={PANEL_NAMES[user] || user} />
}
