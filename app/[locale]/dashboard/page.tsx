'use client';
import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { Arrow } from '../../../components/ui';
import LECTURES from '../../../data/lectures.json';

// Student account: profile and exam date, lectures by section with "watched" marks and progress,
// a simple study plan to the exam date, subscription and club access, own consultations, community links.

type Lecture = { yt: string; ru: string; en: string; sections: string[] };
type Profile = { id: string; email: string; full_name: string | null; subscription: string | null; stage: string | null; exam_date: string | null; telegram: string | null; lang: string | null; tg_id?: number | null; tg_username?: string | null; discord_id?: string | null; discord_username?: string | null; club_ru?: boolean; club_en?: boolean; club_checked_at?: string | null };
type Material = { id: number; access: string; lang: string; section_slug: string | null; section_name: string | null; title: string; description: string | null; thumb_url: string | null; yt_id: string | null; duration_sec: number | null; kind: string; created_at: string };
type Booking = { id: string; starts_at: string; stage: string; questions: string };

const TRIBUTE = 'https://t.me/tribute/app?startapp=s18Vt';
const PATREON = 'https://patreon.com/drasiiavinograd';
const FREE_TG = 'https://t.me/usmle_img_community';
const DISCORD = 'https://discord.gg/86urfUgPmF';
const STAGES = ['start', 'step1', 'step2', 'match', 'other'];

