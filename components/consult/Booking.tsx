'use client';
import { useEffect, useMemo, useState } from 'react';

type Slot = { id: string; starts_at: string; duration_min: number };

/** Pick a free time and send the questionnaire. Times are shown in the visitor's own time zone. */
export default function Booking({ lang }: { lang: string }) {
  const ru = lang === 'ru';
  const t = (r: string, e: string) => (ru ? r : e);
  const loc = ru ? 'ru-RU' : 'en-US';
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [day, setDay] = useState('');
  const [pick, setPick] = useState<Slot | null>(null);
  const [f, setF] = useState({ name: '', contact: '', email: '', stage: 'step1', questions: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

  const load = () =>
    fetch('/api/consult/slots', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setSlots(j.slots || []))
      .catch(() => setSlots([]));
  useEffect(() => { load(); }, []);

  const dayKey = (iso: string) => new Date(iso).toLocaleDateString('sv-SE'); // YYYY-MM-DD in local time
  const days = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots || []) {
      const k = dayKey(s.starts_at);
      m.set(k, [...(m.get(k) || []), s]);
    }
    return m;
  }, [slots]);
  useEffect(() => { if (!day && days.size) setDay([...days.keys()][0]); }, [days, day]);

  const fmtDay = (k: string) => new Date(k + 'T12:00:00').toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
  const fmtFull = (iso: string) => new Date(iso).toLocaleString(loc, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pick) return;
    setBusy(true); setErr('');
    const r = await fetch('/api/consult/book', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, slot_id: pick.id, lang }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) setDone(j.starts_at || pick.starts_at);
    else {
      setErr(j.error || t('Не получилось отправить.', 'Could not send.'));
      if (r.status === 409) { setPick(null); load(); }
    }
  };

  const inp = 'w-full rounded-2xl border border-transparent bg-mist/70 px-4 py-3 text-[15px] text-ink placeholder-muted/70 focus:border-steel focus:bg-white focus:outline-none';

  if (done)
    return (
      <div className="card-solid p-7 md:p-9">
        <div className="text-[22px] font-medium text-ink">{t('Заявка отправлена', 'Request sent')}</div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {t('Время', 'Time')}: <b className="text-ink">{fmtFull(done)}</b> ({tz}).{' '}
          {t(
            'Ася подтвердит запись и пришлёт реквизиты для оплаты в течение суток по контакту, который вы указали.',
            'Asiia will confirm your booking and send payment details within 24 hours to the contact you provided.'
          )}
        </p>
      </div>
    );

  return (
    <div className="card-solid p-6 md:p-9">
      <div className="text-[22px] font-medium tracking-[-0.01em] text-ink">{t('1. Выберите время', '1. Pick a time')}</div>
      <p className="mt-1 text-[13px] text-muted">{t('Время показано по вашему часовому поясу', 'Times are shown in your time zone')}: {tz}</p>

      {slots === null ? (
        <p className="mt-6 text-[15px] text-muted">{t('Загружаю свободное время…', 'Loading available times…')}</p>
      ) : slots.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-mist/70 p-5 text-[15px] text-graphite">
          {t('Свободного времени сейчас нет. Напишите в ', 'No free times right now. Message us on ')}
          <a href="https://t.me/usmle_img_community" className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">Telegram</a>
          {t(', и мы подберём время.', ' and we will find a time.')}
        </p>
      ) : (
        <>
          <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2">
            {[...days.keys()].map(k => (
              <button key={k} onClick={() => { setDay(k); setPick(null); }}
                className={`shrink-0 rounded-2xl px-4 py-2.5 text-[14px] transition-colors ${day === k ? 'bg-slate text-white' : 'bg-mist/70 text-graphite hover:bg-mist'}`}>
                {fmtDay(k)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(days.get(day) || []).map(s => (
              <button key={s.id} onClick={() => setPick(s)}
                className={`rounded-full border px-4 py-2 text-[15px] tabular-nums transition-colors ${pick?.id === s.id ? 'border-slate bg-slate text-white' : 'border-ink/10 bg-white text-ink hover:border-slate'}`}>
                {fmtTime(s.starts_at)}
              </button>
            ))}
          </div>
        </>
      )}

      {pick && (
        <form onSubmit={send} className="mt-8 space-y-3 border-t border-ink/10 pt-7">
          <div className="text-[22px] font-medium tracking-[-0.01em] text-ink">{t('2. Расскажите о себе', '2. Tell us about you')}</div>
          <p className="text-[14px] text-muted">{fmtFull(pick.starts_at)}, {pick.duration_min} {t('минут', 'minutes')}</p>
          <input className={inp} placeholder={t('Ваше имя', 'Your name')} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} maxLength={80} required />
          <input className={inp} placeholder={t('Telegram или WhatsApp для связи', 'Telegram or WhatsApp')} value={f.contact} onChange={e => setF({ ...f, contact: e.target.value })} maxLength={120} required />
          <input className={inp} type="email" placeholder={t('Email (необязательно)', 'Email (optional)')} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} maxLength={120} />
          <select className={inp} value={f.stage} onChange={e => setF({ ...f, stage: e.target.value })}>
            <option value="start">{t('Только начинаю путь в USMLE', 'Just starting with USMLE')}</option>
            <option value="step1">{t('Готовлюсь к Step 1', 'Preparing for Step 1')}</option>
            <option value="step2">{t('Готовлюсь к Step 2 CK', 'Preparing for Step 2 CK')}</option>
            <option value="match">{t('Match и резидентура', 'Match and residency')}</option>
            <option value="other">{t('Другое', 'Other')}</option>
          </select>
          <textarea className={`${inp} min-h-[140px] resize-y`} value={f.questions} onChange={e => setF({ ...f, questions: e.target.value })} maxLength={4000} required
            placeholder={t('Ваши вопросы и ситуация: где учились, планируемая дата экзамена, баллы пробных тестов, что не получается', 'Your questions and situation: where you studied, planned exam date, practice test scores, what is not working')} />
          <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button disabled={busy} className="mt-1 rounded-full bg-slate px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-ink disabled:opacity-50">
            {busy ? t('Отправляю…', 'Sending…') : t('Записаться', 'Book')}
          </button>
          <p className="text-[13px] text-muted">{t('Оплата после подтверждения: Ася пришлёт реквизиты.', 'Payment after confirmation: Asiia will send the details.')}</p>
        </form>
      )}
      {!pick && err && <p className="mt-4 text-sm text-red-600">{err}</p>}
    </div>
  );
}
