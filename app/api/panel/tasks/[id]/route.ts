import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await ctx.params
  const b = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof b.title === 'string' && b.title.trim()) patch.title = b.title.trim().slice(0, 300)
  if ('notes' in b) patch.notes = b.notes ? String(b.notes).slice(0, 3000) : null
  if (b.assignee === 'asya' || b.assignee === 'rustem') patch.assignee = b.assignee
  if (typeof b.done === 'boolean') {
    patch.done = b.done
    patch.done_at = b.done ? new Date().toISOString() : null
  }
  const { data, error } = await panelDb().from('panel_tasks').update(patch).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await ctx.params
  const { error } = await panelDb().from('panel_tasks').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
