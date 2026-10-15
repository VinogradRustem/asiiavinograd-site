'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Ecg } from './ui';
import type { ReactElement } from 'react';

const keys = ['chaos', 'language', 'noSystem', 'noProgress', 'format', 'alone'] as const;

/* Simple line icons, one per problem. */
const ICONS: Record<(typeof keys)[number], ReactElement> = {
  chaos: <path d="M4 7h16M4 12h10M4 17h6M17 14l3 3-3 3" />,
  language: <path d="M4 5h8M8 3v2m-2.5 0c.6 3 2.6 5.5 5.5 7M10.5 5c-.6 3-2.6 5.5-5.5 7M13 21l4-9 4 9m-6.8-3h5.6" />,
  noSystem: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z" />,
  noProgress: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  format: <path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4" />,
  alone: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0m1-10a3 3 0 1 0 0-6m5 16a6 6 0 0 0-4-5.6" />,
};

export default function ProblemSection() {
  const t = useTranslations('problem');

  return (
    <section id="why" className="px-3 py-10 md:px-6 md:py-14">
      <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[0.8fr_2fr]">
        <div className="card-dark relative flex flex-col justify-between overflow-hidden p-7 md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] text-white/80">{t('badge')}</span>
            <h2 className="mt-6 text-[32px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[44px]">{t('title')}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/65">{t('subtitle')}</p>
          </div>
          <div className="mt-10">
            <Ecg className="mb-6 h-12 w-full text-white/35" />
            <div className="flex items-center gap-4 rounded-[22px] bg-white/10 p-3 pr-5 ring-1 ring-white/10">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-steel">
                <Image src="/asiia.jpg" alt="" fill sizes="56px" className="object-cover object-[50%_12%]" />
              </div>
              <p className="text-[15px] font-medium leading-snug text-white">{t('cta')}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {keys.map(key => (
            <div key={key} className="card group relative flex flex-col overflow-hidden p-5 transition-colors hover:bg-white md:p-6">
              <svg className="pointer-events-none absolute -bottom-6 -right-6 text-slate opacity-[0.06] transition-opacity group-hover:opacity-[0.1]" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {ICONS[key]}
              </svg>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist text-slate transition-colors group-hover:bg-slate group-hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {ICONS[key]}
                </svg>
              </span>
              <h3 className="relative mt-5 text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">{t(`items.${key}.title`)}</h3>
              <p className="relative mt-2 text-[14px] leading-relaxed text-muted">{t(`items.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
