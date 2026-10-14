'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Topic = {
  id: number
  lang: 'ru' | 'en'
  segment: string
  topic: string
  yandex: number
  google: number
  demand: number
  trend: number | null
  format: string | null
  intent: string | null
  title: string | null
  angle: string | null
  phrases: string[]
  score: number
}

const FORMAT_LABEL: Record<string, string> = {
  reels: 'Reels', carousel: 'Карусель', threads: 'Threads', lecture: 'Лекция', article: 'Статья ВК', post: 'Пост', other: 'Пост',
}

const SEGMENT_SHORT: Record<string, string> = {
  'Пациенты: сердце и сосуды': 'Сердце и сосуды',
  'Пациенты: общая медицина': 'Общая медицина',
  'Абитуриенты': 'Абитуриенты',
  'Студенты-медики': 'Студенты',
  'Врачи': 'Врачи',
  'USMLE / IMG': 'USMLE',
  'Медицинский английский': 'Мед. английский',
  'Patients: heart': 'Heart',
  'Patients: general': 'General health',
  'Premed / med students': 'Med students',
  'Medical English': 'Medical English',
}

const PICKS = 6

function compact(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.', ',')} млн`
  if (n >= 1e3) return `${Math.round(n / 1e3)} тыс.`
  return String(n)
}

/** Top picks: the best topic of each segment in turn, so one huge segment does not take every slot. */
function pickTop(list: Topic[], n: number) {
  const by = new Map<string, Topic[]>()
  for (const t of list) { if (!by.has(t.segment)) by.set(t.segment, []); by.get(t.segment)!.push(t) }
  const segs = [...by.keys()].sort((a, b) => by.get(b)![0].score - by.get(a)![0].score)
  const out: Topic[] = []
  for (let round = 0; out.length < n && round < 10; round++)
    for (const s of segs) { const t = by.get(s)![round]; if (t && out.length < n) out.push(t) }
  return out
}

