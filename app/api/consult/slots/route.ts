import { NextResponse } from 'next/server';
import { panelDb } from '@/lib/panel';

export const dynamic = 'force-dynamic';

/** Open consultation slots, from 12 hours ahead to 60 days ahead. */
export async function GET() {
  const from = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
  const to = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();
  const { data, error } = await panelDb()
    .from('consult_slots')
    .select('id, starts_at, duration_min')
    .eq('status', 'open')
    .gte('starts_at', from)
    .lte('starts_at', to)
    .order('starts_at')
    .limit(200);
  if (error) return NextResponse.json({ slots: [] }, { status: 500 });
  return NextResponse.json({ slots: data });
}
