'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Slot = {
  id: number; day: string; slot: number; kind: string; lang: string; title: string; hook: string | null
  points: string[]; where_to: string[]; orient: string | null; length: string | null; status: 'todo' | 'done' | 'skip'
}
type Pub = { id: string; title: string; format: string | null; lang: string | null; published_at: string }
type Data = { plan: Slot[]; published: Pub[]; consults: { id: number; name: string; starts_at: string }[]; tasks: { id: number; title: string }[] }

const KIND: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  lecture: { label: 'Лекция', color: '#2f6fb3', icon: <path d="M4 6h16v10H4zM9 9.5v4l3.5-2z" /> },
  reels: { label: 'Reels', color: '#e0664a', icon: <path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM10.5 9.5v5l4-2.5z" /> },
  carousel: { label: 'Карусель', color: '#c08a1e', icon: <path d="M7 5h10v14H7zM4 7v10M20 7v10" /> },
  story: { label: 'Сторис', color: '#8a5cc4', icon: <circle cx="12" cy="12" r="7.5" /> },
  english: { label: 'Мед. английский', color: '#2e8b62', icon: <path d="M6 7h6M6 12h5M6 17h6M6 7v10M15 17V10l4 7V10" /> },
}
const FORMAT_KIND: Record<string, string> = { lecture: 'lecture', reels: 'reels', shorts: 'reels', carousel: 'carousel', story: 'story' }
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function weekStart(d: Date) { return addDays(d, -((d.getDay() + 6) % 7)) }

function Icon({ kind, size = 22 }: { kind: string; size?: number }) {
  const k = KIND[kind] || KIND.reels
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {k.icon}
    </svg>
  )
}

function Ring({ done, total }: { done: number; total: number }) {
  const r = 26, c = 2 * Math.PI * r, p = total ? done / total : 0
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="td-ring" aria-label={`Сделано ${done} из ${total}`}>
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--ok)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform="rotate(-90 34 34)" />
      <text x="34" y="39" textAnchor="middle" className="td-ring-t">{done}/{total}</text>
    </svg>
  )
}

