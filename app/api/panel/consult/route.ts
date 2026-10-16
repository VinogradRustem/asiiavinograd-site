import { NextRequest, NextResponse } from 'next/server';
import { isPanelAuthed, panelDb } from '@/lib/panel';

export const dynamic = 'force-dynamic';
const STATUSES = ['new', 'confirmed', 'paid', 'done', 'cancelled'];

export async function GET() {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 });
  const d = panelDb();
  const from = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const [slots, bookings] = await Promise.all([
    d.from('consult_slots').select('*').gte('starts_at', from).order('starts_at').limit(500),
    d.from('consult_bookings').select('*').order('created_at', { ascending: false }).limit(200),
  ]);
  if (slots.error || bookings.error) return NextResponse.json({ error: (slots.error || bookings.error)?.message }, { status: 500 });
  return NextResponse.json({ slots: slots.data, bookings: bookings.data });
}

/** Add free slots: { starts: ISO[], duration_min } */
export async function POST(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 });
  const b = await req.json().catch(() => ({}));
  const dur = [30, 45, 60, 90].includes(Number(b.duration_min)) ? Number(b.duration_min) : 60;
  const starts: string[] = (Array.isArray(b.starts) ? b.starts : [])
    .map((s: unknown) => new Date(String(s)))
    .filter((dt: Date) => !isNaN(dt.getTime()) && dt.getTime() > Date.now())
    .slice(0, 100)
    .map((dt: Date) => dt.toISOString());
  if (!starts.length) return NextResponse.json({ error: 'no future times' }, { status: 400 });
  const { error } = await panelDb()
    .from('consult_slots')
    .upsert(starts.map(s => ({ starts_at: s, duration_min: dur })), { onConflict: 'starts_at', ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, added: starts.length });
}

/** Change a booking status: { booking_id, status, free_slot? } */
export async function PATCH(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 });
  const b = await req.json().catch(() => ({}));
  if (!STATUSES.includes(b.status)) return NextResponse.json({ error: 'status' }, { status: 400 });
  const d = panelDb();
  const { data, error } = await d.from('consult_bookings').update({ status: b.status }).eq('id', String(b.booking_id)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (b.status === 'cancelled' && b.free_slot && data.slot_id) await d.from('consult_slots').update({ status: 'open' }).eq('id', data.slot_id);
  return NextResponse.json({ booking: data });
}

/** Remove an open slot: ?slot=<id> */
export async function DELETE(req: NextRequest) {
  if (!(await isPanelAuthed())) return new NextResponse('Not found', { status: 404 });
  const id = req.nextUrl.searchParams.get('slot') || '';
  const { error } = await panelDb().from('consult_slots').delete().eq('id', id).eq('status', 'open');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
