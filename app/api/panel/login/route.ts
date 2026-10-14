import { NextRequest, NextResponse } from 'next/server'
import { PANEL_COOKIE, checkLogin, sessionValue } from '@/lib/panel'

export async function POST(req: NextRequest) {
  const { user, password } = await req.json().catch(() => ({}))
  if (typeof user !== 'string' || typeof password !== 'string' || !checkLogin(user, password)) {
    await new Promise(r => setTimeout(r, 800)) // slow down guessing
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(PANEL_COOKIE, sessionValue(user), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(PANEL_COOKIE, '', { path: '/', maxAge: 0 })
  return res
}
