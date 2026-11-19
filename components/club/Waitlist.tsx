'use client';
import { useState } from 'react';

/** Waitlist form for USMLE Club: the early price is kept for everyone on the list. */
export default function Waitlist({ lang }: { lang: string }) {
  const ru = lang === 'ru';
  const t = (r: string, e: string) => (ru ? r : e);
  const [f, setF] = useState({ name: '', telegram: '', email: '', stage: 'step1', website: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const inp = 'w-full rounded-2xl border border-transparent bg-mist/70 px-4 py-3 text-[15px] text-ink placeholder-muted/70 focus:border-steel focus:bg-white focus:outline-none';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const r = await fetch('/api/club/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, lang }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) setDone(true);
      else setErr(j.error || t('Не получилось отправить. Попробуйте ещё раз.', 'Could not send. Please try again.'));
    } catch {
      setErr(t('Не получилось отправить. Попробуйте ещё раз.', 'Could not send. Please try again.'));
    }
    setBusy(false);
  };

  if (done)
    return (
      <div className="card-solid p-7 md:p-9">
        <div className="text-[22px] font-medium text-ink">{t('Вы в списке', 'You are on the list')}</div>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {t(
            'В день запуска клуба мы пришлём вам ссылку на вступление по цене $35 в месяц. Цена сохранится за вами.',
            'On launch day we will send you the link to join at $35 a month. The price stays yours.'
          )}
        </p>
      </div>
    );

  return (
    <form onSubmit={send} className="card-solid space-y-3 p-6 md:p-9">
      <div className="text-[22px] font-medium tracking-[-0.01em] text-ink">{t('Записаться в лист ожидания', 'Join the waitlist')}</div>
      <p className="text-[14px] text-muted">{t('Без оплаты сейчас. Ссылку пришлём в день запуска.', 'No payment now. We will send the link on launch day.')}</p>
      <input className={inp} placeholder={t('Ваше имя', 'Your name')} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} maxLength={80} required />
      <input className={inp} placeholder={t('Telegram, например @username', 'Telegram, WhatsApp or Discord')} value={f.telegram} onChange={e => setF({ ...f, telegram: e.target.value })} maxLength={120} required />
      <input className={inp} type="email" placeholder={t('Email (необязательно)', 'Email (optional)')} value={f.email} onChange={e => setF({ ...f, email: e.target.value })} maxLength={120} />
      <select className={inp} value={f.stage} onChange={e => setF({ ...f, stage: e.target.value })}>
        <option value="start">{t('Только начинаю путь в USMLE', 'Just starting with USMLE')}</option>
        <option value="step1">{t('Готовлюсь к Step 1', 'Preparing for Step 1')}</option>
        <option value="step2">{t('Готовлюсь к Step 2 CK', 'Preparing for Step 2 CK')}</option>
        <option value="match">{t('Match и резидентура', 'Match and residency')}</option>
        <option value="other">{t('Другое', 'Other')}</option>
      </select>
      <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className="mt-1 rounded-full bg-slate px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-ink disabled:opacity-50">
        {busy ? t('Отправляю…', 'Sending…') : t('Записаться по $35', 'Save my $35 spot')}
      </button>
    </form>
  );
}
