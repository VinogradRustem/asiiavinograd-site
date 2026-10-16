'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Slot = { id: string; starts_at: string; duration_min: number; status: string }
type Booking = {
  id: string; slot_id: string | null; starts_at: string | null; lang: string; name: string; contact: string
  email: string | null; stage: string | null; questions: string | null; status: string; created_at: string
}

const STAGE: Record<string, string> = { start: 'Только начинает', step1: 'Step 1', step2: 'Step 2 CK', match: 'Match и резидентура', other: 'Другое' }
const STATUS: [string, string][] = [['new', 'Новая'], ['confirmed', 'Подтверждена'], ['paid', 'Оплачена'], ['done', 'Проведена'], ['cancelled', 'Отменена']]

const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
const contactUrl = (c: string) => {
  const s = c.trim()
  if (/^https?:\/\//i.test(s)) return s
  if (/^@?[a-z0-9_]{4,}$/i.test(s)) return `https://t.me/${s.replace(/^@/, '')}`
  const digits = s.replace(/[^\d]/g, '')
  if (digits.length >= 9) return `https://wa.me/${digits}`
  return null
}

export default function Consult() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [err, setErr] = useState('')
  const [date, setDate] = useState('')
  const [times, setTimes] = useState('10:00, 14:00')
  const [weeks, setWeeks] = useState(1)
  const [dur, setDur] = useState(60)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/panel/consult', { cache: 'no-store' })
      if (!r.ok) throw new Error()
      const j = await r.json()
      setSlots(j.slots || []); setBookings(j.bookings || []); setErr('')
    } catch { setErr('Не удалось загрузить консультации') }
  }, [])
  useEffect(() => { load() }, [load])

  async function addSlots(e: React.FormEvent) {
    e.preventDefault()
    const ts = times.split(/[,\s]+/).map(s => s.trim()).filter(s => /^\d{1,2}:\d{2}$/.test(s))
    if (!date || !ts.length) { setErr('Укажите дату и время, например 10:00, 14:30'); return }
    const starts: string[] = []
    for (let w = 0; w < weeks; w++) {
      for (const tm of ts) {
        const [h, m] = tm.split(':').map(Number)
        const d = new Date(`${date}T00:00:00`)
        d.setDate(d.getDate() + 7 * w); d.setHours(h, m, 0, 0)
        starts.push(d.toISOString())
      }
    }
    setBusy(true)
    const r = await fetch('/api/panel/consult', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ starts, duration_min: dur }) })
    setBusy(false)
    if (!r.ok) setErr('Не удалось добавить время (проверьте, что оно в будущем)')
    else { setErr(''); load() }
  }

  async function removeSlot(id: string) {
    setSlots(s => s.filter(x => x.id !== id))
    await fetch(`/api/panel/consult?slot=${id}`, { method: 'DELETE' })
  }

  async function setStatus(b: Booking, status: string) {
    let free = false
    if (status === 'cancelled') free = window.confirm('Освободить это время, чтобы на него мог записаться кто-то другой?')
    setBookings(bs => bs.map(x => (x.id === b.id ? { ...x, status } : x)))
    const r = await fetch('/api/panel/consult', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking_id: b.id, status, free_slot: free }) })
    if (!r.ok) setErr('Не удалось сохранить статус')
    if (free) load()
  }

  const upcoming = useMemo(() => slots.filter(s => new Date(s.starts_at).getTime() > Date.now()), [slots])
  const byDay = useMemo(() => {
    const m = new Map<string, Slot[]>()
    for (const s of upcoming) { const k = new Date(s.starts_at).toLocaleDateString('sv-SE'); m.set(k, [...(m.get(k) || []), s]) }
    return [...m.entries()]
  }, [upcoming])
  const active = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'done')
  const past = bookings.filter(b => b.status === 'cancelled' || b.status === 'done')

  const BookingCard = ({ b }: { b: Booking }) => {
    const url = contactUrl(b.contact)
    return (
      <li className="pl-cb">
        <div className="pl-cb-top">
          <div>
            <div className="pl-cb-when">{b.starts_at ? `${fmtDay(b.starts_at)}, ${fmtTime(b.starts_at)}` : 'Время освобождено'}</div>
            <div className="pl-cb-name">{b.name} · {b.lang === 'en' ? 'EN' : 'RU'} · {STAGE[b.stage || 'other']}</div>
          </div>
          <select value={b.status} onChange={e => setStatus(b, e.target.value)} aria-label="Статус">
            {STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div className="pl-cb-contact">
          {url ? <a href={url} target="_blank" rel="noopener noreferrer">{b.contact} ↗</a> : b.contact}
          {b.email && <> · <a href={`mailto:${b.email}`}>{b.email}</a></>}
        </div>
        {b.questions && <p className="pl-cb-q">{b.questions}</p>}
      </li>
    )
  }

  return (
    <main className="pl-main">
      {err && <div className="pl-err" role="alert">{err}</div>}
      <div className="pl-tasks">
        <section className="pl-task-col">
          <header><h2>Записи</h2><span className="pl-count">{active.length} активных</span></header>
          <p className="pl-hint">Страница записи: <a href="/ru/consultation" target="_blank">drasiiavinograd.com/ru/consultation</a>. Когда кто-то записывается, приходит уведомление в Telegram.</p>
          {active.length === 0 ? <p className="pl-empty">Пока никто не записался</p> : <ul className="pl-cb-list">{active.map(b => <BookingCard key={b.id} b={b} />)}</ul>}
          {past.length > 0 && (
            <details className="pl-cb-past">
              <summary>Проведённые и отменённые ({past.length})</summary>
              <ul className="pl-cb-list">{past.map(b => <BookingCard key={b.id} b={b} />)}</ul>
            </details>
          )}
        </section>

        <section className="pl-task-col">
          <header><h2>Свободное время</h2><span className="pl-count">{upcoming.filter(s => s.status === 'open').length} окон</span></header>
          <form className="pl-slot-add" onSubmit={addSlots}>
            <label>Дата<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
            <label>Время (через запятую)<input value={times} onChange={e => setTimes(e.target.value)} placeholder="10:00, 14:30" /></label>
            <label>Повторять
              <select value={weeks} onChange={e => setWeeks(Number(e.target.value))}>
                <option value={1}>только этот день</option>
                {[2, 3, 4, 6, 8, 12].map(n => <option key={n} value={n}>каждую неделю, {n} нед.</option>)}
              </select>
            </label>
            <label>Длительность
              <select value={dur} onChange={e => setDur(Number(e.target.value))}>
                {[30, 45, 60, 90].map(n => <option key={n} value={n}>{n} мин</option>)}
              </select>
            </label>
            <button type="submit" disabled={busy}>{busy ? 'Добавляю…' : 'Добавить время'}</button>
          </form>
          <p className="pl-hint">Время указывается по часам вашего устройства. Клиент увидит его в своём часовом поясе.</p>
          {byDay.length === 0 ? <p className="pl-empty">Добавьте свободное время, и оно появится на сайте</p> : (
            <ul className="pl-slot-days">
              {byDay.map(([k, ss]) => (
                <li key={k}>
                  <div className="pl-slot-day">{fmtDay(ss[0].starts_at)}</div>
                  <div className="pl-slot-row">
                    {ss.map(s => (
                      <span key={s.id} className={`pl-slot ${s.status}`}>
                        {fmtTime(s.starts_at)}{s.status === 'booked' ? ' · занято' : ''}
                        {s.status === 'open' && <button onClick={() => removeSlot(s.id)} aria-label="Убрать время">×</button>}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
