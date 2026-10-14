'use client';
import { useTranslations } from 'next-intl';
import { Ecg } from './ui';

const keys = ['chaos', 'language', 'noSystem', 'noProgress', 'format', 'alone'];

export default function ProblemSection() {
  const t = useTranslations('problem');

  return (
    <section id="why" className="px-3 py-10 md:px-6 md:py-14">
      <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[0.9fr_1.6fr]">
        <div className="card-dark relative flex flex-col justify-between overflow-hidden p-7 md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] text-white/80">{t('badge')}</span>
            <h2 className="mt-6 text-[32px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[44px]">{t('title')}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/65">{t('subtitle')}</p>
          </div>
          <div className="mt-10">
            <Ecg className="mb-6 h-12 w-full text-white/35" />
            <p className="text-[17px] font-medium leading-snug text-white">{t('cta')}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {keys.map((key, i) => (
            <div key={key} className="card group p-6 transition-colors hover:bg-white md:p-7">
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-mist text-sm font-medium text-slate">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink">{t(`items.${key}.title`)}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{t(`items.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
