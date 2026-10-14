'use client';
import { useLocale } from 'next-intl';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';

const SECTIONS = [
  { en: 'Biochemistry',                       ru: 'Биохимия' },
  { en: 'Cardiovascular',                     ru: 'Кардиология' },
  { en: 'Endocrine',                          ru: 'Эндокринология' },
  { en: 'Gastrointestinal',                   ru: 'Гастроэнтерология' },
  { en: 'Hematology & Oncology',              ru: 'Гематология и Онкология' },
  { en: 'Immunology',                         ru: 'Иммунология' },
  { en: 'Microbiology',                       ru: 'Микробиология' },
  { en: 'Musculoskeletal, Skin & Connective', ru: 'Опорно-двигательная система' },
  { en: 'Neurology & Special Senses',         ru: 'Неврология' },
  { en: 'Pathology',                          ru: 'Патология' },
  { en: 'Pharmacology',                       ru: 'Фармакология' },
  { en: 'Psychiatry',                         ru: 'Психиатрия' },
  { en: 'Renal',                              ru: 'Нефрология' },
  { en: 'Reproductive',                       ru: 'Репродуктивная система' },
  { en: 'Respiratory',                        ru: 'Пульмонология' },
];

export default function AnkiPage() {
  const locale = useLocale();
  const isRu = locale === 'ru';

  return (
    <>
      <NavBar />
      <main className="page-bg text-ink min-h-screen font-sans">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

          <a href={isRu ? '/ru' : '/'} className="text-muted hover:text-ink text-sm mb-12 transition-colors inline-block">
            ← {isRu ? 'Назад' : 'Back'}
          </a>

          {/* Header */}
          <p className="text-slate text-sm uppercase tracking-widest mb-3">Anki</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {isRu ? 'Anki-карточки' : 'Anki Decks'}
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-4">
            {isRu
              ? 'Одна большая колода охватывает все разделы USMLE — внутри уже всё разделено по темам и подтемам.'
              : 'One complete deck covering all USMLE disciplines — organized by topics and subtopics inside.'}
          </p>

          {/* Sections list */}
          <div className="flex flex-wrap gap-2 mb-16">
            {SECTIONS.map((s) => (
              <span key={s.en} className="text-xs px-3 py-1 rounded-full bg-slate/10 text-slate border border-steel/20">
                {isRu ? s.ru : s.en}
              </span>
            ))}
          </div>

          {/* 2 кнопки */}
          {isRu ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://patreon.com/drasiiavinograd"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate hover:bg-ink text-white px-8 py-4 rounded-full font-medium transition-colors text-center"
              >
                Скачать на русском
              </a>
              <a
                href="https://patreon.com/drasiiavinograd"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-steel/40 hover:border-steel text-slate px-8 py-4 rounded-full font-medium transition-colors text-center"
              >
                Скачать на английском
              </a>
            </div>
          ) : (
            <a
              href="https://patreon.com/drasiiavinograd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-slate hover:bg-ink text-white px-8 py-4 rounded-full font-medium transition-colors"
            >
              Download All Decks
            </a>
          )}

          <p className="text-muted text-sm mt-6">
            {isRu
              ? 'Доступно бесплатно'
              : 'Available for free'}
          </p>

        </div>
      </main>
      <Footer />
    </>
  );
}
