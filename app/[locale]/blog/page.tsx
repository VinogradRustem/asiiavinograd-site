import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { blogBase, fmtBlogDate, getBlogPosts, isPathPost } from '@/lib/blog';
import { getPinnedDiary } from '@/lib/forum';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === 'ru';
  return {
    title: ru ? 'Блог: новости медицины и разборы для USMLE' : 'Blog: medical news explained for the USMLE',
    description: ru
      ? 'Свежие открытия, клинические случаи и события в медицине с разбором: что это значит и что из этого нужно знать к USMLE Step 1 и Step 2 CK.'
      : 'New discoveries, unusual cases and health news, explained: what it means and what to know for USMLE Step 1 and Step 2 CK.',
    alternates: { canonical: blogBase(locale), languages: { ru: '/ru/blog', en: '/blog' } },
  };
}

export default async function BlogHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ru = locale === 'ru';
  const base = blogBase(locale);
  const [all, diary] = await Promise.all([getBlogPosts(locale, 90), getPinnedDiary(locale)]);
  const path = all.filter(isPathPost).sort((a, b) => a.published_at.localeCompare(b.published_at));
  const posts = all.filter(p => !isPathPost(p));
  const [first, ...rest] = posts;
  const forum = ru ? '/ru/forum' : '/forum';

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <section className="px-3 pt-24 md:px-6 md:pt-28">
          <div className="mx-auto max-w-[1240px]">
            <div className="card p-7 md:p-10">
              <span className="eyebrow">{ru ? 'Блог' : 'Blog'}</span>
              <h1 className="mt-6 max-w-3xl text-[36px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[54px]">
                {ru ? 'Новости медицины с разбором для USMLE' : 'Medical news, explained for the USMLE'}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-graphite/80">
                {ru
                  ? 'Открытия, необычные клинические случаи и события в здравоохранении. В каждой статье: что произошло, почему это важно и какие high-yield факты пригодятся на экзамене.'
                  : 'Discoveries, unusual clinical cases and health news. Each article covers what happened, why it matters and the high-yield facts worth knowing for the exam.'}
              </p>
            </div>

            {(path.length > 0 || diary) && (
              <div className="card-dark mt-3 p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium">{ru ? 'Закреплено' : 'Pinned'}</span>
                  <span className="text-[13px] text-white/60">{ru ? 'Серия' : 'Series'}</span>
                </div>
                <h2 className="mt-4 text-[28px] font-medium leading-tight tracking-[-0.03em] md:text-[38px]">{ru ? 'Путь врача в США' : 'A doctor’s path to the US'}</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
                  {ru ? 'Шаг за шагом показываем, что делает доктор Асия Виноград на пути к работе врачом в США: документы, экзамены, научный профиль.'
                    : 'Step by step: what Dr. Asiia Vinograd does on her way to practicing in the US — documents, exams, research profile.'}
                </p>
                {path.length > 0 && (
                  <ol className="mt-6 grid gap-2.5 md:grid-cols-2">
                    {path.map((p, i) => (
                      <li key={p.id}>
                        <a href={`${base}/${p.slug}`} className="flex h-full items-start gap-4 rounded-[20px] bg-white/10 p-5 transition-colors hover:bg-white/15">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[14px] font-medium text-ink">{i + 1}</span>
                          <span>
                            <span className="block text-[16px] font-medium leading-snug">{p.title}</span>
                            <span className="mt-1 block text-[12.5px] text-white/55">{fmtBlogDate(p.published_at, locale)} · {p.reading_min} {ru ? 'мин' : 'min'}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
                {diary && (
                  <a href={`${forum}/${diary.section}/${diary.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink">
                    {ru ? 'Дневник и вопросы на форуме →' : 'Diary and questions on the forum →'}
                  </a>
                )}
              </div>
            )}

            {!posts.length && (
              <div className="card-solid mt-3 p-8 text-graphite">{ru ? 'Первые статьи скоро появятся.' : 'The first articles are coming soon.'}</div>
            )}

            {first && (
              <a href={`${base}/${first.slug}`} className="card-solid mt-3 grid overflow-hidden md:grid-cols-[1.2fr_1fr]">
                {first.cover_url && <img src={first.cover_url} alt={first.title} className="h-full max-h-[420px] w-full object-cover" />}
                <div className="p-7 md:p-9">
                  <div className="text-[13px] text-muted">{fmtBlogDate(first.published_at, locale)} · {first.reading_min} {ru ? 'мин чтения' : 'min read'}</div>
                  <h2 className="mt-3 text-[26px] font-medium leading-[1.12] tracking-[-0.02em] md:text-[32px]">{first.title}</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-graphite/80">{first.description}</p>
                  <span className="mt-6 inline-block text-sm font-medium text-slate">{ru ? 'Читать →' : 'Read →'}</span>
                </div>
              </a>
            )}

            <div className="mt-3 grid gap-3 pb-16 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(p => (
                <a key={p.id} href={`${base}/${p.slug}`} className="card-solid flex flex-col overflow-hidden">
                  {p.cover_url && <img src={p.cover_url} alt={p.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-[12.5px] text-muted">{fmtBlogDate(p.published_at, locale)} · {p.reading_min} {ru ? 'мин' : 'min'}</div>
                    <h2 className="mt-2 text-[19px] font-medium leading-snug">{p.title}</h2>
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-graphite/75">{p.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
