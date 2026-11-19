import { NextRequest, NextResponse } from 'next/server';
import { panelDb } from '@/lib/panel';
import { ipHash } from '@/lib/forum';

const STAGES = ['start', 'step1', 'step2', 'match', 'other'];

/** USMLE Club waitlist: name + Telegram. On launch day everyone on the list gets the payment link. */
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const ru = b.lang !== 'en';
  const t = (r: string, e: string) => (ru ? r : e);
  const name = String(b.name || '').trim().slice(0, 80);
  const telegram = String(b.telegram || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().slice(0, 120);
  const stage = STAGES.includes(b.stage) ? b.stage : 'other';
  if (name.length < 2 || telegram.length < 3)
    return NextResponse.json({ error: t('Укажите имя и Telegram.', 'Please enter your name and contact.') }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: t('Проверьте email.', 'Please check your email.') }, { status: 400 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ih = ipHash(ip);
  const d = panelDb();
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await d.from('club_waitlist').select('id', { count: 'exact', head: true }).eq('ip_hash', ih).gte('created_at', since);
  if ((count || 0) >= 3) return NextResponse.json({ error: t('Слишком много заявок подряд. Попробуйте через час.', 'Too many requests. Please try again in an hour.') }, { status: 429 });

  const { error } = await d.from('club_waitlist').insert({ lang: ru ? 'ru' : 'en', name, telegram, email: email || null, stage, ip_hash: ih });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
