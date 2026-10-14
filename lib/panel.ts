import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const PANEL_COOKIE = 'pulse_usmle'

export const PANEL_NAMES: Record<string, string> = { asya: 'Ася', rustem: 'Рустем' }

/** Legacy shared-key token (the old /api/panel/enter?k=… link keeps working for Rustem). */
export function panelToken(): string | null {
  const key = process.env.PANEL_KEY
  if (!key) return null
  return createHash('sha256').update(`pulse:${key}`).digest('hex')
}

const sha = (s: string) => createHash('sha256').update(s).digest('hex')

function sign(user: string): string {
  return createHmac('sha256', process.env.PANEL_KEY || 'no-key').update(`user:${user}`).digest('hex')
}

/** PANEL_USERS = "asya:<sha256 of password>,rustem:<sha256 of password>" */
function users(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const part of (process.env.PANEL_USERS || '').split(',')) {
    const [u, h] = part.split(':').map(s => s?.trim())
    if (u && h) out[u.toLowerCase()] = h.toLowerCase()
  }
  return out
}

export function checkLogin(user: string, password: string): boolean {
  const h = users()[user.toLowerCase()]
  if (!h || !password) return false
  const a = Buffer.from(h), b = Buffer.from(sha(password))
  return a.length === b.length && timingSafeEqual(a, b)
}

export function sessionValue(user: string) {
  return `${user.toLowerCase()}.${sign(user.toLowerCase())}`
}

export async function panelUser(): Promise<string | null> {
  const store = await cookies()
  const v = store.get(PANEL_COOKIE)?.value
  if (!v) return null
  const legacy = panelToken()
  if (legacy && v === legacy) return 'rustem'
  const [u, s] = v.split('.')
  if (u && s && users()[u] && s === sign(u)) return u
  return null
}

export async function isPanelAuthed(): Promise<boolean> {
  return (await panelUser()) !== null
}

export function panelDb() {
  return createClient(process.env.PANEL_SUPABASE_URL!, process.env.PANEL_SUPABASE_KEY!, {
    auth: { persistSession: false },
  })
}

export const STATUSES = ['idea', 'plan', 'work', 'ready', 'scheduled', 'published', 'archived'] as const
export const FORMATS = ['lecture', 'shorts', 'post', 'reels', 'carousel', 'story', 'threads', 'article', 'other'] as const
