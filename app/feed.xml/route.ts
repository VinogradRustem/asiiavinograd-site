import { rssArticles } from "../../lib/rss-articles";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = rssArticles
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
