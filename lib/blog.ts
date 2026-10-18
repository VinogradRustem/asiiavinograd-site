import { panelDb } from './panel';

export type BlogPost = {
  id: number; lang: string; slug: string; title: string; description: string; body: string;
  cover_url: string | null; cover_credit: string | null; images: { url: string; alt: string; credit: string }[];
  keywords: string[]; source_name: string | null; source_url: string | null; pair_slug: string | null;
  reading_min: number; published_at: string; updated_at: string;
};

const LIST = 'id,lang,slug,title,description,cover_url,reading_min,published_at,keywords';

export async function getBlogPosts(lang: string, limit = 60): Promise<BlogPost[]> {
  const { data } = await panelDb().from('blog_posts').select(LIST)
    .eq('lang', lang).eq('status', 'published').order('published_at', { ascending: false }).limit(limit);
  return (data as BlogPost[]) || [];
}

export async function getBlogPost(lang: string, slug: string): Promise<BlogPost | null> {
  const { data } = await panelDb().from('blog_posts').select('*')
    .eq('lang', lang).eq('slug', slug).eq('status', 'published').maybeSingle();
  return (data as BlogPost) || null;
}

export function blogBase(lang: string) {
  return lang === 'ru' ? '/ru/blog' : '/blog';
}

export function fmtBlogDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function inline(s: string) {
  let t = esc(s);
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_m, txt, url) => {
    const ext = url.startsWith('http') && !url.includes('drasiiavinograd.com');
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener nofollow"' : ''}>${txt}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return t;
}

export function slugId(s: string) {
  return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 60);
}

/** Minimal, safe Markdown renderer for generated articles. */
export function renderMd(md: string): { html: string; toc: { id: string; text: string }[]; faq: { q: string; a: string }[] } {
  const lines = md.replace(/\r/g, '').split('\n');
  const out: string[] = [];
  const toc: { id: string; text: string }[] = [];
  const faq: { q: string; a: string }[] = [];
  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inFaq = false;
  let lastQ: string | null = null;
  const flushP = () => {
    if (para.length) {
      const txt = para.join(' ');
      out.push(`<p>${inline(txt)}</p>`);
      if (inFaq && lastQ) { faq.push({ q: lastQ, a: txt.replace(/\*\*/g, '') }); lastQ = null; }
      para = [];
    }
  };
  const flushL = () => {
    if (list) { out.push(`<${list.type}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.type}>`); list = null; }
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flushP(); flushL(); continue; }
    let m: RegExpMatchArray | null;
    if ((m = l.match(/^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)$/))) {
      flushP(); flushL();
      out.push(`<figure><img src="${esc(m[2])}" alt="${esc(m[1])}" loading="lazy" /></figure>`);
    } else if ((m = l.match(/^##\s+(.+)/)) && !l.startsWith('###')) {
      flushP(); flushL();
      const id = slugId(m[1]);
      toc.push({ id, text: m[1].replace(/\*\*/g, '') });
      inFaq = /частые вопросы|faq|frequently/i.test(m[1]);
      out.push(`<h2 id="${id}">${inline(m[1])}</h2>`);
    } else if ((m = l.match(/^###\s+(.+)/))) {
      flushP(); flushL();
      if (inFaq) lastQ = m[1].replace(/\*\*/g, '');
      out.push(`<h3>${inline(m[1])}</h3>`);
    } else if ((m = l.match(/^[-*•]\s+(.+)/))) {
      flushP();
      if (!list || list.type !== 'ul') { flushL(); list = { type: 'ul', items: [] }; }
      list.items.push(m[1]);
    } else if ((m = l.match(/^\d+[.)]\s+(.+)/))) {
      flushP();
      if (!list || list.type !== 'ol') { flushL(); list = { type: 'ol', items: [] }; }
      list.items.push(m[1]);
    } else if (l.startsWith('# ')) {
      continue; // page already has the H1
    } else {
      flushL();
      para.push(l);
    }
  }
  flushP(); flushL();
  return { html: out.join('\n'), toc, faq };
}
