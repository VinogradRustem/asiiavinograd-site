import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

/** Comments inbox: comments from all socials + which platforms are connected. Filled by comments.py on the server. */
export async function GET(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const box = req.nextUrl.searchParams.get('box') || 'open'
  const db = panelDb()
  let q = db.from('comments').select('*').order('created_at', { ascending: false }).limit(200)
  if (box === 'open') q = q.in('status', ['new', 'sending', 'error'])
  else if (box === 'replied') q = q.eq('status', 'replied')
  else if (box === 'hidden') q = q.in('status', ['hidden', 'spam'])
  else q = q.eq('id', -1) // count only
  const [list, sync, open] = await Promise.all([
    q,
    db.from('comment_sync').select('*'),
    db.from('comments').select('platform', { count: 'exact' }).in('status', ['new', 'error']).limit(1000),
  ])
  if (list.error) return NextResponse.json({ error: list.error.message }, { status: 500 })
  const counts: Record<string, number> = {}
  for (const r of (open.data || []) as { platform: string }[]) counts[r.platform] = (counts[r.platform] || 0) + 1
  return NextResponse.json({ items: list.data || [], sync: sync.data || [], counts, open: open.count ?? 0 })
}
