import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { Arrow, ArrowButton } from '../../../components/ui';
import LECTURES from '../../../data/lectures.json';
import en from '../../../messages/en.json';
import ru from '../../../messages/ru.json';

// One page per Step 1 section linked from the home page (cards «Разделы»), plus «Разборы задач» and «Анализы».
// Lectures come from data/lectures.json (the YouTube lectures already published by the autopost bot).

type Lecture = { yt: string; ru: string; en: string; sections: string[] };
type Item = { title: string; topics: string; free: boolean; slug: string };

const EXTRA: Record<string, { ru: Omit<Item, 'slug'>; en: Omit<Item, 'slug'> }> = {
  cases: {
    ru: { title: ru.curriculum.cases_title, topics: 'Разборы задач USMLE по разделам: как читать виньетку, отсекать дистракторы и находить ключ к ответу.', free: true },
    en: { title: en.curriculum.cases_title, topics: 'USMLE question walkthroughs by discipline: reading the vignette, ruling out distractors and finding the key clue.', free: true },
  },
  'medical-english': {
    ru: { title: ru.curriculum.english_title, topics: ru.curriculum.english_desc + '. ' + ru.curriculum.english_features.join(' · ') + '. В USMLE Club занятия по медицинскому английскому каждое воскресенье.', free: false },
    en: { title: en.curriculum.english_title, topics: en.curriculum.english_desc + '. ' + en.curriculum.english_features.join(' · ') + '. Sunday medical English sessions in the USMLE Club.', free: false },
  },
  labs: {
    ru: { title: 'Расшифровка анализов', topics: 'Общий анализ крови, КЩС, моча, ликвор, печёночные пробы, маркеры воспаления и опухолей, гормоны. Step 1 и Step 2 CK.', free: true },
    en: { title: 'Lab interpretation', topics: 'CBC, ABG, urinalysis, CSF, liver tests, inflammatory and tumor markers, endocrine labs. Step 1 and Step 2 CK.', free: true },
  },
};

const SLUGS = [...(en.curriculum.items as Item[]).map((i) => i.slug).filter((s) => s !== 'microbiology'), ...Object.keys(EXTRA)];

export const dynamicParams = false;
export function generateStaticParams() {
  return ['en', 'ru'].flatMap((locale) => SLUGS.map((section) => ({ locale, section })));
}

function info(locale: string, section: string): Item | null {
  const isRu = locale === 'ru';
  if (EXTRA[section]) return { ...EXTRA[section][isRu ? 'ru' : 'en'], slug: section };
  const items = ((isRu ? ru : en).curriculum.items as Item[]);
  return items.find((i) => i.slug === section) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }): Promise<Metadata> {
  const { locale, section } = await params;
  const it = info(locale, section);
  if (!it) return {};
  const isRu = locale === 'ru';
  return {
    title: `${it.title} — USMLE Step 1 | ${isRu ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd'}`,
    description: it.topics,
    alternates: { canonical: `${isRu ? '/ru' : ''}/${section}`, languages: { en: `/${section}`, ru: `/ru/${section}` } },
  };
}

export default async function SectionPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale, section } = await params;
  const it = info(locale, section);
  if (!it) notFound();
  const isRu = locale === 'ru';
  const lp = (p: string) => (isRu ? `/ru${p}` : p);
  const lectures = (LECTURES as Lecture[]).filter((l) => l.sections.includes(section));
  const yt = isRu ? 'https://youtube.com/@asiiavinogradusmle' : 'https://youtube.com/@USMLEforIMG';

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-28 md:px-6 md:pt-32">
          <a href={lp('/#curriculum')} className="mb-8 inline-block text-sm text-muted transition-colors hover:text-ink">
            ← {isRu ? 'Все разделы' : 'All sections'}
          </a>

          <div className="card-solid p-7 md:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm uppercase tracking-widest text-steel">USMLE Step 1</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${it.free ? 'bg-slate text-white' : 'bg-ink text-white'}`}>
                {it.free ? (isRu ? 'Бесплатно' : 'Free') : isRu ? 'Лекции бесплатно, материалы в клубе' : 'Free lectures, materials in the club'}
              </span>
            </div>
            <h1 className="mt-5 text-[36px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[56px]">{it.title}</h1>
            <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-muted md:text-[18px]">{it.topics}</p>
          </div>

          <h2 className="mt-12 text-[26px] font-medium tracking-[-0.02em] md:text-[32px]">
            {isRu ? 'Лекции' : 'Lectures'} {lectures.length ? <span className="text-muted">· {lectures.length}</span> : null}
          </h2>
          {!isRu && lectures.length ? (
            <p className="mt-2 text-[14px] text-muted">These lectures are in Russian. English versions are coming to the @USMLEforIMG channel.</p>
          ) : null}

          {lectures.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lectures.map((l) => (
                <a key={l.yt} href={`https://www.youtube.com/watch?v=${l.yt}`} target="_blank" rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden transition-colors hover:bg-white">
                  <div className="relative aspect-video w-full overflow-hidden bg-mist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://i.ytimg.com/vi/${l.yt}/hqdefault.jpg`} alt={isRu ? l.ru : l.en} loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[18px] font-medium leading-snug text-ink">{isRu ? l.ru : l.en}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-slate">
                      {isRu ? 'Смотреть на YouTube' : 'Watch on YouTube'} <Arrow />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="card mt-6 p-7">
              <p className="text-[16px] text-muted">
                {isRu
                  ? 'Лекции по этому разделу записываются. Подпишитесь на YouTube-канал, чтобы не пропустить, а полный разбор раздела уже есть в USMLE Club.'
                  : 'Lectures for this section are being recorded. Subscribe on YouTube to get them first; the full section is already in the USMLE Club.'}
              </p>
              <div className="mt-5"><ArrowButton href={yt} external>{isRu ? 'YouTube-канал' : 'YouTube channel'}</ArrowButton></div>
            </div>
          )}

          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            <a href={lp('/anki')} className="group flex flex-col rounded-[28px] bg-ink p-7 text-white transition-colors hover:bg-graphite md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">{isRu ? 'Anki-карточки' : 'Anki decks'}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/60">
                {isRu ? 'Интервальное повторение по этому разделу. Бесплатно.' : 'Spaced repetition for this section. Free.'}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium">{isRu ? 'Открыть' : 'Open'} <Arrow /></span>
            </a>
            <a href={lp('/#pricing')} className="group flex flex-col rounded-[28px] bg-steel p-7 text-white transition-colors hover:bg-slate md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em]">USMLE Club</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/75">
                {isRu ? 'Занятия по разделам Step 1, разборы задач, PDF-конспекты, колоды Anki и ответы Аси на ваши вопросы.'
                  : 'Step 1 lessons by section, question walkthroughs, PDF notes, Anki decks and answers to your questions.'}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium">{isRu ? 'Тарифы' : 'Pricing'} <Arrow /></span>
            </a>
            <a href={lp('/consultation')} className="card-solid group flex flex-col p-7 transition-shadow hover:shadow-lg md:p-9">
              <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-ink">{isRu ? 'Личная консультация' : 'Mentoring session'}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">
                {isRu ? 'План подготовки под ваш уровень и сроки, разбор ваших результатов.' : 'A study plan for your level and timeline, a review of your scores.'}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-ink">{isRu ? 'Записаться' : 'Book'} <Arrow /></span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