export default function Shoot({ onTaken, onOpenBoard }: { onTaken: () => void; onOpenBoard: () => void }) {
  const [lang, setLang] = useState<'ru' | 'en'>('ru')
  const [topics, setTopics] = useState<Topic[]>([])
  const [loaded, setLoaded] = useState(false)
  const [err, setErr] = useState('')
  const [seg, setSeg] = useState<string>('all')
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(20)
  const [busy, setBusy] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    try { const v = localStorage.getItem('pulse_lang'); if (v === 'ru' || v === 'en') setLang(v) } catch {}
  }, [])
  useEffect(() => { try { localStorage.setItem('pulse_lang', lang) } catch {} }, [lang])

  const load = useCallback(async () => {
    setLoaded(false)
    try {
      const r = await fetch(`/api/panel/topics?lang=${lang}`, { cache: 'no-store' })
      if (!r.ok) throw new Error(String(r.status))
      setTopics((await r.json()).topics || [])
      setErr('')
    } catch {
      setErr('Не получилось загрузить темы. Обновите страницу.')
    } finally {
      setLoaded(true)
    }
  }, [lang])
  useEffect(() => { load(); setSeg('all'); setShown(20) }, [load])

  const picks = useMemo(() => pickTop(topics, PICKS), [topics])
  const pickIds = useMemo(() => new Set(picks.map(t => t.id)), [picks])
  const segments = useMemo(() => {
    const m = new Map<string, number>()
    topics.forEach(t => m.set(t.segment, (m.get(t.segment) || 0) + 1))
    return [...m.entries()]
  }, [topics])
  const hotLine = useMemo(() => {
    const d = topics.map(t => t.demand).sort((a, b) => b - a)
    return d[Math.floor(d.length * 0.2)] || Infinity
  }, [topics])

  const rest = useMemo(() => {
    const s = q.trim().toLowerCase()
    return topics.filter(t => !pickIds.has(t.id) && (seg === 'all' || t.segment === seg) &&
      (!s || `${t.topic} ${t.title} ${t.phrases.join(' ')}`.toLowerCase().includes(s)))
  }, [topics, pickIds, seg, q])

  async function act(t: Topic, action: 'take' | 'skip') {
    setBusy(t.id)
    const r = await fetch(`/api/panel/topics/${t.id}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
    })
    setBusy(null)
    if (!r.ok) { setErr('Не сохранилось. Попробуйте ещё раз.'); return }
    setTopics(prev => prev.filter(x => x.id !== t.id))
    if (action === 'take') {
      setToast(`«${t.title || t.topic}» — на доске в колонке «На съёмке»`)
      onTaken()
      setTimeout(() => setToast(''), 5000)
    }
  }

  return (
    <main className="pl-main pl-shoot">
      {err && <div className="pl-err" role="alert">{err}</div>}

      <div className="pl-shoot-head">
        <div>
          <h2>Что снять в ближайшее время</h2>
          <p>Темы, которые люди больше всего ищут в Google и Яндексе. Нажмите «Беру» — тема появится на доске.</p>
        </div>
        <div className="pl-seg" aria-label="Язык">
          {([['ru', 'Русский'], ['en', 'English']] as const).map(([k, l]) => (
            <button key={k} className={lang === k ? 'on' : ''} onClick={() => setLang(k)}>{l}</button>
          ))}
        </div>
      </div>

      {!loaded ? <p className="pl-empty">Загружаю темы…</p> : (
        <>
          <div className="pl-picks">
            {picks.map(t => (
              <article key={t.id} className="pl-pick">
                <div className="pl-tags">
                  <span className="pl-tag fmt">{FORMAT_LABEL[t.format || 'other'] || 'Пост'}</span>
                  <span className="pl-tag">{SEGMENT_SHORT[t.segment] || t.segment}</span>
                  {t.demand >= hotLine && <span className="pl-tag hot">Горячая тема</span>}
                  {t.trend != null && t.trend >= 15 && <span className="pl-tag up">Растёт +{t.trend}%</span>}
                </div>
                <h3>{t.title || t.topic}</h3>
                {t.angle && <p className="pl-angle">{t.angle}</p>}
                <p className="pl-demand">Ищут примерно <b>{compact(t.demand)}</b> раз в месяц</p>
                {open === t.id && t.phrases.length > 0 && (
                  <ul className="pl-phrases">{t.phrases.map(p => <li key={p}>{p}</li>)}</ul>
                )}
                <div className="pl-pick-foot">
                  <button className="pl-primary" disabled={busy === t.id} onClick={() => act(t, 'take')}>Беру</button>
                  <button className="pl-ghost" disabled={busy === t.id} onClick={() => act(t, 'skip')}>Не сейчас</button>
                  {t.phrases.length > 0 && (
                    <button className="pl-link" onClick={() => setOpen(open === t.id ? null : t.id)}>
                      {open === t.id ? 'Скрыть запросы' : 'Что ищут люди'}
                    </button>
                  )}
                </div>
              </article>
            ))}
            {picks.length === 0 && <p className="pl-empty">Все темы разобраны.</p>}
          </div>

          <details className="pl-all">
            <summary>Все темы ({topics.length - picks.length}) — по разделам</summary>
            <div className="pl-bar">
              <div className="pl-chips">
                <button className={seg === 'all' ? 'on' : ''} onClick={() => { setSeg('all'); setShown(20) }}>Все</button>
                {segments.map(([s, n]) => (
                  <button key={s} className={seg === s ? 'on' : ''} onClick={() => { setSeg(s); setShown(20) }}>
                    {SEGMENT_SHORT[s] || s} <span>{n}</span>
                  </button>
                ))}
              </div>
              <input className="pl-search" placeholder="Поиск: давление, ЭКГ, UWorld…" value={q}
                onChange={e => { setQ(e.target.value); setShown(20) }} aria-label="Поиск темы" />
            </div>
            <ul className="pl-list">
              {rest.slice(0, shown).map(t => (
                <li key={t.id}>
                  <div className="pl-list-main">
                    <span className="t">{t.title || t.topic}</span>
                    <span className="m">{FORMAT_LABEL[t.format || 'other'] || 'Пост'} · {SEGMENT_SHORT[t.segment] || t.segment} · ищут {compact(t.demand)}/мес</span>
                  </div>
                  <button className="pl-primary sm" disabled={busy === t.id} onClick={() => act(t, 'take')}>Беру</button>
                </li>
              ))}
            </ul>
            {rest.length > shown && <button className="pl-ghost pl-more" onClick={() => setShown(shown + 20)}>Показать ещё</button>}
            {rest.length === 0 && <p className="pl-empty">Ничего не найдено</p>}
          </details>
        </>
      )}

      {toast && (
        <div className="pl-toast" role="status">
          {toast} <button className="pl-link" onClick={onOpenBoard}>Открыть доску</button>
        </div>
      )}
    </main>
  )
}
