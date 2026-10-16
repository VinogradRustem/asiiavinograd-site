import { NextRequest, NextResponse } from 'next/server';
import { panelDb } from '@/lib/panel';
import { ipHash } from '@/lib/forum';

const STAGES = ['start', 'step1', 'step2', 'match', 'other'];

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const ru = b.lang !== 'en';
  const t = (r: string, e: string) => (ru ? r : e);
  const name = String(b.name || '').trim().slice(0, 80);
  const contact = String(b.contact || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().slice(0, 120);
  const questions = String(b.questions || '').trim().slice(0, 4000);
  const stage = STAGES.includes(b.stage) ? b.stage : 'other';
  const slotId = String(b.slot_id || '');
  if (!slotId) return NextResponse.json({ error: t('Выберите время.', 'Please pick a time.') }, { status: 400 });
  if (name.length < 2 || contact.length < 3 || questions.length < 20)
    return NextResponse.json({ error: t('Заполните имя, контакт и вопросы (от 20 символов).', 'Please fill in your name, contact and questions (20+ characters).') }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: t('Проверьте email.', 'Please check your email.') }, { status: 400 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ih = ipHash(ip);
  const d = panelDb();
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await d.from('consult_bookings').select('id', { count: 'exact', head: true }).eq('ip_hash', ih).gte('created_at', since);
  if ((count || 0) >= 3) return NextResponse.json({ error: t('Слишком много заявок подряд. Попробуйте через час.', 'Too many requests. Please try again in an hour.') }, { status: 429 });

  // Take the slot only if it is still open: two people cannot book the same time.
  const { data: slot } = await d
    .from('consult_slots')
    .update({ status: 'booked' })
    .eq('id', slotId)
    .eq('status', 'open')
    .gt('starts_at', new Date().toISOString())
    .select('id, starts_at')
    .maybeSingle();
  if (!slot) return NextResponse.json({ error: t('Это время уже заняли. Выберите другое.', 'This time was just taken. Please pick another.') }, { status: 409 });

  const { error } = await d.from('consult_bookings').insert({
    slot_id: slot.id, starts_at: slot.starts_at, lang: ru ? 'ru' : 'en', name, contact, email: email || null, stage, questions, ip_hash: ih,
  });
  if (error) {
    await d.from('consult_slots').update({ status: 'open' }).eq('id', slot.id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, starts_at: slot.starts_at });
}
