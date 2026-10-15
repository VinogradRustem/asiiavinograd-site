import { NextRequest, NextResponse } from 'next/server';
import { db, ipHash } from '@/lib/forum';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const lang = b.lang === 'en' ? 'en' : 'ru';
  const body = String(b.body || '').trim().slice(0, 8000);
  const name = String(b.name || '').trim().slice(0, 60);
  const topicId = Number(b.topic_id);
  if (!topicId || body.length < 5 || name.length < 2)
    return NextResponse.json({ error: lang === 'ru' ? 'Напишите ответ и имя.' : 'Please write your answer and name.' }, { status: 400 });
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ih = ipHash(ip);
  const d = db();
  const { data: t } = await d.from('forum_topics').select('id').eq('id', topicId).eq('status', 'published').maybeSingle();
  if (!t) return NextResponse.json({ error: 'topic' }, { status: 404 });
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await d.from('forum_posts').select('id', { count: 'exact', head: true }).eq('ip_hash', ih).gte('created_at', since);
  if ((count || 0) >= 6)
    return NextResponse.json({ error: lang === 'ru' ? 'Слишком много ответов подряд. Попробуйте позже.' : 'Too many replies in a row. Try again later.' }, { status: 429 });
  const { error } = await d.from('forum_posts').insert({ topic_id: topicId, body, author_name: name, author_kind: 'guest', status: 'pending', ip_hash: ih });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
