import { NextRequest, NextResponse } from 'next/server';
import { db, ipHash, slugify } from '@/lib/forum';

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const lang = b.lang === 'en' ? 'en' : 'ru';
  const title = String(b.title || '').trim().slice(0, 160);
  const body = String(b.body || '').trim().slice(0, 8000);
  const name = String(b.name || '').trim().slice(0, 60);
  const section = String(b.section || '');
  if (title.length < 8 || body.length < 20 || name.length < 2)
    return NextResponse.json({ error: lang === 'ru' ? 'Заполните заголовок (от 8 символов), вопрос (от 20) и имя.' : 'Please fill in the title (8+ chars), question (20+) and name.' }, { status: 400 });
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ih = ipHash(ip);
  const d = db();
  const { data: sec } = await d.from('forum_sections').select('id').eq('id', section).maybeSingle();
  if (!sec) return NextResponse.json({ error: 'section' }, { status: 400 });
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await d.from('forum_topics').select('id', { count: 'exact', head: true }).eq('ip_hash', ih).gte('created_at', since);
  if ((count || 0) >= 3)
    return NextResponse.json({ error: lang === 'ru' ? 'Слишком много вопросов подряд. Попробуйте через 15 минут.' : 'Too many questions in a row. Try again in 15 minutes.' }, { status: 429 });
  let slug = slugify(title);
  const { data: same } = await d.from('forum_topics').select('id').eq('lang', lang).eq('slug', slug).maybeSingle();
  if (same) slug = `${slug}-${Date.now().toString(36).slice(-5)}`;
  const { error } = await d.from('forum_topics').insert({ section, lang, slug, title, body, author_name: name, author_kind: 'guest', status: 'pending', ip_hash: ih });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
