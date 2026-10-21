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
type Profile = { id: string; email: string; full_name: string | null; subscription: string | null; stage: string | null; exam_date: string | null; telegram: string | null; lang: string | null };
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
        supabase.from('profiles').select('id,email,full_name,subscription,stage,exam_date,telegram,lang').eq('id', user.id).maybeSingle(),
        supabase.from('lecture_views').select('yt'),
        supabase.from('consult_bookings').select('id,starts_at,stage,questions').order('starts_at', { ascending: false }),
      ]);
      const prof = (p as Profile) || { id: user.id, email: user.email || '', full_name: user.user_metadata?.full_name || null, subscription: 'free', stage: null, exam_date: null, telegram: null, lang: null };
      setProfile(prof);
      setForm({ full_name: prof.full_name || '', stage: prof.stage || 'step1', exam_date: prof.exam_date || '', telegram: prof.telegram || '' });
      setEditing(!prof.stage);
      setWatched(new Set((v || []).map((x: { yt: string }) => x.yt)));
      setBookings((b as Booking[]) || []);
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

  const club = profile.subscription === 'club' || profile.subscription === 'mentoring';
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
                  <ol className="mt-4 space-y-2">
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
                            <a href={`https://www.youtube.com/watch?v=${l.yt}`} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden bg-mist">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`https://i.ytimg.com/vi/${l.yt}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                            </a>
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

          {/* club, consultations, community */}
          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            <div className="flex flex-col rounded-[28px] bg-steel p-7 text-white md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">USMLE Club</h3>
              {club ? (
                <>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/75">{L('Вы в клубе. Занятия по разделам, разборы, PDF и Anki в закрытой группе.', 'You are in the club. Lessons, walkthroughs, PDFs and Anki are in the private community.')}</p>
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
