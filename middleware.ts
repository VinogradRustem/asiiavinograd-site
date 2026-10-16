import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false
});

export const config = {
  matcher: ['/((?!api|panel|braino|_next|_vercel|.*\\..*).*)']
};
