'use client';
import { useState } from 'react';

type Sec = { id: string; name: string };

/** "Ask a question" form. Questions are pre-moderated and appear after review. */
export default function AskForm({ lang, sections, defaultSection }: { lang: string; sections: Sec[]; defaultSection?: string }) {
  const ru = lang === 'ru';
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: '', body: '', name: '', section: defaultSection || sections[0]?.id || '', website: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await fetch('/api/forum/topics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, lang }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) setDone(true);
    else setErr(j.error || (ru ? 'Не получилось отправить.' : 'Could not send.'));
  };

  const inp = 'w-full rounded-2xl border border-transparent bg-mist/70 px-4 py-3 text-[15px] text-ink placeholder-muted/70 focus:border-steel focus:bg-white focus:outline-none';

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="group inline-flex items-center gap-3 rounded-full bg-slate py-1.5 pl-6 pr-1.5 text-[15px] font-medium text-white transition-colors hover:bg-ink">
        {ru ? 'Задать вопрос' : 'Ask a question'}
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xl leading-none text-slate">+</span>
      </button>
    );

  if (done)
    return (
      <div className="card-solid p-6 md:p-8">
        <div className="text-[19px] font-medium text-ink">{ru ? 'Спасибо, вопрос отправлен!' : 'Thanks, your question is in!'}</div>
        <p className="mt-2 text-[15px] text-muted">
          {ru ? 'Он появится на форуме после проверки, обычно в течение нескольких минут.' : 'It will appear on the forum after a quick review, usually within minutes.'}
        </p>
      </div>
    );

  return (
    <form onSubmit={send} className="card-solid space-y-3 p-6 md:p-8">
      <div className="text-[19px] font-medium text-ink">{ru ? 'Новый вопрос' : 'New question'}</div>
      {sections.length > 1 && (
        <select value={f.section} onChange={e => setF({ ...f, section: e.target.value })} className={inp}>
          {sections.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      )}
      <input className={inp} placeholder={ru ? 'Коротко: о чём вопрос?' : 'In short: what is your question?'} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} maxLength={160} />
      <textarea className={`${inp} min-h-[140px] resize-y`} placeholder={ru ? 'Подробнее: ваша ситуация, страна, этап, что уже пробовали' : 'Details: your situation, country, stage, what you have tried'} value={f.body} onChange={e => setF({ ...f, body: e.target.value })} maxLength={8000} />
      <input className={inp} placeholder={ru ? 'Ваше имя' : 'Your name'} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} maxLength={60} />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button disabled={busy} className="rounded-full bg-slate px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-ink disabled:opacity-60">
          {busy ? (ru ? 'Отправляю…' : 'Sending…') : ru ? 'Отправить вопрос' : 'Post question'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-3 text-sm text-muted hover:text-ink">
          {ru ? 'Отмена' : 'Cancel'}
        </button>
      </div>
      <p className="text-xs text-muted">
        {ru ? 'Вопросы проверяет модератор. Не публикуйте личные медицинские данные пациентов.' : 'Questions are reviewed by a moderator. Do not post personal patient data.'}
      </p>
    </form>
  );
}
