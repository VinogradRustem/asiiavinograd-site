import { NextRequest, NextResponse } from 'next/server'
import { FORMATS, STATUSES, isPanelAuthed, panelDb } from '@/lib/panel'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await ctx.params
  const b = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof b.title === 'string' && b.title.trim()) patch.title = b.title.trim().slice(0, 300)
  if ('lang' in b) patch.lang = b.lang === 'en' || b.lang === 'ru' ? b.lang : null
  if ('format' in b) patch.format = (FORMATS as readonly string[]).includes(b.format) ? b.format : null
  if ('status' in b && (STATUSES as readonly string[]).includes(b.status)) {
    patch.status = b.status
    if (b.status === 'published') patch.published_at = b.published_at || new Date().toISOString()
  }
  if ('planned_for' in b) patch.planned_for = b.planned_for || null
  if ('notes' in b) patch.notes = b.notes ? String(b.notes).slice(0, 5000) : null
  const { data, error } = await panelDb().from('content_items').update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await ctx.params
  const db = panelDb()
  // Bot items are archived (the bot deletes archived rows itself), manual ones removed.
  const { error } = await db.from('content_items').update({ status: 'archived' }).eq('id', id).neq('source', 'manual')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await db.from('content_items').delete().eq('id', id).eq('source', 'manual')
  return NextResponse.json({ ok: true })
}
