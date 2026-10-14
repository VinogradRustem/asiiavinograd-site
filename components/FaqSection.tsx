'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowButton } from './ui';

export default function FaqSection({ onAsk }: { onAsk?: () => void }) {
  const t = useTranslations('faq');
  const ru = useLocale() === 'ru';
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-3 py-10 md:px-6 md:py-14">
      <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[0.85fr_1.4fr]">
        <div className="card relative flex flex-col overflow-hidden p-7 md:p-9">
          <span className="eyebrow self-start">{t('badge')}</span>
          <h2 className="mt-5 text-[34px] font-medium leading-[1.05] tracking-[-0.03em] text-ink md:text-[48px]">{t('title')}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            {ru ? 'Не нашли ответ? Напишите — ответим в течение 5 минут.' : "Didn't find your answer? Write to us — we reply within 5 minutes."}
          </p>
          {onAsk && (
            <div className="mt-6">
              <ArrowButton onClick={onAsk}>{ru ? 'Задать вопрос' : 'Ask a question'}</ArrowButton>
            </div>
          )}
          <div className="relative mt-8 hidden min-h-[260px] flex-1 overflow-hidden rounded-[22px] bg-steel lg:block">
            <Image src="/asiia.jpg" alt="Dr. Asiia Vinograd" fill sizes="420px" className="object-cover object-[50%_15%]" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-[22px] border border-white transition-colors ${isOpen ? 'bg-white' : 'bg-white/55 hover:bg-white/80'}`}>
                <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="text-[17px] font-medium leading-snug text-ink">{item.q}</span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-200 ${
                      isOpen ? 'rotate-45 bg-slate text-white' : 'bg-mist text-slate'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && <div className="px-6 pb-6 pr-16 text-[15px] leading-relaxed text-muted">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
