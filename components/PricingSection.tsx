'use client';
import { useTranslations } from 'next-intl';
import { ArrowButton, Check, SectionHead } from './ui';

export default function PricingSection() {
  const t = useTranslations('pricing');
  const plans = t.raw('plans') as {
    tag: string;
    name: string;
    price: string;
    period: string;
    desc: string;
    features: string[];
    cta: string;
    url: string;
    highlight: boolean;
  }[];

  return (
    <section id="pricing" className="px-3 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead eyebrow={t('badge')} title={t('title')} desc={t('subtitle')} center />

        <div className="mx-auto grid max-w-[980px] gap-3 md:grid-cols-2">
          {plans.map(plan => {
            const hi = plan.highlight;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[28px] border p-7 md:p-9 ${
                  hi ? 'border-steel bg-steel text-white' : 'border-white bg-white/60 text-ink'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${hi ? 'bg-white/15 text-white' : 'bg-mist text-slate'}`}>{plan.tag}</span>
                  {hi && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate">{t('popular')}</span>}
                </div>
                <h3 className="mt-6 text-[24px] font-medium tracking-[-0.02em]">{plan.name}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${hi ? 'text-white/75' : 'text-muted'}`}>{plan.desc}</p>
                <div className="mt-7 flex items-baseline gap-1.5">
                  <span className="text-[56px] font-medium leading-none tracking-[-0.04em]">{plan.price}</span>
                  <span className={`text-sm ${hi ? 'text-white/70' : 'text-muted'}`}>{plan.period}</span>
                </div>
                <div className={`my-7 h-px ${hi ? 'bg-white/20' : 'bg-ink/10'}`} />
                <ul className="mb-9 flex-1 space-y-3.5">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-start gap-3 text-[15px] ${hi ? 'text-white/90' : 'text-graphite'}`}>
                      <Check className={`mt-0.5 shrink-0 ${hi ? 'text-white' : 'text-slate'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <ArrowButton href={plan.url} external variant={hi ? 'light' : 'dark'} className="self-start">
                  {plan.cta.replace(/\s*→\s*$/, '')}
                </ArrowButton>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted">{t('note')}</p>
      </div>
    </section>
  );
}
