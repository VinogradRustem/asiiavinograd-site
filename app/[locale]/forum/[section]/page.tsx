import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AskForm from '@/components/forum/AskForm';
import SectionIcon from '@/components/forum/SectionIcon';
import TopicList from '@/components/forum/TopicList';
import { getSection, getSections, getTopics } from '@/lib/forum';

export const revalidate = 60;

type P = { params: Promise<{ locale: string; section: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, section } = await params;
  const s = await getSection(section);
  if (!s) return {};
  const ru = locale === 'ru';
  return {
    title: `${ru ? s.name_ru : s.name_en} — ${ru ? 'форум медиков' : 'medical career forum'}`,
    description: (ru ? s.desc_ru : s.desc_en) || undefined,
    alternates: { canonical: `${ru ? '/ru' : ''}/forum/${s.id}`, languages: { ru: `/ru/forum/${s.id}`, en: `/forum/${s.id}` } },
  };
}

export default async function SectionPage({ params }: P) {
  const { locale, section } = await params;
  const ru = locale === 'ru';
  const base = ru ? '/ru/forum' : '/forum';
  const [s, sections, topics] = await Promise.all([getSection(section), getSections(), getTopics(locale, section, 100)]);
  if (!s) notFound();
  const tags = ((ru ? s.tags_ru : s.tags_en) || '').split(',').filter(Boolean);

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <div className="mx-auto max-w-[1240px] px-3 pb-16 pt-24 md:px-6 md:pt-28">
          <nav className="mb-5 text-sm text-muted">
            <a href={base} className="hover:text-ink">{ru ? 'Форум' : 'Forum'}</a> <span className="mx-1.5">/</span> {ru ? s.name_ru : s.name_en}
          </nav>
          <div className="grid gap-3 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="card p-7 md:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate text-white"><SectionIcon name={s.icon} size={24} /></span>
                <h1 className="mt-5 text-[32px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[44px]">{ru ? s.name_ru : s.name_en}</h1>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">{ru ? s.desc_ru : s.desc_en}</p>
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="rounded-full border border-ink/10 px-3 py-1 text-[12.5px] text-graphite/70">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3">
                {topics.length ? (
                  <TopicList topics={topics} base={base} lang={locale} />
                ) : (
                  <div className="card p-8 text-center text-[15px] text-muted">{ru ? 'В этом разделе пока нет вопросов. Задайте первый!' : 'No questions here yet. Be the first to ask!'}</div>
                )}
              </div>
            </div>
            <aside className="flex flex-col gap-3">
              <AskForm lang={locale} sections={[{ id: s.id, name: ru ? s.name_ru : s.name_en }]} defaultSection={s.id} />
              <div className="card p-6">
                <div className="text-[15px] font-medium">{ru ? 'Другие разделы' : 'Other sections'}</div>
                <ul className="mt-3 space-y-2">
                  {sections.filter(x => x.id !== s.id).map(x => (
                    <li key={x.id}>
                      <a href={`${base}/${x.id}`} className="flex items-center gap-2.5 text-[14px] text-graphite hover:text-slate">
                        <span className="text-steel"><SectionIcon name={x.icon} size={18} /></span>
                        {ru ? x.name_ru : x.name_en}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
