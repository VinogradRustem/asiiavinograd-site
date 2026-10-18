import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

/** send: the server sends the reply within ~15 s (status sending → replied / error). hide / restore / done: inbox housekeeping. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const { id } = await params
  const b = await req.json().catch(() => ({}))
  let patch: Record<string, unknown>
  if (b.action === 'send') {
    const text = String(b.text || '').trim()
    if (!text) return NextResponse.json({ error: 'Пустой ответ' }, { status: 400 })
    patch = { status: 'sending', reply_text: text.slice(0, 4000), error: null }
  } else if (b.action === 'hide') patch = { status: 'hidden' }
  else if (b.action === 'restore') patch = { status: 'new', error: null }
  else if (b.action === 'done') patch = { status: 'replied', replied_at: new Date().toISOString() }
  else if (typeof b.draft === 'string') patch = { draft: b.draft.slice(0, 4000) }
  else return NextResponse.json({ error: 'bad action' }, { status: 400 })
  const { data, error } = await panelDb().from('comments').update(patch).eq('id', Number(id)).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}
