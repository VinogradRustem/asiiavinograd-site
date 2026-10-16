'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Deck = { id: string; section: string; topic: string; total?: number; due?: number; fresh?: number }
type Home = { user: string; decks: Deck[]; todayPts: number; streak: number }
type StudyCard = { id: string; front: string; back: string; isNew: boolean; next: Record<string, string> }
type QuizItem = { id: string; section: string; topic: string; statement: string }
type TaskItem = { id: string; section: string; topic: string; stem: string; question: string; options: string[] }
type View =
  | { v: 'home' }
  | { v: 'cards' }
  | { v: 'study'; deck?: string; section?: string; title: string }
  | { v: 'quiz' }
  | { v: 'quizRun'; section: string }
  | { v: 'tasks' }
  | { v: 'taskRun'; section?: string; topic?: string; title: string }
  | { v: 'stats' }
  | { v: 'league' }

const TZ = typeof window !== 'undefined' ? new Date().getTimezoneOffset() : 0
const api = async <T,>(path: string, body?: unknown): Promise<T> => {
  const r = await fetch(`/api/braino/${path}${path.includes('?') ? '&' : '?'}tz=${TZ}`, body === undefined ? { cache: 'no-store' } : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}
const ls = {
  get: (k: string) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
  del: (k: string) => { try { localStorage.removeItem(k) } catch { /* private mode */ } },
}
const plural = (n: number, a: string, b: string, c: string) => {
  const m10 = n % 10, m100 = n % 100
  return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c
}

/* ---------------- icons ---------------- */
const I = {
  cards: <path d="M4 7h12v12H4zM8 3h12v12" />,
  quiz: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  tasks: <path d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />,
  stats: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  league: <path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3m10-5h3v2a3 3 0 0 1-3 3" />,
  back: <path d="M15 18l-6-6 6-6" />,
  timer: <path d="M12 8v5l3 2M9 2h6M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />,
  flame: <path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7Z" />,
}
const Icon = ({ d, size = 22 }: { d: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
)

/* ---------------- Pomodoro timer ---------------- */
function Timer() {
  const [end, setEnd] = useState<number | null>(null)
  const [len, setLen] = useState(25)
  const [now, setNow] = useState(Date.now())
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const e = Number(ls.get('bx_timer_end')), l = Number(ls.get('bx_timer_len'))
    if (e > Date.now()) { setEnd(e); setLen(l || 25) } else ls.del('bx_timer_end')
  }, [])
  useEffect(() => {
    if (!end) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [end])
  useEffect(() => {
    if (end && now >= end) {
      setEnd(null); ls.del('bx_timer_end'); setDone(true)
      api('timer', { minutes: len }).catch(() => {})
    }
  }, [now, end, len])

  const start = (m: number) => {
    const e = Date.now() + m * 60000
    setLen(m); setEnd(e); setNow(Date.now()); setOpen(false); setDone(false)
    ls.set('bx_timer_end', String(e)); ls.set('bx_timer_len', String(m))
  }
  const stop = () => {
    const spent = Math.round((Date.now() - (end! - len * 60000)) / 60000)
    if (spent >= 1) api('timer', { minutes: spent }).catch(() => {})
    setEnd(null); ls.del('bx_timer_end')
  }
  const left = end ? Math.max(0, end - now) : 0
  const mm = String(Math.floor(left / 60000)).padStart(2, '0'), ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0')

  return (
    <div className="bx-timer">
      {end ? (
        <button className="bx-pill on" onClick={stop} title="Остановить таймер">
          <Icon d={I.timer} size={16} /> <span className="tnum">{mm}:{ss}</span> <span className="bx-pill-x">стоп</span>
        </button>
      ) : (
        <button className="bx-pill" onClick={() => { setOpen(!open); setDone(false) }}>
          <Icon d={I.timer} size={16} /> {done ? 'Помидор завершён' : 'Таймер'}
        </button>
      )}
      {open && !end && (
        <div className="bx-pop" role="dialog" aria-label="Таймер">
          <p>Сколько занимаемся?</p>
          <div className="bx-pop-row">
            {[25, 30, 50].map(m => <button key={m} onClick={() => start(m)}>{m} мин</button>)}
          </div>
          <p className="bx-hint">Время попадёт в статистику.</p>
        </div>
      )}
    </div>
  )
}

/* ---------------- shell ---------------- */
function Top({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <header className="bx-top">
      {onBack ? <button className="bx-icon" onClick={onBack} aria-label="Назад"><Icon d={I.back} /></button> : <div className="bx-logo">Braino</div>}
      {onBack && <h1>{title}</h1>}
      <div className="bx-top-r">{right}<Timer /></div>
    </header>
  )
}

export default function Braino() {
  const [view, setView] = useState<View>({ v: 'home' })
  const [home, setHome] = useState<Home | null>(null)
  const [err, setErr] = useState('')
  const loadHome = useCallback(() => api<Home>('home').then(setHome).catch(() => setErr('Не удалось загрузить данные')), [])
  useEffect(() => { loadHome() }, [loadHome])
  const go = (v: View) => { setView(v); if (typeof window !== 'undefined') window.scrollTo(0, 0) }
  const toHome = () => { go({ v: 'home' }); loadHome() }

  return (
    <div className="bx">
      <div className="bx-wrap">
        {err && <div className="bx-err">{err}</div>}
        {view.v === 'home' && <HomeView home={home} go={go} />}
        {view.v === 'cards' && <CardsView home={home} go={go} back={toHome} />}
        {view.v === 'study' && <StudyView {...view} back={() => { go({ v: 'cards' }); loadHome() }} />}
        {view.v === 'quiz' && <QuizPick go={go} back={toHome} />}
        {view.v === 'quizRun' && <QuizRun section={view.section} back={() => go({ v: 'quiz' })} />}
        {view.v === 'tasks' && <TaskPick go={go} back={toHome} />}
        {view.v === 'taskRun' && <TaskRun {...view} back={() => go({ v: 'tasks' })} />}
        {view.v === 'stats' && <StatsView back={toHome} />}
        {view.v === 'league' && <LeagueView back={toHome} />}
      </div>
    </div>
  )
}

/* ---------------- home ---------------- */
function HomeView({ home, go }: { home: Home | null; go: (v: View) => void }) {
  const due = (home?.decks || []).reduce((a, d) => a + (d.due || 0), 0)
  const fresh = (home?.decks || []).reduce((a, d) => a + (d.fresh || 0), 0)
  const tiles: { v: View; icon: React.ReactNode; title: string; sub: string; tone: string }[] = [
    { v: { v: 'cards' }, icon: I.cards, title: 'Карточки', sub: due ? `${due} на повторение` : fresh ? `${fresh} новых` : 'Всё повторено', tone: 'violet' },
    { v: { v: 'quiz' }, icon: I.quiz, title: 'Квизы', sub: 'Быстрые вопросы на время', tone: 'amber' },
    { v: { v: 'tasks' }, icon: I.tasks, title: 'Задачи', sub: 'Клинические задачи с разбором', tone: 'teal' },
    { v: { v: 'stats' }, icon: I.stats, title: 'Статистика', sub: 'Прогресс и слабые места', tone: 'sky' },
    { v: { v: 'league' }, icon: I.league, title: 'Челленджи', sub: 'Лига недели', tone: 'rose' },
  ]
  return (
    <>
      <Top title="" />
      <section className="bx-hello">
        <div>
          <p className="bx-muted">Привет{home ? `, ${home.user}` : ''}</p>
          <h2>Что сегодня учим?</h2>
        </div>
        <div className="bx-chips">
          <span className="bx-chip" title="Дней подряд"><Icon d={I.flame} size={16} /> {home?.streak ?? 0}</span>
          <span className="bx-chip strong" title="Очки сегодня">{home?.todayPts ?? 0} очк.</span>
        </div>
      </section>
      <div className="bx-tiles">
        {tiles.map((t, i) => (
          <button key={t.title} className={`bx-tile t-${t.tone} ${i === 0 ? 'wide' : ''}`} onClick={() => go(t.v)}>
            <span className="bx-tile-ic"><Icon d={t.icon} size={24} /></span>
            <span className="bx-tile-t">{t.title}</span>
            <span className="bx-tile-s">{t.sub}</span>
          </button>
        ))}
      </div>
      <p className="bx-foot">Тестовая версия. Карточки и вопросы — черновик, их проверяет доктор Асия Виноград.</p>
    </>
  )
}

/* ---------------- cards ---------------- */
const MODES: [string, string, string][] = [['calm', 'Спокойно', '5 новых'], ['normal', 'Обычно', '10 новых'], ['intense', 'Интенсив', '20 новых']]

function CardsView({ home, go, back }: { home: Home | null; go: (v: View) => void; back: () => void }) {
  const [mode, setMode] = useState('normal')
  useEffect(() => { setMode(ls.get('bx_mode') || 'normal') }, [])
  const sections = useMemo(() => {
    const m = new Map<string, Deck[]>()
    for (const d of home?.decks || []) m.set(d.section, [...(m.get(d.section) || []), d])
    return [...m.entries()]
  }, [home])
  const pick = (m: string) => { setMode(m); ls.set('bx_mode', m) }
  return (
    <>
      <Top title="Карточки" onBack={back} />
      <div className="bx-subjects">
        <span className="bx-subj on">USMLE</span>
        <span className="bx-subj soon">NCLEX · скоро</span>
        <span className="bx-subj soon">English · скоро</span>
        <span className="bx-subj soon">Мои колоды · скоро</span>
      </div>
      <div className="bx-seg" role="radiogroup" aria-label="Темп">
        {MODES.map(([k, l, s]) => (
          <button key={k} role="radio" aria-checked={mode === k} className={mode === k ? 'on' : ''} onClick={() => pick(k)}>
            <b>{l}</b><span>{s}</span>
          </button>
        ))}
      </div>
      {!home && <p className="bx-muted bx-pad">Загружаю…</p>}
      {sections.map(([section, decks]) => {
        const due = decks.reduce((a, d) => a + (d.due || 0), 0), fresh = decks.reduce((a, d) => a + (d.fresh || 0), 0)
        return (
          <section key={section} className="bx-card">
            <div className="bx-sec-head">
              <h3>{section}</h3>
              <button className="bx-btn" disabled={!due && !fresh} onClick={() => go({ v: 'study', section, title: section })}>Учить раздел</button>
            </div>
            <ul className="bx-decks">
              {decks.map(d => (
                <li key={d.id}>
                  <button onClick={() => go({ v: 'study', deck: d.id, title: d.topic })} disabled={!d.due && !d.fresh}>
                    <span className="bx-deck-t">{d.topic}</span>
                    <span className="bx-deck-n">
                      {d.due ? <i className="due">{d.due}</i> : null}
                      {d.fresh ? <i className="new">{d.fresh}</i> : null}
                      {!d.due && !d.fresh ? <i className="ok">✓</i> : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      <p className="bx-legend"><i className="due" /> на повторение <i className="new" /> новые</p>
    </>
  )
}

const RATE: [number, string, string][] = [[1, 'Не помню', 'again'], [2, 'С трудом', 'hard'], [3, 'Хорошо', 'good'], [4, 'Легко', 'easy']]

function StudyView({ deck, section, title, back }: { deck?: string; section?: string; title: string; back: () => void }) {
  const [queue, setQueue] = useState<StudyCard[] | null>(null)
  const [shown, setShown] = useState(false)
  const [done, setDone] = useState(0)
  const [pts, setPts] = useState(0)
  const [total, setTotal] = useState(0)
  const t0 = useRef(Date.now())
  useEffect(() => {
    const mode = ls.get('bx_mode') || 'normal'
    api<{ queue: StudyCard[] }>(`study?${deck ? `deck=${deck}` : `section=${encodeURIComponent(section || '')}`}&mode=${mode}`)
      .then(r => { setQueue(r.queue); setTotal(r.queue.length); t0.current = Date.now() })
      .catch(() => setQueue([]))
  }, [deck, section])
  const cur = queue?.[0]
  const rate = async (r: number) => {
    if (!cur) return
    const ms = Date.now() - t0.current
    const rest = queue!.slice(1)
    // "Не помню" — карточка вернётся в конце этой же сессии
    setQueue(r === 1 ? [...rest, { ...cur, isNew: false }] : rest)
    if (r !== 1) setDone(n => n + 1)
    setShown(false); t0.current = Date.now()
    try { const res = await api<{ points: number }>('review', { card_id: cur.id, rating: r, ms }); setPts(p => p + res.points) } catch { /* offline */ }
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (!cur) return
      if (!shown && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); setShown(true) }
      else if (shown && ['1', '2', '3', '4'].includes(e.key)) rate(Number(e.key))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })
  return (
    <>
      <Top title={title} onBack={back} />
      {queue === null ? <p className="bx-muted bx-pad">Загружаю…</p> : !cur ? (
        <div className="bx-done">
          <div className="bx-big">Готово</div>
          <p>{done ? `Повторено ${done} ${plural(done, 'карточка', 'карточки', 'карточек')}, +${pts} ${plural(pts, 'очко', 'очка', 'очков')}.` : 'Сейчас здесь нечего повторять. Загляните позже.'}</p>
          <button className="bx-btn big" onClick={back}>К колодам</button>
        </div>
      ) : (
        <>
          <div className="bx-progress"><span style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div>
          <p className="bx-count">{done} / {total}{cur.isNew && <span className="bx-tag">новая</span>}</p>
          <div className={`bx-flash ${shown ? 'open' : ''}`} onClick={() => !shown && setShown(true)}>
            <div className="bx-front">{cur.front}</div>
            {shown && <div className="bx-back">{cur.back}</div>}
          </div>
          {!shown ? (
            <button className="bx-btn big full" onClick={() => setShown(true)}>Показать ответ</button>
          ) : (
            <div className="bx-rate">
              {RATE.map(([r, l, c]) => (
                <button key={r} className={c} onClick={() => rate(r)}>
                  <b>{l}</b><span>{cur.next[r]}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

/* ---------------- quiz ---------------- */
function QuizPick({ go, back }: { go: (v: View) => void; back: () => void }) {
  const [cat, setCat] = useState<Record<string, number> | null>(null)
  useEffect(() => { api<{ quiz: Record<string, number> }>('catalog').then(r => setCat(r.quiz)).catch(() => setCat({})) }, [])
  return (
    <>
      <Top title="Квизы" onBack={back} />
      <p className="bx-lead">10 коротких вопросов «да или нет». Ошиблись — сразу увидите, почему.</p>
      <div className="bx-list">
        {cat && Object.entries(cat).map(([s, n]) => (
          <button key={s} className="bx-row" onClick={() => go({ v: 'quizRun', section: s })}>
            <span>{s}</span><span className="bx-muted">{n} {plural(n, 'вопрос', 'вопроса', 'вопросов')}</span>
          </button>
        ))}
        {!cat && <p className="bx-muted bx-pad">Загружаю…</p>}
      </div>
    </>
  )
}

const QUIZ_SECONDS = 20
function QuizRun({ section, back }: { section: string; back: () => void }) {
  const [items, setItems] = useState<QuizItem[] | null>(null)
  const [i, setI] = useState(0)
  const [res, setRes] = useState<{ correct: boolean; answer: boolean; explanation: string } | null>(null)
  const [score, setScore] = useState({ ok: 0, pts: 0 })
  const [left, setLeft] = useState(QUIZ_SECONDS)
  const t0 = useRef(Date.now())
  useEffect(() => { api<{ items: QuizItem[] }>(`quiz?section=${encodeURIComponent(section)}`).then(r => { setItems(r.items); t0.current = Date.now() }).catch(() => setItems([])) }, [section])
  const cur = items?.[i]
  const answer = useCallback(async (value: boolean | null) => {
    if (!cur || res) return
    const r = await api<{ correct: boolean; answer: boolean; explanation: string; points: number }>('answer', { kind: 'quiz', id: cur.id, value, ms: Date.now() - t0.current })
      .catch(() => null)
    if (!r) return
    const correct = value === null ? false : r.correct
    setRes({ ...r, correct })
    setScore(s => ({ ok: s.ok + (correct ? 1 : 0), pts: s.pts + (correct ? r.points : 0) }))
  }, [cur, res])
  useEffect(() => {
    if (!cur || res) return
    setLeft(QUIZ_SECONDS)
    const t = setInterval(() => {
      const l = QUIZ_SECONDS - Math.floor((Date.now() - t0.current) / 1000)
      setLeft(l)
      if (l <= 0) { clearInterval(t); answer(null) }
    }, 250)
    return () => clearInterval(t)
  }, [cur, res, answer])
  const next = () => { setRes(null); setI(i + 1); t0.current = Date.now() }
  return (
    <>
      <Top title={section} onBack={back} />
      {items === null ? <p className="bx-muted bx-pad">Загружаю…</p> : !cur ? (
        <div className="bx-done">
          <div className="bx-big">{score.ok} / {items.length}</div>
          <p>Верных ответов. +{score.pts} {plural(score.pts, 'очко', 'очка', 'очков')}.</p>
          <button className="bx-btn big" onClick={back}>Ещё квиз</button>
        </div>
      ) : (
        <>
          <div className="bx-progress"><span style={{ width: `${(i / items.length) * 100}%` }} /></div>
          <p className="bx-count">Вопрос {i + 1} из {items.length} · {cur.topic}</p>
          <div className="bx-q">
            {!res && <div className="bx-clock" style={{ ['--p' as string]: `${(left / QUIZ_SECONDS) * 100}%` }}><span>{Math.max(0, left)}</span></div>}
            <p>{cur.statement}</p>
          </div>
          {!res ? (
            <div className="bx-yn">
              <button className="yes" onClick={() => answer(true)}>Да</button>
              <button className="no" onClick={() => answer(false)}>Нет</button>
            </div>
          ) : (
            <div className={`bx-fb ${res.correct ? 'ok' : 'bad'}`}>
              <b>{res.correct ? 'Верно' : `Неверно. Правильный ответ: ${res.answer ? 'да' : 'нет'}`}</b>
              <p>{res.explanation}</p>
              <button className="bx-btn big full" onClick={next}>{i + 1 < items.length ? 'Дальше' : 'Итог'}</button>
            </div>
          )}
        </>
      )}
    </>
  )
}

/* ---------------- tasks ---------------- */
function TaskPick({ go, back }: { go: (v: View) => void; back: () => void }) {
  const [topics, setTopics] = useState<{ section: string; topic: string }[] | null>(null)
  useEffect(() => { api<{ taskTopics: { section: string; topic: string }[] }>('catalog').then(r => setTopics(r.taskTopics)).catch(() => setTopics([])) }, [])
  const grouped = useMemo(() => {
    const m = new Map<string, Map<string, number>>()
    for (const t of topics || []) {
      const s = m.get(t.section) || new Map(); s.set(t.topic, (s.get(t.topic) || 0) + 1); m.set(t.section, s)
    }
    return [...m.entries()]
  }, [topics])
  return (
    <>
      <Top title="Задачи" onBack={back} />
      <p className="bx-lead">Клинические задачи в стиле USMLE с разбором. Можно взять весь раздел или одну тему.</p>
      {!topics && <p className="bx-muted bx-pad">Загружаю…</p>}
      {grouped.map(([section, ts]) => (
        <section key={section} className="bx-card">
          <div className="bx-sec-head">
            <h3>{section}</h3>
            <button className="bx-btn" onClick={() => go({ v: 'taskRun', section, title: section })}>Весь раздел</button>
          </div>
          <div className="bx-filters">
            {[...ts.entries()].map(([t, n]) => (
              <button key={t} className="bx-filter" onClick={() => go({ v: 'taskRun', section, topic: t, title: t })}>{t} <span>{n}</span></button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

function TaskRun({ section, topic, title, back }: { section?: string; topic?: string; title: string; back: () => void }) {
  const [items, setItems] = useState<TaskItem[] | null>(null)
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [res, setRes] = useState<{ correct: boolean; answer: number; explanation: string } | null>(null)
  const [score, setScore] = useState({ ok: 0, pts: 0 })
  const t0 = useRef(Date.now())
  useEffect(() => {
    const p = new URLSearchParams(); if (section) p.set('section', section); if (topic) p.set('topic', topic)
    api<{ items: TaskItem[] }>(`tasks?${p}`).then(r => { setItems(r.items); t0.current = Date.now() }).catch(() => setItems([]))
  }, [section, topic])
  const cur = items?.[i]
  const submit = async () => {
    if (!cur || pick === null) return
    const r = await api<{ correct: boolean; answer: number; explanation: string; points: number }>('answer', { kind: 'task', id: cur.id, value: pick, ms: Date.now() - t0.current }).catch(() => null)
    if (!r) return
    setRes(r); setScore(s => ({ ok: s.ok + (r.correct ? 1 : 0), pts: s.pts + r.points }))
  }
  const next = () => { setRes(null); setPick(null); setI(i + 1); t0.current = Date.now() }
  return (
    <>
      <Top title={title} onBack={back} />
      {items === null ? <p className="bx-muted bx-pad">Загружаю…</p> : !cur ? (
        <div className="bx-done">
          <div className="bx-big">{score.ok} / {items.length}</div>
          <p>Задач решено верно. +{score.pts} {plural(score.pts, 'очко', 'очка', 'очков')}.</p>
          <button className="bx-btn big" onClick={back}>К задачам</button>
        </div>
      ) : (
        <>
          <p className="bx-count">Задача {i + 1} из {items.length} · {cur.topic}</p>
          <article className="bx-task">
            <p className="bx-stem">{cur.stem}</p>
            <p className="bx-ask">{cur.question}</p>
            <ol className="bx-opts">
              {cur.options.map((o, k) => {
                const state = res ? (k === res.answer ? 'right' : k === pick ? 'wrong' : 'dim') : pick === k ? 'sel' : ''
                return (
                  <li key={k}>
                    <button className={state} disabled={!!res} onClick={() => setPick(k)}>
                      <span className="bx-letter">{String.fromCharCode(65 + k)}</span>{o}
                    </button>
                  </li>
                )
              })}
            </ol>
          </article>
          {!res ? (
            <button className="bx-btn big full" disabled={pick === null} onClick={submit}>Ответить</button>
          ) : (
            <div className={`bx-fb ${res.correct ? 'ok' : 'bad'}`}>
              <b>{res.correct ? 'Верно' : `Неверно. Правильный ответ: ${String.fromCharCode(65 + res.answer)}`}</b>
              <p>{res.explanation}</p>
              <button className="bx-btn big full" onClick={next}>{i + 1 < items.length ? 'Следующая задача' : 'Итог'}</button>
            </div>
          )}
        </>
      )}
    </>
  )
}

/* ---------------- stats ---------------- */
type Sum = { cards: number; quiz: number; tasks: number; minutes: number; points: number; correct: number; answered: number }
type Stats = { today: Sum; week: Sum; avg: number; topics: { topic: string; section: string; n: number; pct: number }[]; daily: { day: string; points: number }[]; advice: string | null }

function StatsView({ back }: { back: () => void }) {
  const [s, setS] = useState<Stats | null>(null)
  useEffect(() => { api<Stats>('stats').then(setS).catch(() => {}) }, [])
  const max = Math.max(1, ...(s?.daily || []).map(d => d.points))
  const pct = (x: Sum) => (x.answered ? `${Math.round((x.correct / x.answered) * 100)}%` : '—')
  return (
    <>
      <Top title="Статистика" onBack={back} />
      {!s ? <p className="bx-muted bx-pad">Загружаю…</p> : (
        <>
          <h3 className="bx-h">Сегодня</h3>
          <div className="bx-kpis">
            <div><b>{s.today.cards}</b><span>карточек</span></div>
            <div><b>{s.today.quiz}</b><span>вопросов квиза</span></div>
            <div><b>{s.today.tasks}</b><span>задач</span></div>
            <div><b>{pct(s.today)}</b><span>верных</span></div>
            <div><b>{s.today.minutes}</b><span>минут по таймеру</span></div>
            <div><b>{s.today.points}</b><span>очков</span></div>
          </div>
          {s.advice && <div className="bx-advice"><b>Совет</b><p>{s.advice}</p></div>}
          <h3 className="bx-h">Очки за 7 дней</h3>
          <div className="bx-bars" role="img" aria-label="Очки по дням за неделю">
            {s.daily.map(d => (
              <div key={d.day} className="bx-bar">
                <span className="v">{d.points || ''}</span>
                <span className="b" style={{ height: `${(d.points / max) * 100}%` }} />
                <span className="l">{new Date(d.day + 'T12:00:00').toLocaleDateString('ru-RU', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
          <h3 className="bx-h">Точность по темам за неделю</h3>
          {s.topics.length === 0 ? <p className="bx-muted">Позанимайтесь немного, и здесь появятся ваши сильные и слабые темы.</p> : (
            <ul className="bx-acc">
              {s.topics.map(t => (
                <li key={t.topic}>
                  <span className="n">{t.topic}<small>{t.n} {plural(t.n, 'ответ', 'ответа', 'ответов')}</small></span>
                  <span className="track"><span className={t.pct < 60 ? 'low' : t.pct < 80 ? 'mid' : 'hi'} style={{ width: `${t.pct}%` }} /></span>
                  <span className="p">{t.pct}%</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}

/* ---------------- league ---------------- */
function LeagueView({ back }: { back: () => void }) {
  const [rows, setRows] = useState<{ id: string; name: string; points: number; pct: number; me: boolean }[] | null>(null)
  useEffect(() => { api<{ rows: typeof rows }>('league').then(r => setRows(r.rows)).catch(() => setRows([])) }, [])
  return (
    <>
      <Top title="Челленджи" onBack={back} />
      <section className="bx-card">
        <div className="bx-sec-head"><h3>Лига недели · USMLE Club</h3></div>
        {!rows ? <p className="bx-muted">Загружаю…</p> : rows.length === 0 ? <p className="bx-muted">На этой неделе ещё никто не занимался. Станьте первым.</p> : (
          <ol className="bx-league">
            {rows.map((r, k) => (
              <li key={r.id} className={r.me ? 'me' : ''}>
                <span className="pos">{k + 1}</span>
                <span className="who">{r.name}{r.me && <small>вы</small>}</span>
                <span className="acc">{r.pct}%</span>
                <span className="pts">{r.points}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
      <section className="bx-card">
        <h3>Как считаются очки</h3>
        <ul className="bx-rules">
          <li>Карточка, вспомненная после долгого перерыва: до 6 очков. Чем дольше помните, тем больше.</li>
          <li>Новая или выученная сегодня карточка: 1 очко.</li>
          <li>Верный ответ в квизе: 2 очка. Задача: 5 очков.</li>
          <li>Слишком быстрые ответы (меньше секунды на карточку) не засчитываются. Пролистывание не приносит очков.</li>
        </ul>
        <p className="bx-muted">Скоро: друзья, свои группы и челленджи, итоги в Telegram-чат.</p>
      </section>
    </>
  )
}
