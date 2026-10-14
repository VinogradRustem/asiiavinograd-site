import { NextRequest, NextResponse } from 'next/server'
import { PANEL_NAMES, panelDb, panelUser } from '@/lib/panel'

export const dynamic = 'force-dynamic'

const FORMAT_OK = ['lecture', 'reels', 'carousel', 'threads', 'article', 'post', 'other']

function fmtNum(n: number) {
  return n.toLocaleString('ru-RU')
}

/** take: put the topic on the board as «На съёмке»; skip: hide it from suggestions. */
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const user = await panelUser()
  if (!user) return new NextResponse('Not found', { status: 404 })
  const { id } = await ctx.params
  const { action } = await req.json().catch(() => ({}))
  const db = panelDb()
  const { data: t, error } = await db.from('semantic_topics').select('*').eq('id', id).single()
  if (error || !t) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (action === 'skip') {
    await db.from('semantic_topics').update({ status: 'skip', updated_at: new Date().toISOString() }).eq('id', id)
    return NextResponse.json({ ok: true })
  }
  if (action !== 'take') return NextResponse.json({ error: 'bad action' }, { status: 400 })

  const phrases: string[] = Array.isArray(t.phrases) ? t.phrases.slice(0, 10) : []
  const notes = [
    t.angle ? `Подача: ${t.angle}` : '',
    `Тема: ${t.topic} (${t.segment})`,
    `Спрос в месяц: Яндекс ${fmtNum(t.yandex)}, Google ${fmtNum(t.google)}${t.trend != null ? `, тренд ${t.trend > 0 ? '+' : ''}${t.trend}%` : ''}`,
    phrases.length ? `Что ищут люди: ${phrases.join('; ')}` : '',
    `Взяла(л): ${PANEL_NAMES[user] || user}`,
  ].filter(Boolean).join('\n')
  const row = {
    id: 't_' + String(t.id),
    title: String(t.title || t.topic).slice(0, 300),
    lang: t.lang,
    format: FORMAT_OK.includes(t.format) ? t.format : null,
    status: 'plan',
    notes,
    source: 'radar',
  }
  const { data: item, error: e2 } = await db.from('content_items').upsert(row).select().single()
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
  await db.from('semantic_topics').update({ status: 'taken', item_id: row.id, updated_at: new Date().toISOString() }).eq('id', id)
  return NextResponse.json({ ok: true, item })
}
