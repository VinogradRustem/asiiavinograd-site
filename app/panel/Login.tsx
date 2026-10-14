'use client'

import { useState } from 'react'
import './panel.css'

export default function Login() {
  const [user, setUser] = useState('asya')
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr('')
    const r = await fetch('/api/panel/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, password: pw }),
    })
    if (r.ok) { window.location.reload(); return }
    setBusy(false)
    setErr('Пароль не подошёл. Попробуйте ещё раз.')
  }

  return (
    <div className="pl pl-login-wrap">
      <form className="pl-login" onSubmit={submit}>
        <div className="pl-brand">
          <span className="pl-dot" aria-hidden />
          <div>
            <h1>Пульс USMLE</h1>
            <p>Вход для своих</p>
          </div>
        </div>
        <div className="pl-seg pl-who" role="radiogroup" aria-label="Кто входит">
          {([['asya', 'Ася'], ['rustem', 'Рустем']] as const).map(([k, l]) => (
            <button type="button" key={k} role="radio" aria-checked={user === k} className={user === k ? 'on' : ''} onClick={() => setUser(k)}>{l}</button>
          ))}
        </div>
        <label className="pl-field">
          <span>Пароль</span>
          <input type="password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
        </label>
        {err && <p className="pl-login-err" role="alert">{err}</p>}
        <button className="pl-primary" type="submit" disabled={busy || !pw}>{busy ? 'Вхожу…' : 'Войти'}</button>
        <p className="pl-note">Один раз на этом устройстве: дальше панель откроется сама.</p>
      </form>
    </div>
  )
}
