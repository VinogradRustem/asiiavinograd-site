import type { Metadata, Viewport } from 'next'
import { brainoUser } from '@/lib/braino'
import Braino from './Braino'
import './braino.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Braino',
  description: 'Карточки, квизы и задачи для подготовки к USMLE',
  robots: { index: false, follow: false },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#4338ca' }

export default async function BrainoPage() {
  const user = await brainoUser()
  if (!user)
    return (
      <div className="bx bx-gate">
        <div className="bx-gate-card">
          <div className="bx-logo">Braino</div>
          <p>Закрытая тестовая версия. Войдите через <a href="/panel">панель</a> или откройте личную ссылку-приглашение.</p>
        </div>
      </div>
    )
  return <Braino />
}
