'use client';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import ContactModal from '../../components/ContactModal';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ProblemSection from '../../components/ProblemSection';
import PricingSection from '../../components/PricingSection';
import FaqSection from '../../components/FaqSection';
import { Arrow, ArrowButton, Ecg, SectionHead } from '../../components/ui';
import { BRANDS } from '../../components/SocialIcon';

const YT_EN = 'https://youtube.com/@USMLEforIMG';
const YT_RU = 'https://youtube.com/@asiiavinogradusmle';

function ytId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const ru = locale === 'ru';
  const YT = ru ? YT_RU : YT_EN;
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  const aboutItems = t.raw('about.items') as { label: string; sub: string }[];
  const curriculumItems = t.raw('curriculum.items') as { title: string; topics: string; free: boolean; slug: string }[];
  const englishFeatures = t.raw('curriculum.english_features') as string[];
  const lectureItems = t.raw('lectures.items') as { tag: string; title: string; desc: string; url: string; soon: boolean }[];
  const trending = t.raw('trending.items') as { title: string; desc: string; tag: string }[];
  const basePlatforms = t.raw('connect.platforms') as { name: string; sub: string; url: string }[];
  const extra = ru
    ? [
        { name: 'Instagram', sub: 'Reels и сторис', url: 'https://instagram.com/asia.vinograd' },
        { name: 'TikTok', sub: 'Короткие видео', url: 'https://www.tiktok.com/@drasiiavinograd' },
        { name: 'VK', sub: 'Группа ВКонтакте', url: 'https://vk.com/club238788574' },
      ]
    : [
        { name: 'Instagram', sub: 'Reels & stories', url: 'https://instagram.com/dr.asiavinograd' },
        { name: 'TikTok', sub: 'Short videos', url: 'https://www.tiktok.com/@drasiiavinograd' },
      ];
  const platforms = [...basePlatforms.slice(0, 1), ...extra.slice(0, 2), ...basePlatforms.slice(1), ...extra.slice(2)];

  const steps = ru
    ? [
        { n: '01', title: 'Смотрите бесплатные лекции', desc: 'High-yield темы Step 1 на YouTube — на русском и английском.', href: YT, cta: 'Открыть YouTube' },
        { n: '02', title: 'Закрепляйте с Anki', desc: 'Карточки интервального повторения к каждому разделу.', href: '/anki', cta: 'Anki-карточки' },
        { n: '03', title: 'Вступайте в USMLE Club', desc: 'Конспекты, разборы задач и личный созвон с доктором.', href: '#pricing', cta: 'Смотреть тарифы' },
      ]
    : [
        { n: '01', title: 'Watch free lectures', desc: 'High-yield Step 1 topics on YouTube — in English and Russian.', href: YT, cta: 'Open YouTube' },
        { n: '02', title: 'Lock it in with Anki', desc: 'Spaced-repetition decks for every section.', href: '/anki', cta: 'Anki decks' },
        { n: '03', title: 'Join USMLE Club', desc: 'Notes, case reviews and a personal call with the doctor.', href: '#pricing', cta: 'See pricing' },
      ];
  const resTags = ru ? ['Лекции', 'Anki', 'Задачи'] : ['Lectures', 'Anki', 'Cases'];

  return (
    <main className="page-bg min-h-screen font-sans text-ink">
      <NavBar onCta={openModal} />

      {/* ───────── HERO ───────── */}
      <section id="home" className="px-3 pt-24 md:px-6 md:pt-28">
        <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[1.25fr_1fr]">
          <div className="card relative flex flex-col justify-between overflow-hidden p-7 md:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white/80 px-3.5 py-1.5 text-[13px] text-slate">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-steel opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-slate" />
                  </span>
                  {t('hero.badge')}
                </span>
                <span className="rounded-full bg-slate px-3.5 py-1.5 text-[13px] font-medium tracking-wide text-white">MD · PhD</span>
              </div>
              <h1 className="mt-8 text-[44px] font-medium leading-[0.98] tracking-[-0.04em] text-ink sm:text-[60px] md:text-[76px]">
                {t('hero.title')}
              </h1>
              <p className="mt-5 text-[22px] font-medium leading-snug tracking-[-0.01em] text-steel md:text-[28px]">{t('hero.slogan')}</p>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[17px]">{t('hero.desc')}</p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ArrowButton href={YT} external>
                {t('hero.btn1')}
              </ArrowButton>
              <ArrowButton href="#about" variant="ghost">
                {t('hero.btn2')}
              </ArrowButton>
            </div>
            <Ecg className="pointer-events-none mt-10 h-14 w-full text-steel/60" />
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-steel md:min-h-[560px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(226,240,240,0.55),transparent_65%)]" />
            <Image
              src="/asiia.jpg"
              alt="Dr. Asiia Vinograd"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover object-[50%_18%]"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[22px] border border-white/60 bg-white/80 p-3 pl-5 backdrop-blur-md">
              <div>
                <div className="text-[15px] font-medium text-ink">{ru ? 'Врач-кардиолог, исследователь' : 'Cardiologist & researcher'}</div>
                <div className="text-[13px] text-muted">MD, PhD · USMLE Step 1</div>
              </div>
              <a
                href={YT}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate text-white transition-colors hover:bg-ink"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  <path d="M4 2.5v11l9-5.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mx-auto mt-3 grid max-w-[1240px] grid-cols-2 gap-3 md:grid-cols-4">
          {['1', '2', '3', '4'].map(n => (
            <div key={n} className="card px-6 py-5 md:px-7 md:py-6">
              <div className="text-[34px] font-medium leading-none tracking-[-0.03em] text-slate md:text-[42px]">{t(`hero.stat${n}value`)}</div>
              <div className="mt-2 text-sm text-muted">{t(`hero.stat${n}label`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── HOW TO START ───────── */}
      <section className="px-3 pt-3 md:px-6">
        <div className="mx-auto grid max-w-[1240px] gap-3 md:grid-cols-3">
          {steps.map((s, i) => (
            <a
              key={s.n}
              href={s.href}
              {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`group flex flex-col justify-between rounded-[28px] p-7 transition-colors ${
                i === 2 ? 'bg-slate text-white hover:bg-ink' : 'border border-white bg-white/55 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${i === 2 ? 'text-white/60' : 'text-steel'}`}>
                  {ru ? 'Шаг' : 'Step'} {s.n}
                </span>
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:rotate-45 ${
                    i === 2 ? 'bg-white text-slate' : 'bg-slate text-white'
                  }`}
                >
                  <Arrow />
                </span>
              </div>
              <div className="mt-10">
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em]">{s.title}</h3>
                <p className={`mt-2 text-[15px] leading-relaxed ${i === 2 ? 'text-white/70' : 'text-muted'}`}>{s.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <ProblemSection />

      {/* ───────── ABOUT ───────── */}
      <section id="about" className="px-3 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-[1240px]">
          <SectionHead eyebrow={t('about.tag')} title={t('about.title')} />
          <div className="grid gap-3 lg:grid-cols-[0.8fr_1.4fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-steel">
              <Image src="/asiia-book.jpg" alt="Dr. Asiia Vinograd" fill sizes="(min-width: 1024px) 460px, 100vw" className="object-cover object-[50%_25%]" />
              <div className="absolute left-3 top-3 rounded-full bg-white/85 px-4 py-2 text-[13px] font-medium text-slate backdrop-blur">
                {ru ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd'}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="card-solid p-7 md:p-9">
                <p className="text-[19px] font-medium leading-snug tracking-[-0.01em] text-ink md:text-[22px]">{t('about.p1')}</p>
                <p className="mt-5 text-[16px] leading-relaxed text-muted">{t('about.p2')}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {aboutItems.map((item, i) => (
                  <div key={item.label} className="card flex gap-4 p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-[13px] font-medium text-slate">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="text-[16px] font-medium leading-snug text-ink">{item.label}</div>
                      <div className="mt-1 text-[14px] leading-snug text-muted">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── CURRICULUM ───────── */}
      <section id="curriculum" className="px-3 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-[1240px]">
          <SectionHead eyebrow={t('curriculum.tag')} title={t('curriculum.title')} desc={t('curriculum.desc')} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {curriculumItems.map((item, i) => (
              <a key={item.title} href={`/${item.slug}`} className="card group flex flex-col p-6 transition-colors hover:bg-white md:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-steel">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex items-center gap-2">
                    {item.free && (
                      <span className="rounded-full bg-slate px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                        {t('curriculum.free_badge')}
                      </span>
                    )}
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-mist text-slate transition-all group-hover:rotate-45 group-hover:bg-slate group-hover:text-white">
                      <Arrow />
                    </span>
                  </div>
                </div>
                <h3 className="mt-8 text-[21px] font-medium leading-tight tracking-[-0.02em] text-ink">{item.title}</h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{item.topics}</p>
                <div className="mt-5 flex gap-1.5">
                  {resTags.map(r => (
                    <span key={r} className="rounded-full border border-ink/10 px-2.5 py-1 text-[12px] text-graphite/70">
                      {r}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* Anki · Cases · Medical English */}
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <a href="/anki" className="group flex flex-col rounded-[28px] bg-ink p-7 text-white transition-colors hover:bg-graphite md:p-9">
              <span className="text-sm text-white/45">01</span>
              <h3 className="mt-8 text-[30px] font-medium leading-tight tracking-[-0.03em] md:text-[34px]">{t('curriculum.anki_title')}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/60">{t('curriculum.anki_desc')}</p>
              <span className="mt-8 inline-flex items-center gap-3 text-[15px] font-medium">
                {t('curriculum.anki_cta')}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition-transform group-hover:rotate-45">
                  <Arrow />
                </span>
              </span>
            </a>
            <a href="/cases" className="group flex flex-col rounded-[28px] bg-steel p-7 text-white transition-colors hover:bg-slate md:p-9">
              <span className="text-sm text-white/55">02</span>
              <h3 className="mt-8 text-[30px] font-medium leading-tight tracking-[-0.03em] md:text-[34px]">{t('curriculum.cases_title')}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-white/75">{t('curriculum.cases_desc')}</p>
              <span className="mt-8 inline-flex items-center gap-3 text-[15px] font-medium">
                {t('curriculum.cases_cta')}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate transition-transform group-hover:rotate-45">
                  <Arrow />
                </span>
              </span>
            </a>
            <a href="/medical-english" className="card-solid group flex flex-col p-7 transition-shadow hover:shadow-lg md:p-9">
              <span className="text-sm text-steel">03</span>
              <h3 className="mt-8 text-[30px] font-medium leading-tight tracking-[-0.03em] text-ink md:text-[34px]">{t('curriculum.english_title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{t('curriculum.english_desc')}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {englishFeatures.map((f, i) => (
                  <li key={i} className={`flex items-center gap-2.5 text-[13px] ${i === 0 ? 'text-ink' : 'text-muted'}`}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-slate' : 'bg-muted/40'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-3 text-[15px] font-medium text-ink">
                {t('curriculum.english_cta')}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate text-white transition-transform group-hover:rotate-45">
                  <Arrow />
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── LECTURES ───────── */}
      <section id="lectures" className="px-3 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-[1240px]">
          <SectionHead
            eyebrow={t('lectures.tag')}
            title={t('lectures.title')}
            desc={t('lectures.desc')}
            action={
              <ArrowButton href={YT} external variant="ghost">
                {ru ? 'YouTube @asiiavinogradusmle' : 'YouTube @USMLEforIMG'}
              </ArrowButton>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lectureItems.map(lec => {
              const id = ytId(lec.url);
              return (
                <a
                  key={lec.title}
                  href={lec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden p-2.5 transition-colors hover:bg-white"
                >
                  <div className="relative aspect-video overflow-hidden rounded-[20px] bg-steel">
                    {id && !lec.soon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,#5f8190,#36565f)] p-5">
                        <span className="self-start rounded-full bg-white/15 px-3 py-1 text-[12px] text-white">{ru ? 'Скоро' : 'Coming soon'}</span>
                        <Ecg className="h-10 w-full text-white/50" />
                      </div>
                    )}
                    {!lec.soon && (
                      <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-slate shadow-md">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                          <path d="M4 2.5v11l9-5.5z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-4">
                    <span className="text-[12px] font-medium text-steel">{lec.tag}</span>
                    <h3 className="mt-2 text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">{lec.title}</h3>
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{lec.desc}</p>
                    <span className="mt-4 text-[14px] font-medium text-slate">{lec.soon ? t('lectures.joinBtn') : t('lectures.watchBtn')}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Trending */}
          <div id="trending" className="card-dark mt-3 grid gap-6 p-7 md:grid-cols-[0.8fr_2fr] md:p-10">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] text-white/80">{t('trending.tag')}</span>
              <h3 className="mt-5 text-[30px] font-medium leading-tight tracking-[-0.03em] md:text-[38px]">{t('trending.title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/60">{t('trending.desc')}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {trending.map(item => (
                <div key={item.title} className="rounded-[22px] bg-white/[0.07] p-5 ring-1 ring-white/10">
                  <span className="text-[12px] text-white/50">{item.tag}</span>
                  <div className="mt-6 text-[18px] font-medium leading-snug">{item.title}</div>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PricingSection />

      <FaqSection onAsk={openModal} />

      {/* ───────── CONNECT ───────── */}
      <section id="connect" className="px-3 pb-3 pt-10 md:px-6 md:pt-14">
        <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[32px] bg-steel p-7 text-white md:p-12">
          <Ecg className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-white/15" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] text-white/85">{t('connect.tag')}</span>
              <h2 className="mt-5 text-[38px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[56px]">{t('connect.title')}</h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/75">{t('connect.desc')}</p>
              <div className="mt-8">
                <ArrowButton onClick={openModal} variant="light">
                  {t('nav.cta')}
                </ArrowButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {platforms.map(p => {
                const b = BRANDS[p.name] || BRANDS.Email;
                return (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: b.bg }}
                    className="group flex flex-col justify-between rounded-[20px] p-4 text-white shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5)] ring-1 ring-white/15 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15">{b.icon}</span>
                      <Arrow className="opacity-70 transition-transform group-hover:rotate-45" />
                    </span>
                    <span className="mt-4">
                      <span className="block text-[16px] font-medium">{p.name}</span>
                      <span className="block text-[13px] opacity-80">{p.sub}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} locale={locale} />
    </main>
  );
}
