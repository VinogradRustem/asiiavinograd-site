'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type C = {
  id: number; platform: string; account: string; ext_id: string; post_title: string | null; post_url: string | null
  author: string | null; text: string | null; created_at: string; status: string; draft: string | null; reply_text: string | null
  replied_at: string | null; error: string | null
}
type Sync = { key: string; ok: boolean; note: string | null; synced_at: string }
type Data = { items: C[]; sync: Sync[]; counts: Record<string, number>; open: number }

const PLAT: Record<string, { short: string; name: string }> = {
  tg: { short: 'TG', name: 'Telegram-группа' }, yt: { short: 'YT', name: 'YouTube' }, ig: { short: 'IG', name: 'Instagram' },
  th: { short: 'TH', name: 'Threads' }, vk: { short: 'VK', name: 'ВКонтакте' }, fb: { short: 'FB', name: 'Facebook' },
}
const ORDER = ['tg', 'yt', 'ig', 'th', 'vk', 'fb']
const BOXES = [['open', 'Ждут ответа'], ['replied', 'Отвеченные'], ['hidden', 'Скрытые']] as const

function ago(s: string) {
  const m = Math.round((Date.now() - new Date(s).getTime()) / 60000)
  if (m < 1) return 'только что'
  if (m < 60) return `${m} мин назад`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} ч назад`
  return new Date(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

/** What Asiia sees about a platform connection, in plain words. */
function syncText(p: string, rows: Sync[]) {
  if (p === 'tg') return { ok: true, text: 'Сообщения из бесплатной группы приходят сразу' }
  if (!rows.length) return { ok: false, text: 'Ещё не проверялось' }
  if (rows.some(r => r.ok)) return { ok: true, text: rows.filter(r => r.ok).map(r => r.key.endsWith('_en') ? 'EN' : 'RU').join(' + ') + ' подключено' }
  return { ok: false, text: 'Нужно дать доступ к комментариям (Рустем подключит)' }
}

export default function Comments({ onCount }: { onCount?: (n: number) => void }) {
  const [box, setBox] = useState<string>('open')
  const [plat, setPlat] = useState<string>('all')
  const [data, setData] = useState<Data | null>(null)
  const [text, setText] = useState<Record<number, string>>({})
  const [busy, setBusy] = useState<Record<number, boolean>>({})
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/panel/comments?box=${box}`, { cache: 'no-store' })
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Ошибка ${r.status}`)
      const d: Data = await r.json()
      setData(d)
      onCount?.(d.open)
      setErr('')
    } catch (e) { setErr(String((e as Error).message || e)) }
  }, [box, onCount])

  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t) }, [load])

  async function act(c: C, body: Record<string, unknown>) {
    setBusy(b => ({ ...b, [c.id]: true }))
    try {
      const r = await fetch(`/api/panel/comments/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Не получилось')
      setData(d => d && { ...d, items: d.items.map(x => x.id === c.id ? j.item : x) })
      if (body.action === 'send') setTimeout(load, 16000)
    } catch (e) { setErr(String((e as Error).message || e)) }
    setBusy(b => ({ ...b, [c.id]: false }))
  }

  const items = useMemo(() => (data?.items || []).filter(c => plat === 'all' || c.platform === plat), [data, plat])
  const syncBy = (p: string) => (data?.sync || []).filter(s => s.key.startsWith(p + '_'))

  return (
    <div className="cm-wrap">
      <section className="td-hero">
        <div>
          <p className="td-hello">Комментарии из всех соцсетей</p>
          <h2 className="td-date">{data ? (data.open ? `Ждут ответа: ${data.open}` : 'Всё отвечено') : 'Загружаю…'}</h2>
          <p className="td-sub">Черновик ответа уже написан. Поправьте, если нужно, и нажмите «Ответить». Ответ уйдёт от вашего аккаунта.</p>
        </div>
      </section>

      <div className="cm-bar">
        <div className="pl-seg" role="tablist" aria-label="Папка">
          {BOXES.map(([k, l]) => <button key={k} role="tab" aria-selected={box === k} className={box === k ? 'on' : ''} onClick={() => setBox(k)}>{l}</button>)}
        </div>
        <div className="cm-plats">
          <button className={`cm-chip ${plat === 'all' ? 'on' : ''}`} onClick={() => setPlat('all')}>Все</button>
          {ORDER.map(p => (
            <button key={p} className={`cm-chip ${plat === p ? 'on' : ''}`} onClick={() => setPlat(p)} title={PLAT[p].name}>
              <span className={`pl-plat p-${p}`}>{PLAT[p].short}</span>
              {(data?.counts[p] || 0) > 0 && <b>{data!.counts[p]}</b>}
            </button>
          ))}
        </div>
      </div>

      {err && <div className="pl-err" role="alert">{err}</div>}

      <div className="td-grid">
        <div className="td-main">
          {data && items.length === 0 && (
            <div className="td-box cm-empty">
              {box === 'open' ? 'Новых комментариев нет. Они появятся здесь сами, проверка каждые 10 минут.' : 'Здесь пока пусто.'}
            </div>
          )}
          {items.map(c => {
            const val = text[c.id] ?? c.draft ?? ''
            const p = PLAT[c.platform] || { short: c.platform, name: c.platform }
            return (
              <article key={c.id} className={`cm-card st-${c.status}`}>
                <header className="cm-head">
                  <span className={`pl-plat p-${c.platform}`} title={p.name}>{p.short}</span>
                  {c.account === 'en' && <span className="cm-lang">EN</span>}
                  <b className="cm-author">{c.author || 'Без имени'}</b>
                  <span className="cm-time">{ago(c.created_at)}</span>
                </header>
                {c.post_title && (
                  <a className="cm-post" href={c.post_url || undefined} target="_blank" rel="noopener">
                    к публикации: {c.post_title}
                  </a>
                )}
                <p className="cm-text">{c.text}</p>

                {c.status === 'replied' ? (
                  <div className="cm-replied">
                    <span className="td-badge">Отвечено</span>
                    {c.reply_text && <p>{c.reply_text}</p>}
                  </div>
                ) : c.status === 'hidden' || c.status === 'spam' ? (
                  <div className="td-actions cm-actions">
                    <span className="td-muted">{c.status === 'spam' ? 'Похоже на спам, скрыто автоматически' : 'Скрыто'}</span>
                    <button className="td-btn" onClick={() => act(c, { action: 'restore' })}>Вернуть</button>
                  </div>
                ) : (
                  <>
                    <textarea className="cm-reply" rows={Math.min(8, Math.max(3, Math.ceil(val.length / 45)))} value={val}
                      placeholder={c.draft === null ? 'Черновик пишется…' : 'Ваш ответ'}
                      onChange={e => setText(t => ({ ...t, [c.id]: e.target.value }))}
                      disabled={c.status === 'sending'} />
                    {c.status === 'error' && <p className="cm-error">Не отправилось: {c.error}</p>}
                    <div className="td-actions cm-actions">
                      {c.status === 'sending'
                        ? <span className="cm-sending">Отправляется…</span>
                        : <button className="td-btn ok" disabled={!val.trim() || busy[c.id]} onClick={() => act(c, { action: 'send', text: val })}>
                            {c.status === 'error' ? 'Повторить' : 'Ответить'}
                          </button>}
                      <button className="td-btn" disabled={busy[c.id]} onClick={() => act(c, { action: 'done' })} title="Уже ответили сами в приложении">Отвечено</button>
                      <button className="td-btn ghost" disabled={busy[c.id]} onClick={() => act(c, { action: 'hide' })}>Скрыть</button>
                      {c.post_url && <a className="td-btn ghost" href={c.post_url} target="_blank" rel="noopener">Открыть</a>}
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>

        <aside className="td-side">
          <div className="td-box">
            <h3>Откуда приходят</h3>
            <ul className="cm-sync">
              {ORDER.map(p => {
                const s = syncText(p, syncBy(p))
                return (
                  <li key={p}>
                    <span className={`pl-plat p-${p}`}>{PLAT[p].short}</span>
                    <span><b>{PLAT[p].name}</b><br /><span className={s.ok ? 'cm-ok' : 'cm-wait'}>{s.text}</span></span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="td-box">
            <h3>Как это работает</h3>
            <p className="td-muted">Комментарии собираются автоматически. К каждому готовится черновик ответа в вашем стиле. Спам скрывается сам. Ответ публикуется от имени вашего аккаунта в течение 15 секунд после нажатия.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
