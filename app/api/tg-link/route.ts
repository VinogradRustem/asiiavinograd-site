import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { panelDb } from '@/lib/panel';

// Student account → «Connect Telegram»: one-time token, the bot binds the Telegram account and checks club membership.
const BOT = process.env.TG_LINK_BOT || 'asiia_content_ru_bot';

export async function POST(req: NextRequest) {
  const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!jwt) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const d = panelDb();
  const { data: { user } } = await d.auth.getUser(jwt);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  await d.from('tg_link_tokens').delete().eq('user_id', user.id);
  const token = randomBytes(12).toString('hex');
  const { error } = await d.from('tg_link_tokens').insert({ token, user_id: user.id });
  if (error) return NextResponse.json({ error: 'failed' }, { status: 500 });
  return NextResponse.json({ url: `https://t.me/${BOT}?start=link_${token}`, check: `https://t.me/${BOT}?start=check` });
}
