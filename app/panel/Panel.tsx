'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import './panel.css'
import Shoot from './Shoot'

type Item = {
  id: string
  title: string
  lang: 'ru' | 'en' | null
  format: string | null
  status: string
  planned_for: string | null
  published_at: string | null
  platforms: Record<string, string | boolean | string[]>
  source: 'manual' | 'bot' | 'radar'
  notes: string | null
  links?: string[]
  created_at: string
  updated_at: string
}

const COLUMNS: { key: string; label: string; hint: string; statuses: string[] }[] = [
  { key: 'idea', label: 'Идеи', hint: 'Заметки и темы из радара', statuses: ['idea'] },
  { key: 'plan', label: 'На съёмке', hint: 'Тему взяли, снимаем', statuses: ['plan'] },
  { key: 'work', label: 'На проверке', hint: 'Видео у бота: обложка, текст, согласование', statuses: ['work'] },
  { key: 'ready', label: 'Готово к выходу', hint: 'Загружено или стоит в очереди', statuses: ['ready', 'scheduled'] },
  { key: 'published', label: 'Опубликовано', hint: 'Уже вышло', statuses: ['published'] },
]

const STATUS_LABEL: Record<string, string> = {
  idea: 'Идея', plan: 'На съёмке', work: 'На проверке', ready: 'Готово к выходу',
  scheduled: 'В очереди', published: 'Опубликовано',
}

const FORMAT_LABEL: Record<string, string> = {
  lecture: 'Лекция', shorts: 'Shorts', post: 'Пост', reels: 'Reels', carousel: 'Карусель',
  story: 'Сторис', threads: 'Threads', article: 'Статья', other: 'Другое',
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook', threads: 'Threads',
  vk: 'VK', telegram: 'Telegram · Дзен',
}

const LOCKED = [
  { key: 'seo', label: 'SEO', text: 'Позиции сайта в Google и Яндексе, статьи, индексация, трафик из поиска.' },
  { key: 'ads', label: 'Реклама', text: 'Яндекс Директ и Google Ads: расход, клики, заявки, цена заявки.' },
  { key: 'sales', label: 'Продажи', text: 'Подписки Tribute и Patreon, новые участники клуба, доход по месяцам.' },
  { key: 'stats', label: 'Аналитика', text: 'Просмотры и подписчики по каждой площадке, лучшие публикации.' },
]

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function itemDate(i: Item): string | null {
  return i.status === 'published' ? i.published_at || i.planned_for : i.planned_for
}

