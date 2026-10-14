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

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: "Dr. Asiia Vinograd | USMLE Educator for IMGs",
  description: "Practicing cardiologist and USMLE educator helping international medical graduates achieve their dreams of practicing medicine in the United States.",
  keywords: ["USMLE", "Step 1", "IMG", "international medical graduate", "cardiology", "USMLE educator"],
  openGraph: {
    title: "Dr. Asiia Vinograd | USMLE Educator",
    description: "Practicing cardiologist and USMLE educator helping IMGs succeed in the US.",
    url: "https://drasiiavinograd.com",
    siteName: "Dr. Asiia Vinograd",
    images: [{ url: "https://drasiiavinograd.com/asiia.jpg", width: 800, height: 800, alt: "Dr. Asiia Vinograd" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Asiia Vinograd | USMLE Educator",
    description: "Practicing cardiologist and USMLE educator helping IMGs succeed in the US.",
    images: ["https://drasiiavinograd.com/asiia.jpg"],
  },
};

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
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
