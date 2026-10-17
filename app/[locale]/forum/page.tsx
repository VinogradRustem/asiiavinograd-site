import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AskForm from '@/components/forum/AskForm';
import SectionIcon from '@/components/forum/SectionIcon';
import TopicList from '@/components/forum/TopicList';
import { getSections, getTopics, sectionCounts } from '@/lib/forum';

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
  const [sections, topics, counts] = await Promise.all([getSections(), getTopics(locale, undefined, 12), sectionCounts(locale)]);
  const nm = (s: { name_ru: string; name_en: string }) => (ru ? s.name_ru : s.name_en);
  const names = Object.fromEntries(sections.map(s => [s.id, nm(s)]));
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
                    <div className="text-[34px] font-medium leading-none">{sections.length}</div>
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
            <h2 className="text-[26px] font-medium tracking-[-0.02em] md:text-[32px]">{ru ? 'Свежие вопросы' : 'Latest questions'}</h2>
            <div className="mt-6">
              {topics.length ? (
                <TopicList topics={topics} base={base} lang={locale} names={names} />
              ) : (
                <div className="card p-8 text-center text-[15px] text-muted">{ru ? 'Здесь появятся первые вопросы. Задайте свой!' : 'The first questions will appear here. Ask yours!'}</div>
              )}
            </div>
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
