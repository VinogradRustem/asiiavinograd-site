'use client';
import { useState } from 'react';

export default function ReplyForm({ lang, topicId }: { lang: string; topicId: number }) {
  const ru = lang === 'ru';
  const [f, setF] = useState({ body: '', name: '', website: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const inp = 'w-full rounded-2xl border border-transparent bg-mist/70 px-4 py-3 text-[15px] text-ink placeholder-muted/70 focus:border-steel focus:bg-white focus:outline-none';

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr('');
    const r = await fetch('/api/forum/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, topic_id: topicId, lang }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (r.ok) { setDone(true); setF({ body: '', name: f.name, website: '' }); }
    else setErr(j.error || (ru ? 'Не получилось отправить.' : 'Could not send.'));
  };

  if (done)
    return (
      <div className="card-solid p-6">
        <div className="text-[17px] font-medium text-ink">{ru ? 'Спасибо, ответ отправлен!' : 'Thanks, your answer is in!'}</div>
        <p className="mt-1 text-[14px] text-muted">{ru ? 'Он появится после проверки модератором.' : 'It will appear after moderation.'}</p>
        <button onClick={() => setDone(false)} className="mt-3 text-sm text-slate underline underline-offset-4">{ru ? 'Написать ещё' : 'Write another'}</button>
      </div>
    );

  return (
    <form onSubmit={send} className="card-solid space-y-3 p-6">
      <div className="text-[17px] font-medium text-ink">{ru ? 'Ваш ответ' : 'Your answer'}</div>
      <textarea className={`${inp} min-h-[120px] resize-y`} placeholder={ru ? 'Поделитесь опытом или советом' : 'Share your experience or advice'} value={f.body} onChange={e => setF({ ...f, body: e.target.value })} maxLength={8000} />
      <input className={inp} placeholder={ru ? 'Ваше имя' : 'Your name'} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} maxLength={60} />
      <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className="rounded-full bg-slate px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-ink disabled:opacity-60">
        {busy ? (ru ? 'Отправляю…' : 'Sending…') : ru ? 'Ответить' : 'Reply'}
      </button>
    </form>
  );
}
