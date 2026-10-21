'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Ecg } from './ui';

const SOCIAL_EN = [
  { name: 'YouTube', url: 'https://youtube.com/@USMLEforIMG' },
  { name: 'Discord', url: 'https://discord.gg/86urfUgPmF' },
  { name: 'Patreon', url: 'https://patreon.com/drasiiavinograd' },
  { name: 'Instagram', url: 'https://instagram.com/dr.asiavinograd' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/asiia-vinograd' },
];
const SOCIAL_RU = [
  { name: 'YouTube', url: 'https://youtube.com/@asiiavinogradusmle' },
  { name: 'Telegram', url: 'https://t.me/usmle_img_community' },
  { name: 'USMLE Club', url: 'https://t.me/tribute/app?startapp=s18Vt' },
  { name: 'Instagram', url: 'https://instagram.com/asia.vinograd' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/asiia-vinograd' },
];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const ru = locale === 'ru';
  const home = ru ? '/ru' : '/';
  const cols = [
    {
      title: ru ? 'Навигация' : 'Navigate',
      links: [
        { name: t('nav.about'), url: `${home}#about` },
        { name: t('nav.curriculum'), url: `${home}#curriculum` },
        { name: t('nav.lectures'), url: `${home}#lectures` },
        { name: t('nav.pricing'), url: `${home}#pricing` },
        { name: 'FAQ', url: `${home}#faq` },
        { name: ru ? 'Блог' : 'Blog', url: ru ? '/ru/blog' : '/blog' },
        { name: ru ? 'Форум' : 'Forum', url: ru ? '/ru/forum' : '/forum' },
      ],
    },
    {
      title: ru ? 'Материалы' : 'Resources',
      links: [
        { name: t('curriculum.anki_title'), url: ru ? '/ru/anki' : '/anki' },
        { name: t('curriculum.cases_title'), url: ru ? '/ru/cases' : '/cases' },
        { name: t('curriculum.english_title'), url: ru ? '/ru/medical-english' : '/medical-english' },
        { name: ru ? 'Консультация' : 'Mentoring session', url: ru ? '/ru/consultation' : '/consultation' },
        { name: ru ? 'Личный кабинет' : 'Student account', url: ru ? '/ru/auth' : '/auth' },
      ],
    },
  ];

  return (
    <footer className="px-3 pb-3 md:px-6 md:pb-6">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-ink px-6 pb-8 pt-12 text-white md:px-12 md:pt-16">
                <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[34px]">
              {ru ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd'}
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{t('hero.slogan')}</p>
            <a href="mailto:usmleforimgs.drvinograd@gmail.com" className="mt-6 inline-block text-sm text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
              usmleforimgs.drvinograd@gmail.com
            </a>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <div className="mb-4 text-xs uppercase tracking-[0.14em] text-white/40">{c.title}</div>
              <ul className="space-y-2.5">
                {c.links.map(l => (
                  <li key={l.name}>
                    <a href={l.url} className="text-sm text-white/75 transition-colors hover:text-white">
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.14em] text-white/40">{ru ? 'Соцсети' : 'Social'}</div>
            <ul className="space-y-2.5">
              {(ru ? SOCIAL_RU : SOCIAL_EN).map(s => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-white/75 transition-colors hover:text-white">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Ecg className="relative mt-10 h-12 w-full text-white/15" />
        <div className="relative mt-4 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>{t('footer.copy')}</span>
          <span className="flex gap-5">
            <a href={ru ? '/ru/privacy' : '/privacy'} className="hover:text-white">{ru ? 'Конфиденциальность' : 'Privacy Policy'}</a>
            <a href={ru ? '/ru/terms' : '/terms'} className="hover:text-white">{ru ? 'Условия использования' : 'Terms of Service'}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
