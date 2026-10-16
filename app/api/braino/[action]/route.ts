import { NextRequest, NextResponse } from 'next/server'
import { fsrs, generatorParameters, createEmptyCard, Rating, type Card, type Grade } from 'ts-fsrs'
import { brainoUser, db, ensureSeed, cardPoints, quizPoints, taskPoints, weekStart } from '@/lib/braino'
import { PANEL_NAMES } from '@/lib/panel'

export const dynamic = 'force-dynamic'

const F = fsrs(generatorParameters({ enable_fuzz: true, request_retention: 0.9 }))
const NEW_PER_SESSION: Record<string, number> = { calm: 5, normal: 10, intense: 20 }

const toCard = (j: Record<string, unknown> | null): Card =>
  j ? ({ ...(j as unknown as Card), due: new Date(j.due as string), last_review: j.last_review ? new Date(j.last_review as string) : undefined }) : createEmptyCard(new Date())

function fmtInterval(due: Date, now: Date) {
  const m = Math.round((due.getTime() - now.getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)} мин`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} ч`
  const d = Math.round(h / 24)
  if (d < 31) return `${d} дн`
  const mo = Math.round(d / 30)
  return mo < 12 ? `${mo} мес` : `${(d / 365).toFixed(1)} г`
}

function dayStart(tzMin: number, daysAgo = 0) {
  const now = Date.now() - tzMin * 60000 // local clock as UTC
  const d = new Date(now)
  d.setUTCHours(0, 0, 0, 0)
  return new Date(d.getTime() + tzMin * 60000 - daysAgo * 86400000)
}

type Ev = { kind: string; correct: boolean | null; points: number; minutes: number | null; section: string | null; topic: string | null; created_at: string; user_id: string }

