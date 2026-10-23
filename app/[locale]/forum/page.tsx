import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AskForm from '@/components/forum/AskForm';
import SectionIcon from '@/components/forum/SectionIcon';
import TopicList from '@/components/forum/TopicList';
import { excerpt, fmtDate, getPinnedDiary, getSections, getTopics, NEWS_SECTION, sectionCounts } from '@/lib/forum';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === 'ru';
  return {
    title: ru ? 'Форум медиков: учёба, карьера, работа врачом за границей' : 'Medical career forum: study, residency, working abroad',
    description: ru
      ? 'Вопросы и ответы для студентов-медиков, врачей, медсестёр и стоматологов: ординатура, USMLE, PLAB, работа за рубежом, медицинский английский.'
      : 'Q&A for medical students, doctors, nurses and dentists: residency, USMLE, PLAB, working abroad, medical English.',
    alternates: { canonical: ru ? '/ru/forum' : '/forum', languages: { ru: '/ru/forum', en: '/forum' } },
  };
}

export default async function ForumHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ru = locale === 'ru';
  const base = ru ? '/ru/forum' : '/forum';
  const [allSections, topics, news, diary, counts] = await Promise.all([
    getSections(), getTopics(locale, undefined, 12, NEWS_SECTION), getTopics(locale, NEWS_SECTION, 4), getPinnedDiary(locale), sectionCounts(locale),
  ]);
  const sections = allSections.filter(s => s.id !== NEWS_SECTION);
  const newsSec = allSections.find(s => s.id === NEWS_SECTION);
  const nm = (s: { name_ru: string; name_en: string }) => (ru ? s.name_ru : s.name_en);
  const names = Object.fromEntries(allSections.map(s => [s.id, nm(s)]));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <section className="px-3 pt-24 md:px-6 md:pt-28">
          <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[1.5fr_1fr]">
            <div className="card p-7 md:p-10">
              <span className="eyebrow">{ru ? 'Форум медиков' : 'Medical career forum'}</span>
              <h1 className="mt-6 text-[36px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[54px]">
                {ru ? 'Учёба, карьера и работа врачом — здесь и за рубежом' : 'Study, career and working as a doctor — at home and abroad'}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted md:text-[17px]">
                {ru
                  ? 'Задайте вопрос о поступлении, ординатуре, экзаменах USMLE и PLAB, подтверждении диплома или медицинском английском. Отвечают коллеги и доктор Асия Виноград.'
                  : 'Ask about admission, residency, USMLE and PLAB, credential recognition or medical English. Colleagues and Dr. Asiia Vinograd answer.'}
              </p>
              <div className="mt-8">
                <AskForm lang={locale} sections={sections.map(s => ({ id: s.id, name: nm(s) }))} />
              </div>
            </div>
            <div className="card-dark flex flex-col justify-between p-7 md:p-9">
              <div>
                <div className="text-[13px] text-white/60">{ru ? 'На форуме' : 'On the forum'}</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[20px] bg-white/10 p-4">
                    <div className="text-[34px] font-medium leading-none">{allSections.length}</div>
                    <div className="mt-2 text-[13px] text-white/65">{ru ? 'разделов' : 'sections'}</div>
                  </div>
                  <div className="rounded-[20px] bg-white/10 p-4">
                    <div className="text-[34px] font-medium leading-none">{total}</div>
                    <div className="mt-2 text-[13px] text-white/65">{ru ? 'тем' : 'topics'}</div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <div className="text-[15px] font-medium">{ru ? 'Живое общение — в чатах' : 'Live chat'}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="https://t.me/usmle_img_community" target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: '#229ED9' }}>Telegram</a>
                  <a href="https://discord.gg/86urfUgPmF" target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 text-sm font-medium text-white" style={{ background: '#5865F2' }}>Discord</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {diary && (
          <section className="px-3 pt-3 md:px-6">
            <a href={`${base}/${diary.section}/${diary.slug}`} className="card-solid group mx-auto flex max-w-[1240px] flex-col gap-5 p-7 transition-shadow hover:shadow-lg md:flex-row md:items-center md:p-9">
              <div className="min-w-0 flex-1">
                <span className="rounded-full bg-slate px-3 py-1 text-[12px] font-medium text-white">{ru ? 'Закреплено · Путь в США' : 'Pinned · Path to the US'}</span>
                <h2 className="mt-4 text-[24px] font-medium leading-tight tracking-[-0.02em] group-hover:text-slate md:text-[30px]">{diary.title}</h2>
                <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">{excerpt(diary.body, 220)}</p>
                <div className="mt-3 text-[13px] text-muted/80">{diary.author_name} · {ru ? 'обновлено' : 'updated'} {fmtDate(diary.last_at, locale)}</div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="rounded-2xl bg-mist px-4 py-3 text-center">
                  <div className="text-[20px] font-medium leading-none text-slate">{diary.replies}</div>
                  <div className="mt-1 text-[11px] text-muted">{ru ? 'ответов' : 'replies'}</div>
                </div>
                <span className="text-[15px] font-medium text-slate">{ru ? 'Читать дневник →' : 'Read the diary →'}</span>
              </div>
            </a>
          </section>
        )}

        <section className="px-3 py-10 md:px-6 md:py-14">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-[30px] font-medium tracking-[-0.03em] md:text-[40px]">{ru ? 'На каком вы этапе?' : 'Where are you on your path?'}</h2>
            <p className="mt-2 text-[16px] text-muted">{ru ? 'Выберите раздел — там статьи и вопросы по вашей теме.' : 'Pick a section to see questions on your topic.'}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sections.map(s => (
                <a key={s.id} href={`${base}/${s.id}`} className="card group relative flex flex-col overflow-hidden p-5 transition-colors hover:bg-white">
                  <span className="pointer-events-none absolute -bottom-5 -right-5 text-slate opacity-[0.06]"><SectionIcon name={s.icon} size={120} /></span>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-slate transition-colors group-hover:bg-slate group-hover:text-white"><SectionIcon name={s.icon} /></span>
                  <div className="relative mt-5 text-[17px] font-medium leading-snug">{nm(s)}</div>
                  <p className="relative mt-1.5 flex-1 text-[13.5px] leading-relaxed text-muted">{ru ? s.desc_ru : s.desc_en}</p>
                  <div className="relative mt-4 text-[13px] font-medium text-slate">
                    {counts[s.id] || 0} {ru ? 'тем' : 'topics'} →
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="px-3 pb-14 md:px-6">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-[26px] font-medium tracking-[-0.02em] md:text-[32px]">{ru ? 'Свежие обсуждения' : 'Latest discussions'}</h2>
            <div className="mt-6">
              {topics.length ? (
                <TopicList topics={topics.filter(t => t.id !== diary?.id)} base={base} lang={locale} names={names} />
              ) : (
                <div className="card p-8 text-center text-[15px] text-muted">{ru ? 'Здесь появятся первые вопросы. Задайте свой!' : 'The first questions will appear here. Ask yours!'}</div>
              )}
            </div>
            {newsSec && news.length ? (
              <div className="mt-12">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[22px] font-medium tracking-[-0.02em] md:text-[26px]">{nm(newsSec)}</h2>
                    <p className="mt-1 text-[14px] text-muted">{ru ? 'Каждая новость из блога получает здесь свою ветку для вопросов и мнений.' : 'Every news article from the blog gets its own thread here.'}</p>
                  </div>
                  <a href={`${base}/${NEWS_SECTION}`} className="text-[14px] font-medium text-slate">{ru ? `Все новости · ${counts[NEWS_SECTION] || 0} →` : `All news · ${counts[NEWS_SECTION] || 0} →`}</a>
                </div>
                <div className="mt-4 grid gap-2.5 md:grid-cols-2">
                  {news.map(t => (
                    <a key={t.id} href={`${base}/${t.section}/${t.slug}`} className="card flex items-center justify-between gap-4 p-4 transition-colors hover:bg-white">
                      <div className="min-w-0">
                        <div className="line-clamp-2 text-[15px] font-medium leading-snug">{t.title}</div>
                        <div className="mt-1 text-[12px] text-muted">{fmtDate(t.created_at, locale)}</div>
                      </div>
                      <span className="shrink-0 text-[13px] text-muted">{t.replies} {ru ? 'отв.' : 'repl.'}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="mt-8 text-[13px] leading-relaxed text-muted">
              {ru
                ? 'Форум — бесплатный образовательный проект. Ответы участников не являются медицинской или юридической консультацией.'
                : 'The forum is a free educational project. Answers are not medical or legal advice.'}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
