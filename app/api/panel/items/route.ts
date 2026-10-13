import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { FORMATS, STATUSES, isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { data, error } = await panelDb()
    .from('content_items')
    .select('*')
    .neq('status', 'archived')
    .order('updated_at', { ascending: false })
    .limit(1000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const b = await req.json().catch(() => ({}))
  const title = String(b.title || '').trim().slice(0, 300)
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const row = {
    id: 'm_' + randomUUID().slice(0, 8),
    title,
    lang: b.lang === 'en' ? 'en' : b.lang === 'ru' ? 'ru' : null,
    format: (FORMATS as readonly string[]).includes(b.format) ? b.format : null,
    status: (STATUSES as readonly string[]).includes(b.status) ? b.status : 'idea',
    planned_for: b.planned_for || null,
    notes: b.notes ? String(b.notes).slice(0, 5000) : null,
    source: 'manual',
  }
  const { data, error } = await panelDb().from('content_items').insert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}
