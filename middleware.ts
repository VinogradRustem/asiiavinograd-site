import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false
});

export const config = {
  matcher: ['/((?!api|panel|_next|_vercel|.*\\..*).*)']
};
