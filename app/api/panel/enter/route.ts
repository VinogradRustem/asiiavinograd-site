import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { PANEL_COOKIE, panelToken } from '@/lib/panel'

export async function GET(req: NextRequest) {
  const token = panelToken()
  const k = req.nextUrl.searchParams.get('k') || ''
  const given = createHash('sha256').update(`pulse:${k}`).digest('hex')
  if (!token || !k || given !== token) return new NextResponse('Not found', { status: 404 })
  const res = NextResponse.redirect(new URL('/panel', req.url))
  res.cookies.set(PANEL_COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}
