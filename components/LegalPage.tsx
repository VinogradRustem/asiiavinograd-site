'use client';
import { useLocale } from 'next-intl';
import NavBar from './NavBar';
import Footer from './Footer';

export type LegalSection = { h: string; p: string[] };
export type LegalDoc = { title: string; updated: string; intro: string; sections: LegalSection[] };

/** Shared layout for the Privacy Policy and Terms of Service pages (EN/RU). */
export default function LegalPage({ en, ru }: { en: LegalDoc; ru: LegalDoc }) {
  const locale = useLocale();
  const isRu = locale === 'ru';
  const doc = isRu ? ru : en;

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:pt-32">
          <a href={isRu ? '/ru' : '/'} className="mb-8 inline-block text-sm text-muted transition-colors hover:text-ink">
            ← {isRu ? 'На главную' : 'Home'}
          </a>
          <div className="card-solid p-7 md:p-12">
            <h1 className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[48px]">{doc.title}</h1>
            <p className="mt-3 text-sm text-muted">{doc.updated}</p>
            <p className="mt-8 text-[16px] leading-relaxed text-graphite">{doc.intro}</p>
            {doc.sections.map((s, i) => (
              <section key={i} className="mt-10">
                <h2 className="text-[21px] font-medium tracking-[-0.01em] text-ink">
                  {i + 1}. {s.h}
                </h2>
                {s.p.map((t, j) => (
                  <p key={j} className="mt-3 text-[15px] leading-relaxed text-muted">
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