export async function GET(req: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const user = await brainoUser()
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const { action } = await ctx.params
  const q = req.nextUrl.searchParams
  const d = db()
  const tz = Number(q.get('tz') || 0) // minutes, same sign as Date.getTimezoneOffset()

  if (action === 'home') {
    await ensureSeed()
    const [decks, cards, states, evs] = await Promise.all([
      d.from('braino_decks').select('*').order('sort'),
      d.from('braino_cards').select('id, deck_id'),
      d.from('braino_card_state').select('card_id, due').eq('user_id', user.id),
      d.from('braino_events').select('kind, points, created_at').eq('user_id', user.id).gte('created_at', dayStart(tz, 60).toISOString()),
    ])
    const now = Date.now()
    const st = new Map((states.data || []).map(s => [s.card_id, new Date(s.due).getTime()]))
    const per: Record<string, { total: number; due: number; fresh: number }> = {}
    for (const c of cards.data || []) {
      const p = (per[c.deck_id] ||= { total: 0, due: 0, fresh: 0 })
      p.total++
      const due = st.get(c.id)
      if (due === undefined) p.fresh++
      else if (due <= now) p.due++
    }
    const today = dayStart(tz).getTime()
    const ev = (evs.data || []) as Ev[]
    const todayPts = ev.filter(e => new Date(e.created_at).getTime() >= today).reduce((a, e) => a + e.points, 0)
    const days = new Set(ev.filter(e => e.kind !== 'timer').map(e => Math.floor((new Date(e.created_at).getTime() - tz * 60000) / 86400000)))
    let streak = 0
    const todayIdx = Math.floor((now - tz * 60000) / 86400000)
    for (let i = days.has(todayIdx) ? todayIdx : todayIdx - 1; days.has(i); i--) streak++
    return NextResponse.json({ user: user.name, decks: (decks.data || []).map(x => ({ ...x, ...per[x.id] })), todayPts, streak })
  }

  if (action === 'study') {
    const deck = q.get('deck')
    const section = q.get('section')
    const mode = q.get('mode') || 'normal'
    let deckIds: string[] = []
    if (deck) deckIds = [deck]
    else if (section) deckIds = ((await d.from('braino_decks').select('id').eq('section', section)).data || []).map(x => x.id)
    const { data: cards } = await d.from('braino_cards').select('id, deck_id, front, back, sort').in('deck_id', deckIds).order('sort')
    const ids = (cards || []).map(c => c.id)
    const { data: states } = ids.length
      ? await d.from('braino_card_state').select('card_id, fsrs, due').eq('user_id', user.id).in('card_id', ids)
      : { data: [] }
    const sm = new Map((states || []).map(s => [s.card_id, s]))
    const now = new Date()
    const due = (cards || []).filter(c => sm.has(c.id) && new Date(sm.get(c.id)!.due) <= now)
    const fresh = (cards || []).filter(c => !sm.has(c.id)).slice(0, NEW_PER_SESSION[mode] || 10)
    const queue = [...due, ...fresh].map(c => {
      const card = toCard(sm.get(c.id)?.fsrs ?? null)
      const prev = F.repeat(card, now)
      return {
        id: c.id, front: c.front, back: c.back, isNew: !sm.has(c.id),
        next: Object.fromEntries([Rating.Again, Rating.Hard, Rating.Good, Rating.Easy].map(r => [r, fmtInterval(prev[r as Grade].card.due, now)])),
      }
    })
    return NextResponse.json({ queue, dueCount: due.length, newCount: fresh.length })
  }

  if (action === 'quiz') {
    let qq = d.from('braino_quiz').select('id, section, topic, statement')
    if (q.get('section')) qq = qq.eq('section', q.get('section')!)
    const { data } = await qq.limit(200)
    const items = (data || []).sort(() => Math.random() - 0.5).slice(0, 10)
    return NextResponse.json({ items })
  }

  if (action === 'tasks') {
    let qq = d.from('braino_tasks').select('id, section, topic, stem, question, options')
    if (q.get('section')) qq = qq.eq('section', q.get('section')!)
    if (q.get('topic')) qq = qq.eq('topic', q.get('topic')!)
    const { data } = await qq.limit(200)
    const { data: all } = await d.from('braino_tasks').select('section, topic')
    return NextResponse.json({ items: (data || []).sort(() => Math.random() - 0.5), filters: all || [] })
  }

  if (action === 'catalog') {
    const [qz, tk] = await Promise.all([d.from('braino_quiz').select('section'), d.from('braino_tasks').select('section, topic')])
    const count = (rows: { section: string }[] | null) => (rows || []).reduce<Record<string, number>>((a, r) => ((a[r.section] = (a[r.section] || 0) + 1), a), {})
    return NextResponse.json({ quiz: count(qz.data), tasks: count(tk.data), taskTopics: tk.data || [] })
  }

  if (action === 'stats') {
    const { data } = await d.from('braino_events').select('*').eq('user_id', user.id).gte('created_at', dayStart(tz, 6).toISOString())
    const ev = (data || []) as Ev[]
    const today = dayStart(tz).getTime()
    const sum = (rows: Ev[]) => ({
      cards: rows.filter(e => e.kind === 'card').length,
      quiz: rows.filter(e => e.kind === 'quiz').length,
      tasks: rows.filter(e => e.kind === 'task').length,
      minutes: rows.filter(e => e.kind === 'timer').reduce((a, e) => a + (e.minutes || 0), 0),
      points: rows.reduce((a, e) => a + e.points, 0),
      correct: rows.filter(e => e.kind !== 'timer' && e.correct).length,
      answered: rows.filter(e => e.kind !== 'timer' && e.correct !== null).length,
    })
    const byTopic: Record<string, { ok: number; n: number; section: string }> = {}
    for (const e of ev) {
      if (e.kind === 'timer' || e.correct === null || !e.topic) continue
      const t = (byTopic[e.topic] ||= { ok: 0, n: 0, section: e.section || '' })
      t.n++
      if (e.correct) t.ok++
    }
    const topics = Object.entries(byTopic).map(([topic, v]) => ({ topic, section: v.section, n: v.n, pct: Math.round((v.ok / v.n) * 100) })).sort((a, b) => a.pct - b.pct)
    const overall = sum(ev)
    const avg = overall.answered ? Math.round((overall.correct / overall.answered) * 100) : 0
    const weak = topics.find(t => t.n >= 3 && t.pct < avg)
    const daily = Array.from({ length: 7 }, (_, i) => {
      const s = dayStart(tz, 6 - i).getTime(), e2 = s + 86400000
      return { day: new Date(s - tz * 60000).toISOString().slice(0, 10), points: ev.filter(x => { const t = new Date(x.created_at).getTime(); return t >= s && t < e2 }).reduce((a, x) => a + x.points, 0) }
    })
    return NextResponse.json({
      today: sum(ev.filter(e => new Date(e.created_at).getTime() >= today)), week: overall, avg, topics, daily,
      advice: weak ? `Уделите внимание теме «${weak.topic}»: точность ${weak.pct}% против ${avg}% в среднем.` : null,
    })
  }

  if (action === 'league') {
    const { data } = await d.from('braino_events').select('user_id, points, correct, kind').gte('created_at', weekStart().toISOString())
    const t: Record<string, { points: number; ok: number; n: number }> = {}
    for (const e of (data || []) as Ev[]) {
      const r = (t[e.user_id] ||= { points: 0, ok: 0, n: 0 })
      r.points += e.points
      if (e.kind !== 'timer' && e.correct !== null) { r.n++; if (e.correct) r.ok++ }
    }
    const rows = Object.entries(t).map(([id, r]) => ({
      id, me: id === user.id, name: PANEL_NAMES[id] || id.replace(/^g:/, ''), points: r.points, pct: r.n ? Math.round((r.ok / r.n) * 100) : 0,
    })).sort((a, b) => b.points - a.points)
    return NextResponse.json({ rows, weekStart: weekStart().toISOString() })
  }

  return NextResponse.json({ error: 'unknown' }, { status: 404 })
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ action: string }> }) {
  const user = await brainoUser()
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 })
  const { action } = await ctx.params
  const b = await req.json().catch(() => ({}))
  const d = db()
  const ms = Math.max(0, Math.min(3600000, Number(b.ms) || 0))

  if (action === 'review') {
    const rating = Number(b.rating) as Grade
    if (![1, 2, 3, 4].includes(rating)) return NextResponse.json({ error: 'rating' }, { status: 400 })
    const { data: card } = await d.from('braino_cards').select('id, deck_id').eq('id', String(b.card_id)).maybeSingle()
    if (!card) return NextResponse.json({ error: 'card' }, { status: 404 })
    const { data: deck } = await d.from('braino_decks').select('section, topic').eq('id', card.deck_id).maybeSingle()
    const { data: st } = await d.from('braino_card_state').select('fsrs').eq('user_id', user.id).eq('card_id', card.id).maybeSingle()
    const now = new Date()
    const prev = toCard(st?.fsrs ?? null)
    const elapsed = prev.last_review ? (now.getTime() - prev.last_review.getTime()) / 86400000 : 0
    const res = F.next(prev, now, rating)
    await d.from('braino_card_state').upsert({ user_id: user.id, card_id: card.id, fsrs: res.card, due: res.card.due.toISOString() })
    const points = cardPoints(rating, ms, prev.state, elapsed)
    await d.from('braino_events').insert({ user_id: user.id, kind: 'card', item_id: card.id, section: deck?.section, topic: deck?.topic, correct: rating >= 3, rating, ms, points })
    return NextResponse.json({ ok: true, points, again: rating === 1 })
  }

  if (action === 'answer') {
    if (b.kind === 'quiz') {
      const { data: it } = await d.from('braino_quiz').select('*').eq('id', String(b.id)).maybeSingle()
      if (!it) return NextResponse.json({ error: 'item' }, { status: 404 })
      const correct = typeof b.value === 'boolean' && b.value === it.answer
      const points = quizPoints(correct, ms)
      await d.from('braino_events').insert({ user_id: user.id, kind: 'quiz', item_id: it.id, section: it.section, topic: it.topic, correct, ms, points })
      return NextResponse.json({ correct, answer: it.answer, explanation: it.explanation, points })
    }
    if (b.kind === 'task') {
      const { data: it } = await d.from('braino_tasks').select('*').eq('id', String(b.id)).maybeSingle()
      if (!it) return NextResponse.json({ error: 'item' }, { status: 404 })
      const correct = Number(b.value) === it.correct
      const points = taskPoints(correct, ms)
      await d.from('braino_events').insert({ user_id: user.id, kind: 'task', item_id: it.id, section: it.section, topic: it.topic, correct, ms, points })
      return NextResponse.json({ correct, answer: it.correct, explanation: it.explanation, points })
    }
    return NextResponse.json({ error: 'kind' }, { status: 400 })
  }

  if (action === 'timer') {
    const minutes = Math.max(1, Math.min(120, Math.round(Number(b.minutes) || 0)))
    await d.from('braino_events').insert({ user_id: user.id, kind: 'timer', minutes, points: 0 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'unknown' }, { status: 404 })
}
