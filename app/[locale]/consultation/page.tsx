import type { Metadata } from 'next';
import Image from 'next/image';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Booking from '@/components/consult/Booking';
import { Check } from '@/components/ui';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === 'ru';
  return {
    title: ru ? 'Менторская консультация по USMLE — доктор Асия Виноград' : 'USMLE mentoring session — Dr. Asiia Vinograd',
    description: ru
      ? 'Час один на один: разберём вашу ситуацию и составим план подготовки к USMLE. Анкета до созвона и письменный план после.'
      : 'One hour one-on-one: we review your situation and build your USMLE study plan. Questionnaire before, written plan after.',
    alternates: { canonical: ru ? '/ru/consultation' : '/consultation', languages: { ru: '/ru/consultation', en: '/consultation' } },
  };
}

export default async function Consultation({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ru = locale === 'ru';
  const t = (r: string, e: string) => (ru ? r : e);
  const included = [
    t('60 минут видеосозвона один на один', '60-minute one-on-one video call'),
    t('Анкета до созвона, чтобы Ася подготовилась заранее', 'A questionnaire before the call so Asiia can prepare'),
    t('Письменный план после: что делать, в каком порядке и по каким материалам', 'A written plan afterwards: what to do, in what order, with which resources'),
  ];
  const topics = [
    t('С чего начать подготовку к USMLE', 'Where to start your USMLE prep'),
    t('План под вашу дату экзамена', 'A plan for your exam date'),
    t('Выбор ресурсов: UWorld, First Aid, Anki', 'Choosing resources: UWorld, First Aid, Anki'),
    t('Разбор пробных тестов и слабых мест', 'Reviewing practice tests and weak spots'),
    t('Путь IMG: ECFMG, Step 2 CK, Match', 'The IMG path: ECFMG, Step 2 CK, Match'),
  ];
  const steps = [
    t('Выберите удобное время', 'Pick a time that suits you'),
    t('Заполните короткую анкету', 'Fill in a short questionnaire'),
    t('Ася подтвердит запись и пришлёт реквизиты для оплаты', 'Asiia confirms and sends payment details'),
    t('Созвон и письменный план', 'The call and your written plan'),
  ];

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <section className="px-3 pt-24 md:px-6 md:pt-28">
          <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[1.25fr_1fr]">
            <div className="card p-7 md:p-10">
              <span className="eyebrow">{t('Менторская консультация', 'Mentoring session')}</span>
              <h1 className="mt-6 text-[36px] font-medium leading-[1.02] tracking-[-0.035em] md:text-[52px]">
                {t('Час с доктором Асией Виноград о вашей подготовке к USMLE', 'One hour with Dr. Asiia Vinograd about your USMLE prep')}
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted md:text-[17px]">
                {t('Разберём вашу ситуацию один на один и составим план, который подходит именно вам.', 'We review your situation one-on-one and build a plan that fits you.')}
              </p>
              <ul className="mt-8 space-y-3.5">
                {included.map(x => (
                  <li key={x} className="flex items-start gap-3 text-[15px] text-graphite">
                    <Check className="mt-0.5 shrink-0 text-slate" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dark flex flex-col justify-between overflow-hidden p-7 md:p-9">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-steel">
                  <Image src="/asiia.jpg" alt="" fill sizes="64px" className="object-cover object-[50%_12%]" />
                </div>
                <div>
                  <div className="text-[17px] font-medium">{t('Доктор Асия Виноград', 'Dr. Asiia Vinograd')}</div>
                  <div className="text-[13px] text-white/60">MD, PhD</div>
                </div>
              </div>
              <div className="mt-10">
                <div className="text-[13px] text-white/60">{t('Стоимость', 'Price')}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-[56px] font-medium leading-none tracking-[-0.04em]">{t('5000 ₽', '$60')}</span>
                  <span className="text-sm text-white/65">{t('/ 60 минут', '/ 60 minutes')}</span>
                </div>
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
          <div className="mx-auto grid max-w-[1240px] gap-3 lg:grid-cols-[1fr_1.5fr]">
            <div className="card p-7 md:p-9">
              <div className="text-[22px] font-medium tracking-[-0.01em]">{t('О чём можно поговорить', 'What we can cover')}</div>
              <ul className="mt-5 space-y-3">
                {topics.map(x => (
                  <li key={x} className="flex items-start gap-3 text-[15px] text-graphite">
                    <Check className="mt-0.5 shrink-0 text-slate" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[13px] leading-relaxed text-muted">
                {t(
                  'Консультация помогает спланировать подготовку и не заменяет официальные правила. Требования и сроки ECFMG и USMLE сверяем на официальных сайтах.',
                  'The session helps you plan your prep and does not replace official rules. ECFMG and USMLE requirements and deadlines are checked on the official websites.'
                )}
              </p>
            </div>
            <Booking lang={locale} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
