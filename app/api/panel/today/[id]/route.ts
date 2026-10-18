import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

const STATUS = ['todo', 'done', 'skip']

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (STATUS.includes(b.status)) patch.status = b.status
  if (typeof b.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.day)) patch.day = b.day
  const { data, error } = await panelDb().from('day_plan').update(patch).eq('id', Number(id)).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await params
  const { error } = await panelDb().from('day_plan').delete().eq('id', Number(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
