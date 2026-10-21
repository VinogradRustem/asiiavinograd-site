import { NextRequest, NextResponse } from 'next/server';
import { panelDb } from '@/lib/panel';
import { ipHash } from '@/lib/forum';

// Contact form lead: saved in the database first (nothing is lost if Telegram is down), then a notification.
// Bot token and chat come from Vercel env (TELEGRAM_LEADS_TOKEN, TELEGRAM_LEADS_CHAT), never from the code.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ success: true }); // honeypot
  const cut = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);
  const name = cut(b.name, 80);
  const whatsapp = cut(`${b.countryCode || ''}${b.whatsapp || ''}`, 40);
  const email = cut(b.email, 120);
  const telegram = cut(b.telegram, 60);
  const message = cut(b.message, 4000);
  const lang = b.lang === 'ru' || (req.headers.get('referer') || '').includes('/ru') ? 'ru' : 'en';
  if (!name || !cut(b.whatsapp, 40)) {
    return NextResponse.json({ error: 'Name and WhatsApp are required' }, { status: 400 });
  }

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ih = ipHash(ip);
  const d = panelDb();
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await d.from('site_leads').select('id', { count: 'exact', head: true }).eq('ip_hash', ih).gte('created_at', since);
  if ((count || 0) >= 5) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const { data: lead, error } = await d
    .from('site_leads')
    .insert({ lang, name, whatsapp, email: email || null, telegram: telegram || null, message: message || null, ip_hash: ih })
    .select('id')
    .maybeSingle();
  if (error) console.error('lead insert', error.message);

  // plain text: user input with * or _ used to break Markdown and the lead was silently lost
  const text = [
    `Новая заявка с drasiiavinograd.com (${lang.toUpperCase()})${lead ? ` #${lead.id}` : ''}`,
    '',
    `Имя: ${name}`,
    `WhatsApp: ${whatsapp}`,
    email && `Email: ${email}`,
    telegram && `Telegram: ${telegram}`,
    message && `Сообщение: ${message}`,
    '',
    new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bangkok' }) + ' (Пхукет)',
  ].filter((x) => x !== '' && x !== null && x !== undefined && x !== false).join('\n');

  const token = process.env.TELEGRAM_LEADS_TOKEN;
  const chat = process.env.TELEGRAM_LEADS_CHAT;
  let notified = false;
  if (token && chat) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text }),
      });
      notified = r.ok;
      if (!r.ok) console.error('telegram', r.status, await r.text());
    } catch (e) {
      console.error('telegram', e);
    }
  }
  if (!lead && !notified) return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  return NextResponse.json({ success: true });
}