export default function Today({ userName }: { userName: string }) {
  const now = new Date()
  const [sel, setSel] = useState(iso(now))
  const [data, setData] = useState<Data | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [err, setErr] = useState('')
  const ws = weekStart(new Date(sel + 'T12:00:00'))
  const days = Array.from({ length: 7 }, (_, i) => iso(addDays(ws, i)))

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/panel/today?from=${days[0]}&to=${days[6]}`, { cache: 'no-store' })
      if (!r.ok) throw new Error()
      setData(await r.json()); setErr('')
    } catch { setErr('Не получилось загрузить план. Обновите страницу.') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days[0]])
  useEffect(() => { load() }, [load])

  async function patch(id: number, body: object) {
    setData(d => d && { ...d, plan: d.plan.map(s => (s.id === id ? { ...s, ...body } as Slot : s)) })
    const r = await fetch(`/api/panel/today/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!r.ok) setErr('Не сохранилось. Попробуйте ещё раз.')
    load()
  }

  const todays = useMemo(() => (data?.plan || []).filter(s => s.day === sel), [data, sel])
  const main = todays.filter(s => s.kind !== 'story')
  const stories = todays.filter(s => s.kind === 'story')
  const done = todays.filter(s => s.status === 'done').length
  const isToday = sel === iso(now)
  const selDate = new Date(sel + 'T12:00:00')
  const hello = now.getHours() < 12 ? 'Доброе утро' : now.getHours() < 18 ? 'Добрый день' : 'Добрый вечер'
  const pubOf = (d: string) => (data?.published || []).filter(p => iso(new Date(p.published_at)) === d)

  return (
    <div className="td">
      {err && <div className="pl-err" role="alert">{err}</div>}

      <section className="td-hero">
        <div>
          <p className="td-hello">{hello}, {userName}</p>
          <h2 className="td-date">
            {isToday ? 'Сегодня, ' : ''}{selDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <p className="td-sub">
            {todays.length === 0 ? (data ? 'На этот день съёмок нет. Можно отдохнуть.' : 'Загружаю план…')
              : done === todays.length ? 'Всё снято. Отличный день!'
              : `Снять: ${todays.filter(s => s.status === 'todo').map(s => KIND[s.kind]?.label.toLowerCase()).join(', ')}`}
          </p>
        </div>
        {todays.length > 0 && <Ring done={done} total={todays.length} />}
      </section>

      <nav className="td-week" aria-label="Неделя">
        <button className="td-wk-nav" onClick={() => setSel(iso(addDays(ws, -7)))} aria-label="Прошлая неделя">‹</button>
        {days.map((d, i) => {
          const items = (data?.plan || []).filter(s => s.day === d)
          const pubs = pubOf(d).length
          const dt = new Date(d + 'T12:00:00')
          return (
            <button key={d} className={`td-day ${d === sel ? 'on' : ''} ${d === iso(now) ? 'today' : ''}`} onClick={() => { setSel(d); setOpen(null) }}>
              <span className="td-wd">{WD[i]}</span>
              <span className="td-dn">{dt.getDate()}</span>
              <span className="td-dots">
                {items.map(s => (
                  <i key={s.id} className={s.status === 'done' ? 'f' : s.status === 'skip' ? 'x' : ''} style={{ color: KIND[s.kind]?.color }} />
                ))}
              </span>
              {pubs > 0 && <span className="td-pub" title="Вышло публикаций">{pubs} вышло</span>}
            </button>
          )
        })}
        <button className="td-wk-nav" onClick={() => setSel(iso(addDays(ws, 7)))} aria-label="Следующая неделя">›</button>
      </nav>

      <div className="td-grid">
        <div className="td-main">
          {main.map(s => {
            const k = KIND[s.kind] || KIND.reels
            const expanded = open === s.id || main.length === 1
            return (
              <article key={s.id} className={`td-card st-${s.status}`} style={{ ['--k' as string]: k.color }}>
                <button className="td-card-head" onClick={() => setOpen(expanded && main.length > 1 ? null : s.id)}>
                  <span className="td-ic"><Icon kind={s.kind} /></span>
                  <span className="td-card-tt">
                    <span className="td-kind">{k.label} · {s.length}</span>
                    <span className="td-title">{s.title}</span>
                  </span>
                  {s.status === 'done' && <span className="td-badge">Снято</span>}
                </button>
                {expanded && (
                  <div className="td-body">
                    {s.hook && <p className="td-hook">«{s.hook}»</p>}
                    {s.points?.length > 0 && <ul className="td-points">{s.points.map((p, i) => <li key={i}>{p}</li>)}</ul>}
                    <div className="td-meta">
                      <span className="td-orient">{s.orient}</span>
                      {s.where_to.map(w => <span key={w} className="td-chip">{w}</span>)}
                    </div>
                  </div>
                )}
                <div className="td-actions">
                  {s.status !== 'done'
                    ? <button className="td-btn ok" onClick={() => patch(s.id, { status: 'done' })}>Снято</button>
                    : <button className="td-btn" onClick={() => patch(s.id, { status: 'todo' })}>Вернуть</button>}
                  <button className="td-btn" onClick={() => patch(s.id, { day: iso(addDays(new Date(s.day + 'T12:00:00'), 1)), status: 'todo' })}>На завтра</button>
                  {s.status !== 'skip' && <button className="td-btn ghost" onClick={() => patch(s.id, { status: 'skip' })}>Пропустить</button>}
                </div>
              </article>
            )
          })}

          {stories.map(s => (
            <article key={s.id} className={`td-card td-story st-${s.status}`} style={{ ['--k' as string]: KIND.story.color }}>
              <div className="td-card-head static">
                <span className="td-ic"><Icon kind="story" /></span>
                <span className="td-card-tt">
                  <span className="td-kind">Сторис · {s.length}</span>
                  <span className="td-title">{s.title}</span>
                </span>
                {s.status === 'done' && <span className="td-badge">Снято</span>}
              </div>
              <ol className="td-frames">{s.points.map((p, i) => <li key={i}>{p}</li>)}</ol>
              <div className="td-actions">
                {s.status !== 'done'
                  ? <button className="td-btn ok" onClick={() => patch(s.id, { status: 'done' })}>Снято</button>
                  : <button className="td-btn" onClick={() => patch(s.id, { status: 'todo' })}>Вернуть</button>}
              </div>
            </article>
          ))}
        </div>

        <aside className="td-side">
          <div className="td-box">
            <h3>Вышло за неделю</h3>
            {(data?.published || []).length === 0 ? <p className="td-muted">Пока ничего.</p> : (
              <ul className="td-list">
                {(data?.published || []).slice(-8).reverse().map(p => (
                  <li key={p.id}>
                    <span className="td-dot" style={{ background: KIND[FORMAT_KIND[p.format || ''] || 'reels']?.color }} />
                    <span>{p.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="td-box">
            <h3>Ждут вас</h3>
            <ul className="td-list">
              <li><b>{data?.consults.length ?? 0}</b>&nbsp;записей на консультацию</li>
              <li><b>{data?.tasks.length ?? 0}</b>&nbsp;задач в списке</li>
              <li className="td-muted">Комментарии из соцсетей появятся здесь скоро</li>
            </ul>
            {data && data.consults[0] && (
              <p className="td-next">Ближайшая: {data.consults[0].name}, {new Date(data.consults[0].starts_at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
