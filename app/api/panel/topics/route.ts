import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

/** Topic ideas from the semantic core (search demand from Yandex + Google), not yet taken. */
export async function GET(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const lang = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'ru'
  const { data, error } = await panelDb()
    .from('semantic_topics')
    .select('id,lang,segment,topic,yandex,google,demand,trend,format,intent,title,angle,phrases,score,status')
    .eq('lang', lang)
    .eq('status', 'new')
    .order('score', { ascending: false })
    .limit(1000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const topics = (data || []).map(t => ({ ...t, phrases: Array.isArray(t.phrases) ? t.phrases.slice(0, 8) : [] }))
  return NextResponse.json({ topics })
}