export default function Dashboard() {
  const locale = useLocale();
  const t = useTranslations();
  const ru = locale === 'ru';
  const L = (r: string, e: string) => (ru ? r : e);
  const lp = (p: string) => (ru ? `/ru${p}` : p);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', stage: 'step1', exam_date: '', telegram: '' });
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [mats, setMats] = useState<Material[]>([]);
  const [media, setMedia] = useState<Record<number, { video_url: string | null; file_url: string | null }>>({});
  const [player, setPlayer] = useState<{ title: string; video?: string | null; yt?: string | null } | null>(null);
  const [BOT, setBot] = useState('asiia_content_ru_bot');
  useEffect(() => { fetch('/api/tg-link').then((r) => r.json()).then((j) => j.bot && setBot(j.bot)).catch(() => {}); }, []);

  // «Connect Telegram»: the site gets a one-time link, the bot binds the account and checks the club group.
  const connectTg = async () => {
    setLinking(true);
    const w = window.open('', '_blank');
    const { data: { session } } = await supabase.auth.getSession();
    const r = await fetch('/api/tg-link', { method: 'POST', headers: { Authorization: `Bearer ${session?.access_token || ''}` } });
    const j = await r.json().catch(() => ({}));
    setLinking(false);
    if (j.url) { if (w) w.location.href = j.url; else window.location.href = j.url; } else w?.close();
  };
  // Discord (English club): username → the bot DMs a code → code typed here → role «USMLE Club Member» unlocks the club
  const [dc, setDc] = useState({ name: '', code: '', status: '' });
  const pollDc = async (until: string[]) => {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const { data } = await supabase.from('discord_links').select('status').eq('user_id', profile!.id).maybeSingle();
      const st = (data as { status: string } | null)?.status || '';
      if (until.includes(st)) { setDc((d) => ({ ...d, status: st })); return st; }
    }
    setDc((d) => ({ ...d, status: 'timeout' })); return 'timeout';
  };
  const dcSend = async () => {
    if (!dc.name.trim()) return;
    setDc((d) => ({ ...d, status: 'sending' }));
    await supabase.from('discord_links').delete().eq('user_id', profile!.id);
    await supabase.from('discord_links').insert({ user_id: profile!.id, username: dc.name.trim(), status: 'pending' });
    await pollDc(['code_sent', 'not_found', 'dm_closed']);
  };
  const dcVerify = async () => {
    setDc((d) => ({ ...d, status: 'checking' }));
    await supabase.from('discord_links').update({ entered_code: dc.code.trim(), updated_at: new Date().toISOString() }).eq('user_id', profile!.id);
    const st = await pollDc(['verified', 'failed', 'code_sent']);
    if (st === 'verified') await reload();
    else if (st === 'code_sent') setDc((d) => ({ ...d, status: 'wrong' }));
  };
  const reload = async () => {
    const { data: p } = await supabase.from('profiles').select('tg_id,tg_username,club_ru,club_en,club_checked_at,subscription,discord_id,discord_username').eq('id', profile!.id).maybeSingle();
    if (p) setProfile({ ...profile!, ...(p as Partial<Profile>) });
  };

  const sections = useMemo(() => {
    const items = t.raw('curriculum.items') as { title: string; slug: string }[];
    const extra = [{ slug: 'labs', title: L('Расшифровка анализов', 'Lab interpretation') }, { slug: 'cases', title: t('curriculum.cases_title') }];
    const lec = LECTURES as Lecture[];
    // every lecture counted once, in its main section
    return [...items, ...extra].map((s) => ({ ...s, lectures: lec.filter((l) => l.sections[0] === s.slug) })).filter((s) => s.lectures.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
  const total = (LECTURES as Lecture[]).length;

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(lp('/auth')); return; }
      const [{ data: p }, { data: v }, { data: b }] = await Promise.all([
        supabase.from('profiles').select('id,email,full_name,subscription,stage,exam_date,telegram,lang,tg_id,tg_username,club_ru,club_en,club_checked_at,discord_id,discord_username').eq('id', user.id).maybeSingle(),
        supabase.from('lecture_views').select('yt'),
        supabase.from('consult_bookings').select('id,starts_at,stage,questions').order('starts_at', { ascending: false }),
      ]);
      const prof = (p as Profile) || { id: user.id, email: user.email || '', full_name: user.user_metadata?.full_name || null, subscription: 'free', stage: null, exam_date: null, telegram: null, lang: null };
      setProfile(prof);
      setForm({ full_name: prof.full_name || '', stage: prof.stage || 'step1', exam_date: prof.exam_date || '', telegram: prof.telegram || '' });
      setEditing(!prof.stage);
      setWatched(new Set((v || []).map((x: { yt: string }) => x.yt)));
      setBookings((b as Booking[]) || []);
      // materials mirrored from Telegram/Discord: free for everyone, club only shows video to members (RLS on material_media)
      const [{ data: m }, { data: md }] = await Promise.all([
        supabase.from('materials').select('id,access,lang,section_slug,section_name,title,description,thumb_url,yt_id,duration_sec,kind,created_at').order('created_at', { ascending: false }).limit(500),
        supabase.from('material_media').select('material_id,video_url,file_url').limit(1000),
      ]);
      setMats((m as Material[]) || []);
      setMedia(Object.fromEntries(((md as { material_id: number; video_url: string | null; file_url: string | null }[]) || []).map((x) => [x.material_id, x])));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async (yt: string) => {
    const next = new Set(watched);
    if (next.has(yt)) {
      next.delete(yt); setWatched(next);
      await supabase.from('lecture_views').delete().eq('yt', yt);
    } else {
      next.add(yt); setWatched(next);
      await supabase.from('lecture_views').insert({ user_id: profile!.id, yt });
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const upd = { full_name: form.full_name || null, stage: form.stage, exam_date: form.exam_date || null, telegram: form.telegram.replace(/^@/, '') || null, lang: locale, updated_at: new Date().toISOString() };
    await supabase.from('profiles').update(upd).eq('id', profile!.id);
    setProfile({ ...profile!, ...upd });
    setSaving(false); setEditing(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); router.push(lp('/')); };

  if (loading || !profile) return (
    <main className="page-bg flex min-h-screen items-center justify-center"><div className="text-muted">{L('Загрузка…', 'Loading…')}</div></main>
  );

  const club = profile.subscription === 'club' || profile.subscription === 'mentoring' || !!profile.club_ru || !!profile.club_en;
  const done = watched.size;
  const pct = Math.round((done / Math.max(1, total)) * 100);
  const days = profile.exam_date ? Math.ceil((new Date(profile.exam_date).getTime() - Date.now()) / 86400000) : null;
  const left = sections.map((s) => ({ ...s, left: s.lectures.filter((l) => !watched.has(l.yt)).length })).filter((s) => s.left > 0);
  const weeks = days && days > 0 ? Math.max(1, Math.floor(days / 7)) : null;
  const perWeek = weeks ? Math.ceil(left.reduce((a, s) => a + s.left, 0) / weeks) : null;
  const stageName: Record<string, string> = {
    start: L('Только начинаю', 'Just starting'), step1: 'Step 1', step2: 'Step 2 CK', match: L('Match и резидентура', 'Match and residency'), other: L('Другое', 'Other'),
  };
  const inp = 'w-full rounded-2xl border border-transparent bg-mist/60 px-4 py-3 text-[15px] text-ink placeholder-muted/70 focus:border-steel focus:bg-white focus:outline-none';

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-28 md:px-6 md:pt-32">

          {/* header */}
          <div className="card-solid flex flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between md:p-10">
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium uppercase tracking-wide ${club ? 'bg-slate text-white' : 'bg-mist text-slate'}`}>
                {club ? 'USMLE Club' : L('Бесплатный доступ', 'Free access')}
              </span>
              <h1 className="mt-4 text-[34px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[48px]">
                {L('Привет', 'Hi')}{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
              </h1>
              <p className="mt-2 text-muted">
                {profile.stage ? stageName[profile.stage] : ''}{days !== null ? ` · ${days > 0 ? L(`до экзамена ${days} дн.`, `${days} days to the exam`) : L('дата экзамена прошла', 'exam date has passed')}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setEditing(!editing)} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-ink/40">{L('Мои данные', 'My details')}</button>
              <button onClick={signOut} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-muted hover:text-ink">{L('Выйти', 'Sign out')}</button>
            </div>
          </div>

          {/* Discord link + English club access */}
          {!ru && (
            <div className="card mt-3 p-6 md:px-8">
              {profile.discord_id ? (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-[15px]"><span className="font-medium">Discord {profile.discord_username ? `@${profile.discord_username}` : ''} connected</span>
                    <span className="text-muted"> · {profile.club_en ? 'USMLE Club access active' : 'no USMLE Club role yet (it is given by Patreon after you join)'}</span></div>
                  <button onClick={reload} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-ink/40">Refresh</button>
                </div>
              ) : (
                <div>
                  <div className="text-[15px]"><span className="font-medium">Connect Discord</span><span className="text-muted"> · if you joined the USMLE Club on Patreon, club materials will unlock here too. Join our Discord server first.</span></div>
                  {dc.status === 'code_sent' || dc.status === 'checking' || dc.status === 'wrong' ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input value={dc.code} onChange={(e) => setDc({ ...dc, code: e.target.value })} placeholder="6-digit code from the Discord DM" className="w-64 rounded-full bg-mist/60 px-4 py-2.5 text-sm outline-none" />
                      <button onClick={dcVerify} disabled={dc.status === 'checking'} className="rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60" style={{ background: '#5865F2' }}>{dc.status === 'checking' ? 'Checking…' : 'Confirm'}</button>
                      {dc.status === 'wrong' && <span className="text-sm text-red-700">Wrong code, try again.</span>}
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <input value={dc.name} onChange={(e) => setDc({ ...dc, name: e.target.value })} placeholder="Your Discord username" className="w-64 rounded-full bg-mist/60 px-4 py-2.5 text-sm outline-none" />
                      <button onClick={dcSend} disabled={dc.status === 'sending'} className="rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60" style={{ background: '#5865F2' }}>{dc.status === 'sending' ? 'Sending…' : 'Send me a code'}</button>
                      <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="text-sm text-slate">Join our Discord →</a>
                    </div>
                  )}
                  {dc.status === 'not_found' && <p className="mt-2 text-sm text-red-700">We could not find this username on our Discord server. Join the server first, then try again.</p>}
                  {dc.status === 'dm_closed' && <p className="mt-2 text-sm text-red-700">The bot could not DM you. In Discord: server menu → Privacy Settings → allow direct messages, then try again.</p>}
                  {dc.status === 'timeout' && <p className="mt-2 text-sm text-muted">Taking longer than usual, try again in a minute.</p>}
                  {dc.status === 'failed' && <p className="mt-2 text-sm text-red-700">Too many wrong codes. Request a new one.</p>}
                </div>
              )}
            </div>
          )}

          {/* Telegram link + club access */}
          {ru && (
          <div className="card mt-3 flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:px-8">
            {profile.tg_id ? (
              <div className="text-[15px] leading-relaxed">
                <span className="font-medium">Telegram{profile.tg_username ? ` @${profile.tg_username}` : ''} {L('привязан', 'connected')}</span>
                <span className="text-muted"> · {club ? L('доступ к USMLE Club открыт', 'USMLE Club access active') : L('в USMLE Club пока не найден', 'not in the USMLE Club yet')}</span>
              </div>
            ) : (
              <div className="text-[15px] leading-relaxed">
                <span className="font-medium">{L('Привяжите Telegram', 'Connect Telegram')}</span>
                <span className="text-muted"> · {L('если вы в USMLE Club (оплата через Tribute), доступ к клубу откроется и здесь, в кабинете.', 'if you joined the USMLE Club via Telegram (Tribute), club access will unlock here too.')}</span>
              </div>
            )}
            <div className="flex shrink-0 flex-wrap gap-2">
              {profile.tg_id ? (
                <>
                  <a href={`https://t.me/${BOT}?start=check`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">{L('Проверить доступ', 'Check access')}</a>
                  <button onClick={reload} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-ink/40">{L('Обновить', 'Refresh')}</button>
                </>
              ) : (
                <>
                  <button onClick={connectTg} disabled={linking} className="rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60" style={{ background: '#229ED9' }}>{linking ? L('Открываю…', 'Opening…') : L('Привязать Telegram', 'Connect Telegram')}</button>
                  <button onClick={reload} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink hover:border-ink/40">{L('Я привязал(а)', 'Done')}</button>
                </>
              )}
            </div>
          </div>

          )}

          {/* profile / onboarding */}
          {editing && (
            <form onSubmit={save} className="card mt-3 grid gap-4 p-7 md:grid-cols-2 md:p-10">
              <div className="md:col-span-2">
                <h2 className="text-[24px] font-medium tracking-[-0.02em]">{L('Расскажите о себе', 'Tell us about you')}</h2>
                <p className="mt-1 text-[14px] text-muted">{L('По этим данным соберём план подготовки к вашей дате экзамена.', 'We use this to build a study plan for your exam date.')}</p>
              </div>
              <label className="text-[13px] text-muted">{L('Имя', 'Name')}
                <input className={`${inp} mt-1`} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </label>
              <label className="text-[13px] text-muted">{L('Где вы сейчас', 'Where you are now')}
                <select className={`${inp} mt-1`} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s} value={s}>{stageName[s]}</option>)}
                </select>
              </label>
              <label className="text-[13px] text-muted">{L('Дата экзамена (если знаете)', 'Exam date (if you know it)')}
                <input type="date" className={`${inp} mt-1`} value={form.exam_date} onChange={(e) => setForm({ ...form, exam_date: e.target.value })} />
              </label>
              <label className="text-[13px] text-muted">Telegram
                <input className={`${inp} mt-1`} placeholder="@username" value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} />
              </label>
              <div className="md:col-span-2">
                <button disabled={saving} className="rounded-full bg-slate px-6 py-3 text-[15px] font-medium text-white hover:bg-ink disabled:opacity-60">
                  {saving ? '…' : L('Сохранить', 'Save')}
                </button>
              </div>
            </form>
          )}

          {/* progress + plan */}
          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.3fr]">
            <div className="card-dark p-7 md:p-10">
              <span className="text-[13px] text-white/60">{L('Прогресс по лекциям', 'Lecture progress')}</span>
              <div className="mt-4 text-[64px] font-medium leading-none tracking-[-0.04em]">{pct}%</div>
              <p className="mt-2 text-white/60">{L(`${done} из ${total} лекций`, `${done} of ${total} lectures`)}</p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="card p-7 md:p-10">
              <h2 className="text-[24px] font-medium tracking-[-0.02em]">{L('Мой план', 'My plan')}</h2>
              {!left.length ? (
                <p className="mt-3 text-muted">{L('Все лекции просмотрены. Переходите к разборам задач и Anki-карточкам.', 'All lectures watched. Move on to question walkthroughs and Anki decks.')}</p>
              ) : (
                <>
                  <p className="mt-2 text-[14px] text-muted">
                    {perWeek
                      ? L(`Чтобы успеть к экзамену: примерно ${perWeek} лекц. в неделю, по разделам в этом порядке.`, `To be ready by the exam: about ${perWeek} lectures a week, sections in this order.`)
                      : L('Укажите дату экзамена в «Мои данные», и план разложится по неделям. Пока порядок разделов:', 'Add your exam date in “My details” to get a weekly plan. Section order for now:')}
                  </p>
                  <ol className="mt-4 list-none space-y-2 pl-0">
                    {left.slice(0, 6).map((s, i) => (
                      <li key={s.slug} className="flex items-center justify-between gap-3 rounded-2xl bg-mist/60 px-4 py-3">
                        <span className="text-[15px]"><span className="text-steel">{i + 1}.</span> {s.title}</span>
                        <span className="shrink-0 text-[13px] text-muted">{L(`осталось ${s.left}`, `${s.left} left`)}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>

          {/* lectures by section */}
          <h2 className="mt-12 text-[28px] font-medium tracking-[-0.02em] md:text-[34px]">{L('Лекции по разделам', 'Lectures by section')}</h2>
          {!ru && <p className="mt-1 text-[14px] text-muted">These lectures are in Russian. English versions are coming to @USMLEforIMG.</p>}
          <div className="mt-5 space-y-3">
            {sections.map((s) => {
              const w = s.lectures.filter((l) => watched.has(l.yt)).length;
              const isOpen = open === s.slug;
              return (
                <div key={s.slug} className="card overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : s.slug)} className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6">
                    <div className="min-w-0">
                      <div className="text-[19px] font-medium">{s.title}</div>
                      <div className="mt-2 h-2 w-48 max-w-full overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-slate" style={{ width: `${(w / s.lectures.length) * 100}%` }} /></div>
                    </div>
                    <span className="shrink-0 text-[14px] text-muted">{w}/{s.lectures.length} {isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="grid gap-3 border-t border-ink/5 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-5">
                      {s.lectures.map((l) => {
                        const seen = watched.has(l.yt);
                        return (
                          <div key={l.yt} className={`flex flex-col overflow-hidden rounded-[20px] bg-white/70 ${seen ? 'opacity-70' : ''}`}>
                            <button onClick={() => { const fm = mats.find((x) => x.yt_id === l.yt); setPlayer({ title: ru ? l.ru : l.en, video: fm ? media[fm.id]?.video_url : null, yt: l.yt }); }}
                              className="relative block aspect-video overflow-hidden bg-mist">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={mats.find((x) => x.yt_id === l.yt)?.thumb_url || `https://i.ytimg.com/vi/${l.yt}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                              <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow">▶</span></span>
                            </button>
                            <div className="flex flex-1 flex-col p-4">
                              <div className="flex-1 text-[15px] font-medium leading-snug">{ru ? l.ru : l.en}</div>
                              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[14px] text-slate">
                                <input type="checkbox" checked={seen} onChange={() => toggle(l.yt)} className="h-4 w-4 accent-[#3f6b78]" />
                                {L('Посмотрел(а)', 'Watched')}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* USMLE Club materials, mirrored from the club topics in Telegram (RU) / Discord (EN) */}
          {(() => {
            const key = ru ? 'club_ru' : 'club_en';
            const list = mats.filter((x) => x.access === key);
            const groups = Array.from(new Set(list.map((x) => x.section_name || L('Разное', 'Other'))));
            return (
              <div className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 className="text-[28px] font-medium tracking-[-0.02em] md:text-[34px]">{L('Материалы USMLE Club', 'USMLE Club materials')}</h2>
                  {!club && <a href={ru ? TRIBUTE : PATREON} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">{L('Вступить в клуб', 'Join the club')}</a>}
                </div>
                <p className="mt-1 text-[14px] text-muted">
                  {club ? L('Всё, что Ася публикует в клубе, появляется здесь автоматически, по разделам. Можно смотреть здесь или в Telegram — как удобнее.', 'Everything posted in the club appears here automatically, by section.')
                    : L('Лекции клуба по разделам Step 1. Откроются после вступления в клуб и привязки Telegram.', 'Club lessons by Step 1 section. Unlocked after joining the club.')}
                </p>
                {list.length === 0 ? (
                  <div className="card mt-5 p-6 text-[15px] text-muted">{L('Первые лекции клуба появятся здесь сразу после публикации.', 'The first club lessons will appear here right after they are posted.')}</div>
                ) : (
                  <div className="mt-5 space-y-6">
                    {groups.map((g) => (
                      <div key={g}>
                        <div className="text-[17px] font-medium">{g}</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {list.filter((x) => (x.section_name || L('Разное', 'Other')) === g).map((x) => {
                            const v = media[x.id]?.video_url;
                            const k = `m:${x.id}`;
                            const seen = watched.has(k);
                            return (
                              <div key={x.id} className={`flex flex-col overflow-hidden rounded-[20px] bg-white/70 ${seen ? 'opacity-70' : ''}`}>
                                <button disabled={!v} onClick={() => setPlayer({ title: x.title, video: v })} className="relative block aspect-video overflow-hidden bg-mist disabled:cursor-not-allowed">
                                  {x.thumb_url ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={x.thumb_url} alt="" loading="lazy" className="h-full w-full object-cover" />) : null}
                                  <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-ink shadow">{v ? '▶' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>}</span></span>
                                </button>
                                <div className="flex flex-1 flex-col p-4">
                                  <div className="flex-1 text-[15px] font-medium leading-snug">{x.title}</div>
                                  {x.duration_sec ? <div className="mt-1 text-[12.5px] text-muted">{Math.round(x.duration_sec / 60)} {L('мин', 'min')}</div> : null}
                                  {v && (
                                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[14px] text-slate">
                                      <input type="checkbox" checked={seen} onChange={() => toggle(k)} className="h-4 w-4 accent-[#3f6b78]" />
                                      {L('Посмотрел(а)', 'Watched')}
                                    </label>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {player && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-3" onClick={() => setPlayer(null)}>
              <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-2 flex items-center justify-between gap-3 text-white">
                  <div className="truncate text-[15px] font-medium">{player.title}</div>
                  <button onClick={() => setPlayer(null)} className="rounded-full bg-white/15 px-4 py-1.5 text-sm">{L('Закрыть', 'Close')}</button>
                </div>
                <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                  {player.video ? (
                    <video src={player.video} controls autoPlay playsInline className="h-full w-full" />
                  ) : player.yt ? (
                    <iframe src={`https://www.youtube-nocookie.com/embed/${player.yt}?autoplay=1`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="h-full w-full" />
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* club, consultations, community */}
          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            <div className="flex flex-col rounded-[28px] bg-steel p-7 text-white md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">USMLE Club</h3>
              {club ? (
                <>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/75">{L('Вы в клубе. Лекции клуба — в разделе «Материалы USMLE Club» выше и в закрытой группе в Telegram.', 'You are in the club. Lessons, walkthroughs, PDFs and Anki are in the private community.')}</p>
                  <a href={ru ? TRIBUTE : DISCORD} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-medium">{L('Открыть клуб', 'Open the club')} <Arrow /></a>
                </>
              ) : (
                <>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/75">
                    {L('2 занятия в неделю по разделам Step 1, разборы задач, медицинский английский по воскресеньям, PDF и Anki, ответы Аси на ваши вопросы.',
                      '2 lessons a week by Step 1 section, question walkthroughs, Sunday medical English, PDFs and Anki, answers from Dr. Vinograd.')}
                  </p>
                  <a href={ru ? TRIBUTE : PATREON} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-medium">{L('Вступить в клуб', 'Join the club')} <Arrow /></a>
                </>
              )}
            </div>
            <div className="card-solid flex flex-col p-7 md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">{L('Мои консультации', 'My sessions')}</h3>
              {bookings.length ? (
                <ul className="mt-4 flex-1 space-y-2">
                  {bookings.slice(0, 4).map((b) => (
                    <li key={b.id} className="rounded-2xl bg-mist/60 px-4 py-3 text-[14px]">
                      {new Date(b.starts_at).toLocaleString(ru ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      <span className="text-muted"> · {stageName[b.stage] || b.stage}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{L('Личный разбор: план подготовки под ваш уровень и сроки.', 'One-on-one: a study plan for your level and timeline.')}</p>
              )}
              <a href={lp('/consultation')} className="mt-6 inline-flex items-center gap-2 font-medium text-ink">{L('Записаться', 'Book a session')} <Arrow /></a>
            </div>
            <div className="card flex flex-col p-7 md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">{L('Сообщество', 'Community')}</h3>
              <ul className="mt-4 flex-1 space-y-3 text-[15px]">
                <li><a href={FREE_TG} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-slate">{L('Бесплатная группа в Telegram', 'Free Telegram community')} <Arrow /></a></li>
                <li><a href={lp('/forum')} className="inline-flex items-center gap-2 hover:text-slate">{L('Форум: вопросы и ответы', 'Forum: questions and answers')} <Arrow /></a></li>
                <li><a href={lp('/anki')} className="inline-flex items-center gap-2 hover:text-slate">{L('Anki-карточки', 'Anki decks')} <Arrow /></a></li>
                <li><a href={lp('/blog')} className="inline-flex items-center gap-2 hover:text-slate">{L('Блог', 'Blog')} <Arrow /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
