import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getLocale} from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const ru = locale === 'ru';
  const title = ru ? 'Доктор Асия Виноград — подготовка к USMLE на русском' : 'Dr. Asiia Vinograd | USMLE Educator for IMGs';
  const description = ru
    ? 'Врач-кардиолог MD, PhD готовит русскоязычных врачей к USMLE Step 1: лекции, Anki-карточки, разборы задач и медицинский английский.'
    : 'Practicing cardiologist and USMLE educator helping international medical graduates achieve their dreams of practicing medicine in the United States.';
  const short = ru ? 'Подготовка к USMLE с доктором Асией Виноград' : 'Practicing cardiologist and USMLE educator helping IMGs succeed in the US.';
  return {
    metadataBase: new URL('https://www.drasiiavinograd.com'),
    icons: { icon: '/favicon.svg' },
    title,
    description,
    keywords: ru
      ? ['USMLE', 'USMLE на русском', 'Step 1', 'подготовка к USMLE', 'врач в США', 'медицинский английский']
      : ['USMLE', 'Step 1', 'IMG', 'international medical graduate', 'cardiology', 'USMLE educator'],
    openGraph: {
      title, description: short,
      url: ru ? 'https://www.drasiiavinograd.com/ru' : 'https://www.drasiiavinograd.com',
      siteName: ru ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd',
      images: [{ url: '/asiia.jpg', width: 800, height: 800, alt: ru ? 'Доктор Асия Виноград' : 'Dr. Asiia Vinograd' }],
      type: 'website', locale: ru ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description: short, images: ['/asiia.jpg'] },
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GPYJYFH98N" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPYJYFH98N');
          `}
        </Script>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(114372096, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
          `}
        </Script>
        <noscript><div><img src="https://mc.yandex.ru/watch/114372096" style={{ position: 'absolute', left: '-9999px' }} alt="" /></div></noscript>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
