import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { blogBase, fmtBlogDate, getBlogPost, getBlogPosts, renderMd } from '@/lib/blog';

export const revalidate = 300;

type P = { params: Promise<{ locale: string; slug: string }> };
const B = 'https://drasiiavinograd.com';

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getBlogPost(locale, slug);
  if (!p) return {};
  const self = `${blogBase(locale)}/${p.slug}`;
  const other = locale === 'ru' ? 'en' : 'ru';
  const languages: Record<string, string> = { [locale]: self };
  if (p.pair_slug) languages[other] = `${blogBase(other)}/${p.pair_slug}`;
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: self, languages },
    openGraph: {
      type: 'article', title: p.title, description: p.description, url: `${B}${self}`,
      images: p.cover_url ? [{ url: p.cover_url, width: 1280, height: 720 }] : undefined,
      publishedTime: p.published_at, locale: locale === 'ru' ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images: p.cover_url ? [p.cover_url] : undefined },
  };
}

export default async function BlogPostPage({ params }: P) {
  const { locale, slug } = await params;
  const ru = locale === 'ru';
  const base = blogBase(locale);
  const p = await getBlogPost(locale, slug);
  if (!p) notFound();
  const { html, toc, faq } = renderMd(p.body);
  const more = (await getBlogPosts(locale, 5)).filter(x => x.slug !== p.slug).slice(0, 4);
  const url = `${B}${base}/${p.slug}`;
  const team = ru ? 'Команда проекта Dr. Asiia Vinograd' : 'Dr. Asiia Vinograd team';
  const ld: object[] = [{
    '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description,
    image: p.cover_url ? [p.cover_url] : undefined, datePublished: p.published_at, dateModified: p.updated_at,
    inLanguage: locale, mainEntityOfPage: url, keywords: p.keywords?.join(', '),
    author: { '@type': 'Organization', name: team, url: B },
    publisher: { '@type': 'Organization', name: 'Dr. Asiia Vinograd · USMLE', url: B },
    citation: p.source_url || undefined,
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: ru ? 'Главная' : 'Home', item: ru ? `${B}/ru` : B },
      { '@type': 'ListItem', position: 2, name: ru ? 'Блог' : 'Blog', item: `${B}${base}` },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  }];
  if (faq.length) ld.push({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  });

  return (
    <>
      <NavBar />
      <main className="page-bg min-h-screen font-sans text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
        <div className="mx-auto max-w-[1240px] px-3 pb-16 pt-24 md:px-6 md:pt-28">
          <nav className="mb-5 text-sm text-muted">
            <a href={ru ? '/ru' : '/'} className="hover:text-ink">{ru ? 'Главная' : 'Home'}</a> <span className="mx-1.5">/</span>
            <a href={base} className="hover:text-ink">{ru ? 'Блог' : 'Blog'}</a>
          </nav>
          <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
            <article className="card-solid overflow-hidden">
              {p.cover_url && (
                <figure className="m-0">
                  <img src={p.cover_url} alt={p.title} className="aspect-[16/9] w-full object-cover" />
                  {p.cover_credit && <figcaption className="px-7 pt-2 text-[12px] text-muted md:px-10">{ru ? 'Фото' : 'Photo'}: {p.cover_credit}</figcaption>}
                </figure>
              )}
              <div className="p-7 md:p-10">
                <h1 className="text-[30px] font-medium leading-[1.08] tracking-[-0.03em] md:text-[44px]">{p.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-2 text-[13px] text-muted">
                  <span className="font-medium text-graphite">{team}</span>
                  <span>· {fmtBlogDate(p.published_at, locale)}</span>
                  <span>· {p.reading_min} {ru ? 'мин чтения' : 'min read'}</span>
                </div>
                <div className="blog-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />
                {p.source_url && (
                  <div className="mt-10 rounded-2xl bg-mist/60 p-5 text-[14px] leading-relaxed text-graphite">
                    {ru ? 'Источник' : 'Source'}:{' '}
                    <a href={p.source_url} target="_blank" rel="noopener nofollow" className="underline underline-offset-4">{p.source_name || p.source_url}</a>
                    <p className="mt-2 text-[12.5px] text-muted">
                      {ru
                        ? 'Статья подготовлена командой проекта по материалам источника. Она не является медицинской рекомендацией.'
                        : 'Prepared by the project team from the source material. Not medical advice.'}
                    </p>
                  </div>
                )}
              </div>
            </article>
            <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
              {toc.length > 2 && (
                <div className="card-solid p-6">
                  <div className="mb-3 text-[15px] font-medium">{ru ? 'Содержание' : 'Contents'}</div>
                  <ul className="space-y-2 text-[14px] text-graphite/80">
                    {toc.map(h => <li key={h.id}><a href={`#${h.id}`} className="hover:text-ink">{h.text}</a></li>)}
                  </ul>
                </div>
              )}
              <div className="card-dark p-6">
                <div className="text-[16px] font-medium">{ru ? 'Готовитесь к USMLE?' : 'Preparing for the USMLE?'}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                  {ru ? 'Бесплатное сообщество: новости, лекции и разборы каждый день.' : 'Free community: lectures, case reviews and Q&A with Dr. Vinograd.'}
                </p>
                <a href={ru ? 'https://t.me/usmle_img_community' : 'https://discord.gg/86urfUgPmF'} target="_blank" rel="noopener"
                   className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate">
                  {ru ? 'Вступить в Telegram' : 'Join on Discord'}
                </a>
                <a href={ru ? '/ru#lectures' : '/#lectures'} className="mt-3 block text-sm text-white/80 underline underline-offset-4">
                  {ru ? 'Бесплатные лекции' : 'Free lectures'}
                </a>
              </div>
              {more.length > 0 && (
                <div className="card-solid p-6">
                  <div className="mb-3 text-[15px] font-medium">{ru ? 'Ещё в блоге' : 'More from the blog'}</div>
                  <ul className="space-y-3">
                    {more.map(m => (
                      <li key={m.id}><a href={`${base}/${m.slug}`} className="text-[14px] leading-snug text-graphite hover:text-ink">{m.title}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