function fmtDate(s: string | null, withTime = false) {
  if (!s) return ''
  const d = new Date(s)
  const date = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  if (!withTime) return date
  return `${date}, ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
}

function toLocalInput(s: string | null) {
  if (!s) return ''
  const d = new Date(s)
  const off = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function Panel({ userName }: { userName: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('shoot')
  const [view, setView] = useState<'board' | 'calendar' | 'table'>('board')
  const [lang, setLang] = useState<'all' | 'ru' | 'en'>('all')
  const [format, setFormat] = useState('all')
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<Partial<Item> | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<string | null>(null)
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })

  useEffect(() => {
    try {
      const v = localStorage.getItem('pulse_view')
      if (v === 'board' || v === 'calendar' || v === 'table') setView(v)
    } catch {}
  }, [])
  useEffect(() => { try { localStorage.setItem('pulse_view', view) } catch {} }, [view])

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/panel/items', { cache: 'no-store' })
      if (!r.ok) throw new Error(String(r.status))
      const j = await r.json()
      setItems(j.items || [])
      setErr('')
    } catch {
      setErr('Не получилось загрузить данные. Обновите страницу.')
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [load])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return items.filter(i =>
      (lang === 'all' || i.lang === lang) &&
      (format === 'all' || i.format === format) &&
      (!s || i.title.toLowerCase().includes(s) || (i.notes || '').toLowerCase().includes(s)))
  }, [items, lang, format, q])

  const counts = useMemo(() => {
    const weekAgo = Date.now() - 7 * 864e5
    return {
      idea: filtered.filter(i => i.status === 'idea').length,
      plan: filtered.filter(i => i.status === 'plan').length,
      work: filtered.filter(i => i.status === 'work').length,
      ready: filtered.filter(i => i.status === 'ready' || i.status === 'scheduled').length,
      week: filtered.filter(i => i.status === 'published' && i.published_at && new Date(i.published_at).getTime() > weekAgo).length,
    }
  }, [filtered])

  async function save(it: Partial<Item>) {
    const isNew = !it.id
    const body = {
      title: it.title, lang: it.lang ?? null, format: it.format ?? null, status: it.status || 'idea',
      planned_for: it.planned_for || null, notes: it.notes ?? null,
      links: (it.links || []).map(u => u.trim()).filter(Boolean),
    }
    const r = await fetch(isNew ? '/api/panel/items' : `/api/panel/items/${it.id}`, {
      method: isNew ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    if (!r.ok) { setErr('Не сохранилось. Попробуйте ещё раз.'); return }
    setEdit(null)
    load()
  }

  async function move(id: string, status: string) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)))
    const r = await fetch(`/api/panel/items/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }),
    })
    if (!r.ok) setErr('Не сохранилось. Попробуйте ещё раз.')
    load()
  }

  async function remove(id: string) {
    await fetch(`/api/panel/items/${id}`, { method: 'DELETE' })
    setEdit(null)
    load()
  }

  const usedFormats = useMemo(() => Array.from(new Set(items.map(i => i.format).filter(Boolean))) as string[], [items])

  return (
    <div className="pl">
      <header className="pl-head">
        <div className="pl-brand">
          <span className="pl-dot" aria-hidden />
          <div>
            <h1>Пульс USMLE</h1>
            <p>Привет, {userName} · <button className="pl-logout" onClick={async () => { await fetch('/api/panel/login', { method: 'DELETE' }); location.reload() }}>выйти</button></p>
          </div>
        </div>
        <nav className="pl-tabs" aria-label="Разделы">
          <button className={tab === 'shoot' ? 'on' : ''} onClick={() => setTab('shoot')}>Что снимать</button>
          <button className={tab === 'content' ? 'on' : ''} onClick={() => { setTab('content'); load() }}>Доска</button>
          {LOCKED.map(l => (
            <button key={l.key} className={`locked ${tab === l.key ? 'on' : ''}`} onClick={() => setTab(l.key)}>
              <Lock /> {l.label}
            </button>
          ))}
        </nav>
      </header>

      {err && <div className="pl-err" role="alert">{err}</div>}

      {tab === 'shoot' ? (
        <Shoot onTaken={() => load()} onOpenBoard={() => { setTab('content'); load() }} />
      ) : tab !== 'content' ? (
        <LockedTab info={LOCKED.find(l => l.key === tab)!} />
      ) : (
        <main className="pl-main">
          <section className="pl-kpis" aria-label="Сводка">
            <Kpi n={counts.idea} label="Идеи" />
            <Kpi n={counts.plan} label="На съёмке" accent />
            <Kpi n={counts.work} label="На проверке" />
            <Kpi n={counts.ready} label="Готово к выходу" />
            <Kpi n={counts.week} label="Вышло за 7 дней" />
          </section>

          <section className="pl-bar">
            <div className="pl-seg" role="tablist" aria-label="Вид">
              {([['board', 'Доска'], ['calendar', 'Календарь'], ['table', 'Таблица']] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</button>
              ))}
            </div>
            <div className="pl-seg small" aria-label="Язык">
              {([['all', 'Все'], ['ru', 'RU'], ['en', 'EN']] as const).map(([k, l]) => (
                <button key={k} className={lang === k ? 'on' : ''} onClick={() => setLang(k)}>{l}</button>
              ))}
            </div>
            <select className="pl-select" value={format} onChange={e => setFormat(e.target.value)} aria-label="Формат">
              <option value="all">Все форматы</option>
              {usedFormats.map(f => <option key={f} value={f}>{FORMAT_LABEL[f] || f}</option>)}
            </select>
            <input className="pl-search" placeholder="Поиск" value={q} onChange={e => setQ(e.target.value)} aria-label="Поиск" />
            <button className="pl-add" onClick={() => setEdit({ status: 'idea', lang: null, format: null, title: '', notes: '', links: [] })}>+ Идея</button>
          </section>

          {!loaded ? (
            <p className="pl-empty">Загружаю…</p>
          ) : view === 'board' ? (
            <div className="pl-board">
              {COLUMNS.map(col => {
                const list = filtered
                  .filter(i => col.statuses.includes(i.status))
                  .sort((a, b) => {
                    const da = itemDate(a), db = itemDate(b)
                    if (col.key === 'published') return (db || '').localeCompare(da || '')
                    if (da && db) return da.localeCompare(db)
                    return b.updated_at.localeCompare(a.updated_at)
                  })
                return (
                  <div
                    key={col.key}
                    className={`pl-col ${overCol === col.key ? 'over' : ''}`}
                    onDragOver={e => { e.preventDefault(); setOverCol(col.key) }}
                    onDragLeave={() => setOverCol(null)}
                    onDrop={e => {
                      e.preventDefault(); setOverCol(null)
                      const it = items.find(i => i.id === dragId)
                      if (it && !col.statuses.includes(it.status)) move(it.id, col.statuses[0])
                      setDragId(null)
                    }}
                  >
                    <div className="pl-col-head">
                      <h2>{col.label}</h2>
                      <span className="pl-count">{list.length}</span>
                    </div>
                    <p className="pl-col-hint">{col.hint}</p>
                    <div className="pl-cards">
                      {list.map(i => (
                        <Card key={i.id} i={i} onOpen={() => setEdit(i)} onDrag={() => setDragId(i.id)}
                          onShot={col.key === 'plan' ? () => remove(i.id) : undefined} />
                      ))}
                      {list.length === 0 && <p className="pl-col-empty">Пусто</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : view === 'calendar' ? (
            <Calendar items={filtered} month={month} setMonth={setMonth} onOpen={setEdit} />
          ) : (
            <Table items={filtered} onOpen={setEdit} />
          )}
        </main>
      )}

      {edit && <Editor it={edit} onClose={() => setEdit(null)} onSave={save} onDelete={remove} />}
    </div>
  )
}

function Kpi({ n, label, accent }: { n: number; label: string; accent?: boolean }) {
  return (
    <div className={`pl-kpi ${accent ? 'accent' : ''}`}>
      <span className="n">{n}</span>
      <span className="l">{label}</span>
    </div>
  )
}

function Tags({ i }: { i: Item }) {
  return (
    <div className="pl-tags">
      {i.lang && <span className={`pl-tag lang-${i.lang}`}>{i.lang.toUpperCase()}</span>}
      {i.format && <span className="pl-tag">{FORMAT_LABEL[i.format] || i.format}</span>}
      {i.source === 'radar' && <span className="pl-tag radar">Радар</span>}
      {i.status === 'scheduled' && <span className="pl-tag queue">В очереди</span>}
    </div>
  )
}

function linkName(u: string, n: number) {
  try {
    const h = new URL(u).hostname.replace(/^www\./, '')
    if (h.includes('claude.ai')) return 'Claude'
    if (h.includes('youtu')) return 'YouTube'
    if (h.includes('instagram')) return 'Instagram'
    if (h.includes('t.me')) return 'Telegram'
    return h.split('.').slice(-2, -1)[0] || `Ссылка ${n + 1}`
  } catch { return `Ссылка ${n + 1}` }
}

function Card({ i, onOpen, onDrag, onShot }: { i: Item; onOpen: () => void; onDrag: () => void; onShot?: () => void }) {
  const d = itemDate(i)
  const links = Object.entries(i.platforms || {}).filter(([k]) => k !== 'sources')
  return (
    <div className="pl-card-wrap">
    <button className="pl-card" draggable onDragStart={onDrag} onClick={onOpen}>
      <Tags i={i} />
      <span className="pl-card-title">{i.title}</span>
      {(d || links.length > 0) && (
        <span className="pl-card-foot">
          {d && <span className="pl-date">{fmtDate(d, i.status === 'scheduled')}</span>}
          {links.length > 0 && <span className="pl-plats">{links.map(([k]) => PLATFORM_LABEL[k] || k).join(' · ')}</span>}
        </span>
      )}
    </button>
    {(i.links || []).length > 0 && (
      <span className="pl-card-links">
        {(i.links || []).map((u, n) => (
          <a key={u + n} href={u} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{linkName(u, n)} ↗</a>
        ))}
      </span>
    )}
    {onShot && (
      <button className="pl-shot" onClick={onShot} title="Видео загружено в бота: эта карточка больше не нужна, бот ведёт свою">
        Снято, видео в боте
      </button>
    )}
    </div>
  )
}

function Calendar({ items, month, setMonth, onOpen }: {
  items: Item[]; month: Date; setMonth: (d: Date) => void; onOpen: (i: Item) => void
}) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7))
  const days = Array.from({ length: 42 }, (_, k) => { const d = new Date(start); d.setDate(start.getDate() + k); return d })
  const today = new Date()
  const dated = items.filter(i => itemDate(i))
  const undated = items.filter(i => !itemDate(i) && (i.status === 'plan' || i.status === 'ready')).length
  return (
    <div className="pl-cal">
      <div className="pl-cal-head">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Предыдущий месяц">‹</button>
        <h2>{MONTHS[month.getMonth()]} {month.getFullYear()}</h2>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Следующий месяц">›</button>
        <button className="pl-today" onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }}>Сегодня</button>
      </div>
      <div className="pl-cal-grid">
        {WD.map(w => <div key={w} className="pl-wd">{w}</div>)}
        {days.map(d => {
          const list = dated.filter(i => sameDay(new Date(itemDate(i)!), d))
          return (
            <div key={d.toISOString()} className={`pl-day ${d.getMonth() !== month.getMonth() ? 'out' : ''} ${sameDay(d, today) ? 'today' : ''}`}>
              <span className="pl-day-n">{d.getDate()}</span>
              {list.map(i => (
                <button key={i.id} className={`pl-ev st-${i.status}`} onClick={() => onOpen(i)} title={i.title}>
                  {i.lang ? i.lang.toUpperCase() + ' · ' : ''}{i.title}
                </button>
              ))}
            </div>
          )
        })}
      </div>
      <p className="pl-note">
        В календаре то, что вышло, и то, у чего стоит дата.{undated > 0 && ` Без даты ещё ${undated}: откройте карточку и поставьте дату.`}
      </p>
    </div>
  )
}

