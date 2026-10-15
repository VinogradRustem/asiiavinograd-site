import type { Topic } from '@/lib/forum';
import { excerpt, fmtDate } from '@/lib/forum';

export default function TopicList({ topics, base, lang, names }: { topics: Topic[]; base: string; lang: string; names?: Record<string, string> }) {
  const ru = lang === 'ru';
  return (
    <div className="flex flex-col gap-2.5">
      {topics.map(t => (
        <a key={t.id} href={`${base}/${t.section}/${t.slug}`} className="card group flex items-start gap-4 p-5 transition-colors hover:bg-white">
          <div className="min-w-0 flex-1">
            {names && <div className="mb-1 text-[12px] font-medium text-steel">{names[t.section]}</div>}
            <div className="text-[17px] font-medium leading-snug text-ink group-hover:text-slate">
              {t.pinned && <span className="mr-2 rounded-full bg-slate px-2 py-0.5 align-middle text-[11px] text-white">{ru ? 'Важное' : 'Pinned'}</span>}
              {t.title}
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{excerpt(t.body, 160)}</p>
            <div className="mt-2.5 text-[12.5px] text-muted/80">
              {t.author_name} · {fmtDate(t.created_at, lang)}
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-mist px-3 py-2 text-center">
            <div className="text-[17px] font-medium leading-none text-slate">{t.replies}</div>
            <div className="mt-1 text-[11px] text-muted">{ru ? 'ответов' : 'replies'}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
