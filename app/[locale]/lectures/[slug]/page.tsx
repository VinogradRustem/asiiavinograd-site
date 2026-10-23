import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Arrow } from '@/components/ui';
import { allLectures, isoDuration, lectureSlug, lecturesFull } from '@/lib/lectures';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';

// One page per free lecture: our player (works in Russia), description, VideoObject markup for Google/Yandex video search.
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return ['en', 'ru'].flatMap((locale) => allLectures().map((l) => ({ locale, slug: lectureSlug(l) })));
}

const B = 'https://drasiiavinograd.com';
const SEC: Record<string, [string, string]> = { labs: ['Расшифровка анализов', 'Lab interpretation'], cases: ['Разборы задач', 'Question walkthroughs'] };
function secName(slug: string, isRu: boolean) {
  if (SEC[slug]) return SEC[slug][isRu ? 0 : 1];
  const it = ((isRu ? ru : en).curriculum.items as { slug: string; title: string }[]).find((i) => i.slug === slug);
  return it?.title || slug;
}

async function get(slug: string) {
  return (await lecturesFull()).find((l) => l.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = await get(slug);
  if (!l) return {};
  const isRu = locale === 'ru';
  const title = isRu ? `${l.ru} — лекция для USMLE (${l.en})` : `${l.en} — USMLE lecture`;
  const description = isRu ? (l.description || `${l.ru}: лекция доктора Асии Виноград для подготовки к USMLE на русском языке.`)
    : `${l.en}: a USMLE lecture by Dr. Asiia Vinograd (in Russian).`;
  return {
    title: `${title} | ${isRu ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd'}`,
    description: description.slice(0, 300),
    alternates: { canonical: `${isRu ? '/ru' : ''}/lectures/${slug}`, languages: { ru: `/ru/lectures/${slug}`, en: `/lectures/${slug}` } },
    openGraph: { title, description: description.slice(0, 300), images: [l.thumb], type: 'video.other' },
  };
}

export default async function LecturePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const all = await lecturesFull();
  const l = all.find((x) => x.slug === slug);
  if (!l) notFound();
  const isRu = locale === 'ru';
  const lp = (p: string) => (isRu ? `/ru${p}` : p);
  const sec = l.sections[0];
  const related = all.filter((x) => x.yt !== l.yt && x.sections.includes(sec)).slice(0, 6);
  const ld = {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: isRu ? l.ru : l.en, description: l.description || (isRu ? l.ru : l.en), thumbnailUrl: [l.thumb],
    uploadDate: l.created || '2026-07-01T00:00:00Z', inLanguage: 'ru',
    ...(l.duration ? { duration: isoDuration(l.duration) } : {}),
    ...(l.video ? { contentUrl: l.video } : {}),
    embedUrl: `https://www.youtube.com/embed/${l.yt}`,
    author: { '@type': 'Person', name: 'Asiia Vinograd', jobTitle: 'MD, PhD' },
    publisher: { '@type': 'Organization', name: 'Dr. Asiia Vinograd', url: B },
  };

  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="page-bg min-h-screen font-sans text-ink">
        <div className="mx-auto max-w-[1100px] px-4 pb-20 pt-28 md:px-6 md:pt-32">
          <a href={lp(`/${sec}`)} className="text-sm text-muted transition-colors hover:text-ink">← {secName(sec, isRu)}</a>
          <h1 className="mt-4 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[46px]">{isRu ? l.ru : l.en}</h1>
          <p className="mt-2 text-[15px] text-muted">
            {isRu ? `${l.en} · USMLE Step 1` : `${l.ru} · USMLE Step 1 · in Russian`}{l.duration ? ` · ${Math.round(l.duration / 60)} ${isRu ? 'мин' : 'min'}` : ''}
          </p>

          <div className="mt-6 aspect-video overflow-hidden rounded-[24px] bg-black">
            {l.video ? (
              <video src={l.video} poster={l.thumb} controls preload="none" playsInline className="h-full w-full" />
            ) : (
              <iframe src={`https://www.youtube-nocookie.com/embed/${l.yt}`} title={isRu ? l.ru : l.en} allow="encrypted-media; fullscreen" allowFullScreen className="h-full w-full" />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[14px]">
            <a href={`https://www.youtube.com/watch?v=${l.yt}`} target="_blank" rel="noopener noreferrer" className="text-slate">{isRu ? 'Смотреть на YouTube' : 'Watch on YouTube'} →</a>
            <a href={lp('/dashboard')} className="text-slate">{isRu ? 'Отмечать прогресс в личном кабинете' : 'Track progress in your account'} →</a>
          </div>

          {l.description && (
            <div className="card-solid mt-8 p-7 md:p-9">
              <h2 className="text-[22px] font-medium">{isRu ? 'О чём лекция' : 'About this lecture'}</h2>
              <p className="mt-3 whitespace-pre-line text-[16px] leading-relaxed text-graphite/85">{isRu ? l.description : `This lecture is in Russian. ${l.en}: key concepts for USMLE Step 1 explained by Dr. Asiia Vinograd, MD, PhD.`}</p>
            </div>
          )}

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <a href={lp('/#pricing')} className="flex flex-col rounded-[28px] bg-steel p-7 text-white">
              <h3 className="text-[22px] font-medium">USMLE Club</h3>
              <p className="mt-2 flex-1 text-[15px] text-white/75">{isRu ? 'Занятия по разделам Step 1, разборы задач, PDF и Anki, ответы Аси на вопросы.' : 'Step 1 lessons by section, walkthroughs, PDFs and Anki.'}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-medium">{isRu ? 'Тарифы' : 'Pricing'} <Arrow /></span>
            </a>
            <a href={lp('/anki')} className="card-solid flex flex-col p-7">
              <h3 className="text-[22px] font-medium">{isRu ? 'Anki-карточки' : 'Anki decks'}</h3>
              <p className="mt-2 flex-1 text-[15px] text-muted">{isRu ? 'Закрепить тему лекции интервальным повторением. Бесплатно.' : 'Lock in the topic with spaced repetition. Free.'}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-medium">{isRu ? 'Открыть' : 'Open'} <Arrow /></span>
            </a>
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-12 text-[24px] font-medium">{isRu ? 'Ещё лекции раздела' : 'More in this section'}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <a key={r.yt} href={lp(`/lectures/${r.slug}`)} className="card group overflow-hidden transition-colors hover:bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.thumb} alt={isRu ? r.ru : r.en} loading="lazy" className="aspect-video w-full object-cover" />
                    <div className="p-4 text-[15px] font-medium leading-snug">{isRu ? r.ru : r.en}</div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
