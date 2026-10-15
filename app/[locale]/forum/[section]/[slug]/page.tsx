import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ReplyForm from '@/components/forum/ReplyForm';
import TopicList from '@/components/forum/TopicList';
import { excerpt, fmtDate, getPosts, getSection, getTopic, getTopics, KIND_LABEL } from '@/lib/forum';

export const revalidate = 60;

type P = { params: Promise<{ locale: string; section: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTopic(locale, slug);
  if (!t) return {};
  const ru = locale === 'ru';
  return {
    title: `${t.title} — ${ru ? 'форум медиков' : 'medical career forum'}`,
    description: excerpt(t.body, 155),
    alternates: { canonical: `${ru ? '/ru' : ''}/forum/${t.section}/${t.slug}` },
  };
}

function Badge({ kind, ru }: { kind: string; ru: boolean }) {
  if (kind === 'asya') return <span className="rounded-full bg-slate px-2.5 py-0.5 text-[11px] font-medium text-white">{ru ? 'Врач, автор' : 'MD, author'}</span>;
  if (kind === 'team') return <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-medium text-slate">{ru ? 'Команда' : 'Team'}</span>;
  return null;
}

export default async function TopicPage({ params }: P) {
  const { locale, section, slug } = await params;
  const ru = locale === 'ru';
  const base = ru ? '/ru/forum' : '/forum';
  const [t, s] = await Promise.all([getTopic(locale, slug), getSection(section)]);
  if (!t || !s || t.section !== s.id) notFound();
  const [posts, related] = await Promise.all([getPosts(t.id), getTopics(locale, s.id, 6)]);
  const name = (n: string, k: string) => (KIND_LABEL[k] ? KIND_LABEL[k][ru ? 0 : 1] : n);
  const url = `https://drasiiavinograd.com${base}/${s.id}/${t.slug}`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: t.title,
    text: t.body,
    url,
    datePublished: t.created_at,
    author: { '@type': 'Person', name: name(t.author_name, t.author_kind) },
    interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: posts.length },
    comment: posts.map(p => ({ '@type': 'Comment', text: p.body, datePublished: p.created_at, author: { '@type': 'Person', name: name(p.author_name, p.author_kind) } })),
  };

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
        <div className="mx-auto max-w-[1240px] px-3 pb-16 pt-24 md:px-6 md:pt-28">
          <nav className="mb-5 text-sm text-muted">
            <a href={base} className="hover:text-ink">{ru ? 'Форум' : 'Forum'}</a> <span className="mx-1.5">/</span>
            <a href={`${base}/${s.id}`} className="hover:text-ink">{ru ? s.name_ru : s.name_en}</a>
          </nav>
          <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-3">
              <article className="card-solid p-7 md:p-9">
                <h1 className="text-[28px] font-medium leading-[1.1] tracking-[-0.025em] md:text-[38px]">{t.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  <span className="font-medium text-graphite">{name(t.author_name, t.author_kind)}</span>
                  <Badge kind={t.author_kind} ru={ru} />
                  <span>· {fmtDate(t.created_at, locale)}</span>
                </div>
                <div className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-graphite">{t.body}</div>
              </article>

              <h2 className="mt-4 px-1 text-[20px] font-medium">
                {posts.length ? `${ru ? 'Ответы' : 'Answers'} · ${posts.length}` : ru ? 'Ответов пока нет' : 'No answers yet'}
              </h2>
              {posts.map(p => (
                <div key={p.id} className={`rounded-[24px] border p-6 ${p.best ? 'border-steel bg-white' : 'border-white bg-white/60'}`}>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                    <span className="font-medium text-graphite">{name(p.author_name, p.author_kind)}</span>
                    <Badge kind={p.author_kind} ru={ru} />
                    {p.best && <span className="rounded-full bg-steel px-2.5 py-0.5 text-[11px] font-medium text-white">{ru ? 'Лучший ответ' : 'Best answer'}</span>}
                    <span>· {fmtDate(p.created_at, locale)}</span>
                  </div>
                  <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-graphite">{p.body}</div>
                  {p.author_kind === 'team' && (
                    <p className="mt-4 border-t border-mist pt-3 text-[12.5px] leading-relaxed text-muted">
                      {ru
                        ? 'Справочный ответ команды форума. Правила и сроки меняются: сверяйте детали на официальных сайтах, указанных в ответе.'
                        : 'A reference answer from the forum team. Rules and deadlines change: check the details on the official sites named above.'}
                    </p>
                  )}
                </div>
              ))}
              <ReplyForm lang={locale} topicId={t.id} />
            </div>
            <aside className="flex flex-col gap-3">
              <div className="card-dark p-6">
                <div className="text-[16px] font-medium">{ru ? 'Готовитесь к USMLE?' : 'Preparing for USMLE?'}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                  {ru ? 'Бесплатные лекции доктора Асии Виноград и Anki-карточки по разделам Step 1.' : 'Free lectures by Dr. Asiia Vinograd and Anki decks for every Step 1 discipline.'}
                </p>
                <a href={ru ? '/ru#lectures' : '/#lectures'} className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate">
                  {ru ? 'Смотреть лекции' : 'Watch lectures'}
                </a>
              </div>
              {related.filter(x => x.id !== t.id).length > 0 && (
                <div>
                  <div className="mb-2 px-1 text-[15px] font-medium">{ru ? 'Ещё в разделе' : 'More in this section'}</div>
                  <TopicList topics={related.filter(x => x.id !== t.id).slice(0, 4)} base={base} lang={locale} />
                </div>
              )}
              <p className="px-1 text-[12.5px] leading-relaxed text-muted">
                {ru ? 'Ответы участников не являются медицинской или юридической консультацией.' : 'Answers are not medical or legal advice.'}
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
