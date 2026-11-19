import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Waitlist from '@/components/club/Waitlist';
import { Check } from '@/components/ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === 'ru';
  return {
    title: ru ? 'USMLE Club — лист ожидания, $35 для первых участников' : 'USMLE Club — waitlist, $35 for early members',
    description: ru
      ? 'Системная подготовка к USMLE Step 1 с доктором Асией Виноград. Запишитесь в лист ожидания и вступите по цене $35 в месяц.'
      : 'Structured USMLE Step 1 prep with Dr. Asiia Vinograd. Join the waitlist and get in at $35 a month.',
    alternates: { canonical: ru ? '/ru/club' : '/club', languages: { ru: '/ru/club', en: '/club' } },
  };
}

export default async function Club({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ru = locale === 'ru';
  const t = (r: string, e: string) => (ru ? r : e);
  const features = ru
    ? ['2 занятия в неделю по разделам Step 1', 'Разборы задач по всем разделам', 'Воскресный медицинский английский', 'Колоды Anki по каждому разделу на русском и английском', 'PDF-конспекты и план подготовки по First Aid', 'Вопросы доктору Асе в закрытой группе']
    : ['2 recorded lessons a week by Step 1 discipline', 'Question breakdowns for every discipline', 'Anki decks for every discipline', 'PDF notes and a First Aid study plan', 'Ask questions in the Discord community'];
  const steps = [
    t('Оставьте имя и Telegram', 'Leave your name and contact'),
    t('В день запуска получите ссылку на вступление', 'Get the join link on launch day'),
    t('Вступаете по $35 в месяц, дальше цена для новых будет $50', 'Join at $35 a month; later members pay $50'),
  ];

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <section className="px-3 pt-24 md:px-6 md:pt-28">
          <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[1.25fr_1fr]">
            <div className="card p-7 md:p-10">
              <span className="eyebrow">USMLE Club</span>
              <h1 className="mt-6 text-[36px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[52px]">
                {t('Клуб скоро откроется. Займите место по цене первых участников', 'The club opens soon. Save your early-member spot')}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted md:text-[17px]">
                {t('Системная подготовка к Step 1 вместе с доктором Асией Виноград: по разделам, в своём темпе, с материалами на русском.', 'Structured Step 1 prep with Dr. Asiia Vinograd: discipline by discipline, at your own pace.')}
              </p>
              <ul className="mt-8 space-y-3.5">
                {features.map(x => (
                  <li key={x} className="flex items-start gap-3 text-[15px] text-graphite">
                    <Check className="mt-0.5 shrink-0 text-slate" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dark flex flex-col justify-between p-7 md:p-9">
              <div>
                <div className="text-[13px] text-white/60">{t('Цена для листа ожидания', 'Waitlist price')}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[56px] font-medium leading-none tracking-[-0.04em]">$35</span>
                  <span className="text-sm text-white/65">{t('/ месяц', '/ month')}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/60">{t('После запуска для новых участников $50. Отменить можно в любой момент.', 'After launch, new members pay $50. Cancel anytime.')}</p>
              </div>
              <ol className="mt-8 space-y-2.5">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 text-[14px] text-white/80">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 text-[12px]">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <section className="px-3 py-10 md:px-6 md:py-14">
          <div className="mx-auto max-w-[720px]">
            <Waitlist lang={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
