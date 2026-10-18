'use client';
import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Arrow } from './ui';

export function switchLocale(newLocale: string) {
  const path = window.location.pathname;
  if (newLocale === 'en') {
    window.location.href = path.startsWith('/ru') ? path.slice(3) || '/' : path;
    return;
  }
  if (!path.startsWith('/ru')) window.location.href = '/ru' + path;
}

/** Floating rounded nav bar. On the home page pass onCta to open the contact form. */
export default function NavBar({ onCta }: { onCta?: () => void }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const homeUrl = locale === 'ru' ? '/ru' : '/';
  const anchor = (id: string) => (id === 'forum' || id === 'blog' ? (locale === 'ru' ? `/ru/${id}` : `/${id}`) : onCta ? `#${id}` : `${homeUrl}#${id}`);
  const links = [
    { id: 'about', label: t('about') },
    { id: 'curriculum', label: t('curriculum') },
    { id: 'lectures', label: t('lectures') },
    { id: 'pricing', label: t('pricing') },
    { id: 'forum', label: locale === 'ru' ? 'Форум' : 'Forum' },
    { id: 'blog', label: locale === 'ru' ? 'Блог' : 'Blog' },
    { id: 'connect', label: t('connect') },
  ];
  const signIn = locale === 'ru' ? 'Войти' : 'Sign In';

  const Lang = ({ big }: { big?: boolean }) => (
    <div className="flex items-center gap-0.5 rounded-full bg-mist p-0.5">
      {['en', 'ru'].map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`rounded-full ${big ? 'px-4 py-1.5' : 'px-2.5 py-1'} text-xs font-medium uppercase transition-all ${
            locale === l ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={`mx-auto flex max-w-[1240px] items-center justify-between rounded-full border border-white px-3 py-2 pl-5 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-[0_8px_30px_-12px_rgba(54,86,95,0.35)] backdrop-blur' : 'bg-white/60 backdrop-blur'
        }`}
      >
        <a href={homeUrl} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2 12h5l2-4 3 9 3-12 2 7h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden sm:inline">{t('siteTitle')}</span>
          <span className="sm:hidden">Dr. Vinograd</span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map(l => (
            <a key={l.id} href={anchor(l.id)} className="text-sm text-graphite/80 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Lang />
          <a href={locale === 'ru' ? '/ru/auth' : '/auth'} className="rounded-full px-4 py-2 text-sm text-graphite transition-colors hover:bg-mist">
            {signIn}
          </a>
          {onCta ? (
            <button onClick={onCta} className="group inline-flex items-center gap-2 rounded-full bg-slate py-1.5 pl-4 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-ink">
              {t('cta')}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate transition-transform group-hover:rotate-45">
                <Arrow className="h-3.5 w-3.5" />
              </span>
            </button>
          ) : (
            <a href={anchor('connect')} className="group inline-flex items-center gap-2 rounded-full bg-slate py-1.5 pl-4 pr-1.5 text-sm font-medium text-white transition-colors hover:bg-ink">
              {t('cta')}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate transition-transform group-hover:rotate-45">
                <Arrow className="h-3.5 w-3.5" />
              </span>
            </a>
          )}
        </div>

        <button className="grid h-10 w-10 place-items-center rounded-full bg-slate text-white lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-[1240px] rounded-[28px] border border-white bg-white/95 p-5 shadow-xl backdrop-blur lg:hidden">
          <div className="flex flex-col">
            {links.map(l => (
              <a
                key={l.id}
                href={anchor(l.id)}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-mist py-3.5 text-[17px] text-ink"
              >
                {l.label}
                <Arrow className="text-muted" />
              </a>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <Lang big />
            <a href={locale === 'ru' ? '/ru/auth' : '/auth'} className="rounded-full border border-ink/10 px-5 py-2 text-sm text-ink">
              {signIn}
            </a>
          </div>
          {onCta && (
            <button
              onClick={() => {
                setMenuOpen(false);
                onCta();
              }}
              className="mt-4 w-full rounded-full bg-slate py-3.5 text-[15px] font-medium text-white"
            >
              {t('cta')}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