function Table({ items, onOpen }: { items: Item[]; onOpen: (i: Item) => void }) {
  const [sort, setSort] = useState<'date' | 'status' | 'title'>('date')
  const order = ['idea', 'plan', 'work', 'ready', 'scheduled', 'published']
  const rows = [...items].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title, 'ru')
    if (sort === 'status') return order.indexOf(a.status) - order.indexOf(b.status)
    return (itemDate(b) || b.updated_at).localeCompare(itemDate(a) || a.updated_at)
  })
  return (
    <div className="pl-table-wrap">
      <table className="pl-table">
        <thead>
          <tr>
            <th><button onClick={() => setSort('title')}>Название</button></th>
            <th>Язык</th>
            <th>Формат</th>
            <th><button onClick={() => setSort('status')}>Статус</button></th>
            <th><button onClick={() => setSort('date')}>Дата</button></th>
            <th>Где вышло</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(i => (
            <tr key={i.id} onClick={() => onOpen(i)}>
              <td className="t">{i.title}</td>
              <td>{i.lang?.toUpperCase() || '—'}</td>
              <td>{i.format ? FORMAT_LABEL[i.format] || i.format : '—'}</td>
              <td><span className={`pl-st st-${i.status}`}>{STATUS_LABEL[i.status] || i.status}</span></td>
              <td className="num">{fmtDate(itemDate(i)) || '—'}</td>
              <td>
                {Object.entries(i.platforms || {}).filter(([k]) => k !== 'sources').map(([k, v]) =>
                  typeof v === 'string'
                    ? <a key={k} href={v} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{PLATFORM_LABEL[k] || k}</a>
                    : <span key={k} className="muted">{PLATFORM_LABEL[k] || k}</span>)}
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={6} className="pl-empty">Ничего не найдено</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function Editor({ it, onClose, onSave, onDelete }: {
  it: Partial<Item>; onClose: () => void; onSave: (i: Partial<Item>) => void; onDelete: (id: string) => void
}) {
  const [f, setF] = useState<Partial<Item>>(it)
  const [confirmDel, setConfirmDel] = useState(false)
  const isNew = !it.id
  const bot = it.source === 'bot'
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  const links = Object.entries(it.platforms || {})
  return (
    <div className="pl-modal-bg" onClick={onClose}>
      <div className="pl-modal" role="dialog" aria-modal="true" aria-label={isNew ? 'Новая идея' : 'Карточка'} onClick={e => e.stopPropagation()}>
        <div className="pl-modal-head">
          <h2>{isNew ? 'Новая идея' : 'Карточка'}</h2>
          <button className="pl-x" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        <label className="pl-field">
          <span>Название</span>
          <textarea rows={2} value={f.title || ''} onChange={e => setF({ ...f, title: e.target.value })} autoFocus={isNew} />
        </label>
        <div className="pl-row">
          <label className="pl-field">
            <span>Язык</span>
            <select value={f.lang || ''} onChange={e => setF({ ...f, lang: (e.target.value || null) as Item['lang'] })}>
              <option value="">—</option><option value="ru">RU</option><option value="en">EN</option>
            </select>
          </label>
          <label className="pl-field">
            <span>Формат</span>
            <select value={f.format || ''} onChange={e => setF({ ...f, format: e.target.value || null })}>
              <option value="">—</option>
              {Object.entries(FORMAT_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
        </div>
        <div className="pl-row">
          <label className="pl-field">
            <span>Статус</span>
            <select value={f.status || 'idea'} onChange={e => setF({ ...f, status: e.target.value })}>
              {Object.entries(STATUS_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          <label className="pl-field">
            <span>Дата публикации</span>
            <input type="datetime-local" value={toLocalInput(f.planned_for || null)}
              onChange={e => setF({ ...f, planned_for: e.target.value ? new Date(e.target.value).toISOString() : null })} />
          </label>
        </div>
        <div className="pl-field">
          <span>Ссылки на источник</span>
          {(f.links && f.links.length ? f.links : ['']).map((u, n) => (
            <div key={n} className="pl-link-row">
              <input type="url" value={u} placeholder="https://claude.ai/... , статья, видео"
                onChange={e => { const l = [...(f.links && f.links.length ? f.links : [''])]; l[n] = e.target.value; setF({ ...f, links: l }) }} />
              {u.trim() && /^https?:\/\//.test(u.trim()) && <a href={u.trim()} target="_blank" rel="noreferrer" className="pl-chip">Открыть ↗</a>}
            </div>
          ))}
          <button type="button" className="pl-link-add" onClick={() => setF({ ...f, links: [...(f.links && f.links.length ? f.links : ['']), ''] })}>+ ещё ссылка</button>
        </div>
        <label className="pl-field">
          <span>Заметки</span>
          <textarea rows={4} value={f.notes || ''} onChange={e => setF({ ...f, notes: e.target.value })}
            placeholder="Тезисы, ссылки, что показать в видео" />
        </label>
        {links.length > 0 && (
          <div className="pl-links">
            {links.map(([k, v]) => k === 'sources' && Array.isArray(v) ? (
              <div key={k} className="pl-sources">
                <span>Откуда тема:</span>
                {v.map((u, n) => <a key={u} href={u} target="_blank" rel="noreferrer">обсуждение {n + 1}</a>)}
              </div>
            ) : typeof v === 'string' ? (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="pl-chip">{PLATFORM_LABEL[k] || k} ↗</a>
            ) : (
              <span key={k} className="pl-chip muted">{PLATFORM_LABEL[k] || k}</span>
            ))}
          </div>
        )}
        {bot && <p className="pl-note">Эту карточку ведёт бот: статус обновится сам, когда публикация пройдёт.</p>}
        <div className="pl-modal-foot">
          {!isNew && (confirmDel ? (
            <span className="pl-del-confirm">
              Убрать карточку?
              <button className="danger" onClick={() => onDelete(it.id!)}>Да, убрать</button>
              <button onClick={() => setConfirmDel(false)}>Нет</button>
            </span>
          ) : (
            <button className="pl-ghost" onClick={() => setConfirmDel(true)}>Убрать</button>
          ))}
          <span className="sp" />
          <button className="pl-ghost" onClick={onClose}>Отмена</button>
          <button className="pl-primary" disabled={!f.title?.trim()} onClick={() => onSave(f)}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}

function LockedTab({ info }: { info: { label: string; text: string } }) {
  return (
    <main className="pl-main">
      <div className="pl-locked">
        <Lock big />
        <h2>{info.label}</h2>
        <p>{info.text}</p>
        <p className="muted">Раздел подключим позже. Сейчас главное — контент.</p>
      </div>
    </main>
  )
}

function Lock({ big }: { big?: boolean }) {
  const s = big ? 28 : 12
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
