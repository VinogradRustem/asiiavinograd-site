import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb, panelUser } from '@/lib/panel'

export const dynamic = 'force-dynamic'

const WHO = ['asya', 'rustem']

export async function GET() {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { data, error } = await panelDb().from('panel_tasks').select('*').order('created_at', { ascending: true }).limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tasks: data })
}

export async function POST(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const b = await req.json().catch(() => ({}))
  const title = String(b.title || '').trim().slice(0, 300)
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const row = {
    title,
    notes: b.notes ? String(b.notes).slice(0, 3000) : null,
    assignee: WHO.includes(b.assignee) ? b.assignee : 'asya',
    created_by: await panelUser(),
  }
  const { data, error } = await panelDb().from('panel_tasks').insert(row).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ task: data })
}
