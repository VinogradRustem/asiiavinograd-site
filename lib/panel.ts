import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const PANEL_COOKIE = 'pulse_usmle'

export function panelToken(): string | null {
  const key = process.env.PANEL_KEY
  if (!key) return null
  return createHash('sha256').update(`pulse:${key}`).digest('hex')
}

export async function isPanelAuthed(): Promise<boolean> {
  const token = panelToken()
  if (!token) return false
  const store = await cookies()
  return store.get(PANEL_COOKIE)?.value === token
}

export function panelDb() {
  return createClient(process.env.PANEL_SUPABASE_URL!, process.env.PANEL_SUPABASE_KEY!, {
    auth: { persistSession: false },
  })
}

export const STATUSES = ['idea', 'plan', 'work', 'ready', 'scheduled', 'published', 'archived'] as const
export const FORMATS = ['lecture', 'shorts', 'post', 'reels', 'carousel', 'story', 'threads', 'article', 'other'] as const
