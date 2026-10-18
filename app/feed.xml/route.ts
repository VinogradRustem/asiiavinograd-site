import { rssArticles } from "../../lib/rss-articles";
import { getBlogPost, getBlogPosts, renderMd } from "../../lib/blog";

export const revalidate = 600;

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // Blog articles (RU) for Dzen: newest first, full text
  let blogItems = "";
  try {
    const list = await getBlogPosts("ru", 20);
    const full = await Promise.all(list.map((p) => getBlogPost("ru", p.slug)));
    blogItems = full
      .filter(Boolean)
      .map((p) => {
        const link = `https://www.drasiiavinograd.com/ru/blog/${p!.slug}`;
        const body = renderMd(p!.body).html.replace(/ id="[^"]*"/g, "").replace(/ loading="lazy"/g, "");
        const cover = p!.cover_url ? `<figure><img src="${p!.cover_url}"><figcaption>${escapeXml(p!.title)}</figcaption></figure>` : "";
        return `
    <item>
      <title>${escapeXml(p!.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(p!.published_at).toUTCString()}</pubDate>
      <category>native-draft</category>
      ${p!.cover_url ? `<enclosure url="${p!.cover_url}" type="image/jpeg"/>` : ""}
      <content:encoded><![CDATA[${cover}${body}]]></content:encoded>
    </item>`;
      })
      .join("\n");
  } catch {}
  const items = blogItems + rssArticles
    .map((a) => {
      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${a.link}</link>
      <guid>${a.link}</guid>
      <pubDate>${a.pubDate}</pubDate>
      <category>native-draft</category>
      <enclosure url="${a.coverImage}" type="image/jpeg"/>
      <content:encoded><![CDATA[${a.contentHtml}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Asiia Vinograd — USMLE Step 1</title>
    <link>https://www.drasiiavinograd.com</link>
    <language>ru</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
