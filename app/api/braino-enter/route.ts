import { NextRequest, NextResponse } from 'next/server'
import { BRAINO_COOKIE, guestCookie } from '@/lib/braino'

/** Private preview link: /api/braino-enter?k=<BRAINO_PREVIEW_KEY>&name=<имя> */
export async function GET(req: NextRequest) {
  const k = req.nextUrl.searchParams.get('k') || ''
  const key = process.env.BRAINO_PREVIEW_KEY
  if (!key || k !== key) return new NextResponse('Not found', { status: 404 })
  const name = req.nextUrl.searchParams.get('name') || 'guest'
  const res = NextResponse.redirect(new URL('/braino', req.url))
  res.cookies.set(BRAINO_COOKIE, guestCookie(name), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 180 })
  return res
}
