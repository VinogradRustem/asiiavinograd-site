'use client';
import { useLocale } from 'next-intl';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';

const LECTURES = [
  {
    slug: 'gram-positive-bacteria',
    ru: 'Грамположительные бактерии — полный обзор',
    en: 'Gram-Positive Bacteria — Complete Guide',
    ruDesc: 'Полный алгоритм лабораторной диагностики, Staph vs Strep, спорообразующие палочки и разбор 4 клинических задач.',
    enDesc: 'Full lab algorithm, Staph vs Strep, spore-forming bacilli, and 4 clinical vignettes.',
    ready: true,
  },
  {
    slug: 'gram-negative-bacteria',
    ru: 'Грамотрицательные бактерии — полный обзор',
    en: 'Gram-Negative Bacteria — Complete Guide',
    ruDesc: 'Enterobacteriaceae, оксидаза-положительные палочки, облигатные внутриклеточные организмы.',
    enDesc: 'Enterobacteriaceae, oxidase-positive rods, obligate intracellular organisms.',
    ready: false,
  },
  {
    slug: 'staphylococcus-aureus',
    ru: 'Staphylococcus Aureus — глубокий разбор',
    en: 'Staphylococcus Aureus — Deep Dive',
    ruDesc: 'Токсины, факторы вирулентности, MRSA и классические клинические сценарии Step 1.',
    enDesc: 'Toxins, virulence factors, MRSA, and classic Step 1 clinical scenarios.',
    ready: false,
  },
];

export default function MicrobiologyPage() {
  const locale = useLocale();
  const isRu = locale === 'ru';
  const homeUrl = isRu ? '/ru' : '/';

  return (
    <>
      <NavBar />
      <main className="page-bg text-ink min-h-screen font-sans">
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

          <a href={homeUrl} className="text-muted hover:text-ink text-sm mb-12 transition-colors inline-block">
            ← {isRu ? 'Назад' : 'Back'}
          </a>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate/20 text-slate">
              {isRu ? 'Бесплатно' : 'Free'}
            </span>
            <p className="text-slate text-sm uppercase tracking-widest">Microbiology</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {isRu ? 'Микробиология' : 'Microbiology'}
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-16 max-w-2xl">
            {isRu
              ? 'Грам+ и Грам− бактерии, вирусы, грибки, паразиты, антибиотики — всё высокодоходное содержание USMLE Step 1 по микробиологии.'
              : 'Gram+ & Gram− bacteria, viruses, fungi, parasites, antibiotics — all high-yield USMLE Step 1 microbiology content.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {LECTURES.map((lec) => {
              const card = (
                <div className="group bg-white/60 border border-white rounded-[24px] p-6 transition-all hover:bg-white h-full flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-slate transition-colors">
                    {isRu ? lec.ru : lec.en}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
                    {isRu ? lec.ruDesc : lec.enDesc}
                  </p>
                  <span className="text-slate text-sm">
                    {lec.ready ? (isRu ? 'Читать →' : 'Read →') : (isRu ? 'Скоро' : 'Coming soon')}
                  </span>
                </div>
              );
              return lec.ready ? (
                <a key={lec.slug} href={`/${isRu ? 'ru/' : ''}microbiology/${lec.slug}`} className="block">
                  {card}
                </a>
              ) : (
                <div key={lec.slug} className="opacity-50 cursor-default">{card}</div>
              );
            })}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
