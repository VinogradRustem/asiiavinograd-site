import { NextRequest, NextResponse } from 'next/server'
import { isPanelAuthed, panelDb } from '@/lib/panel'

export const dynamic = 'force-dynamic'

const D = /^\d{4}-\d{2}-\d{2}$/

/** Morning dashboard: filming plan for a date range + what was published + things waiting for Asiia. */
export async function GET(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 })
  const from = req.nextUrl.searchParams.get('from') || ''
  const to = req.nextUrl.searchParams.get('to') || ''
  if (!D.test(from) || !D.test(to)) return NextResponse.json({ error: 'from/to required' }, { status: 400 })
  const db = panelDb()
  const [plan, pub, consult, tasks] = await Promise.all([
    db.from('day_plan').select('*').gte('day', from).lte('day', to).order('day').order('slot'),
    db.from('content_items').select('id,title,format,lang,published_at,platforms').eq('status', 'published')
      .gte('published_at', `${from}T00:00:00+07:00`).lte('published_at', `${to}T23:59:59+07:00`).order('published_at'),
    db.from('consult_bookings').select('id,name,starts_at,status').gte('starts_at', new Date().toISOString()).neq('status', 'cancelled').order('starts_at').limit(5),
    db.from('panel_tasks').select('id,title').eq('assignee', 'asya').eq('done', false).limit(20),
  ])
  if (plan.error) return NextResponse.json({ error: plan.error.message }, { status: 500 })
  return NextResponse.json({
    plan: plan.data || [],
    published: pub.data || [],
    consults: consult.data || [],
    tasks: tasks.data || [],
  })
}
