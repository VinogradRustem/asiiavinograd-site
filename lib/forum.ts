import { createHash } from 'crypto';
import { panelDb } from './panel';

export type Section = {
  id: string; ord: number; name_ru: string; name_en: string;
  desc_ru: string | null; desc_en: string | null; tags_ru: string | null; tags_en: string | null; icon: string | null;
};
export type Topic = {
  id: number; section: string; lang: string; slug: string; title: string; body: string;
  author_name: string; author_kind: string; status: string; views: number; replies: number;
  pinned: boolean; created_at: string; last_at: string;
};
export type Post = {
  id: number; topic_id: number; body: string; author_name: string; author_kind: string;
  status: string; best: boolean; created_at: string;
};

export const db = () => panelDb();

export async function getSections(): Promise<Section[]> {
  const { data } = await db().from('forum_sections').select('*').order('ord');
  return (data as Section[]) || [];
}

export async function getSection(id: string): Promise<Section | null> {
  const { data } = await db().from('forum_sections').select('*').eq('id', id).maybeSingle();
  return (data as Section) || null;
}

// News discussions are auto-created for every blog news article; they live in their own branch
// so the main forum stays for people's questions and Asiia's own path.
export const NEWS_SECTION = 'news';

export async function getTopics(lang: string, section?: string, limit = 50, exclude?: string): Promise<Topic[]> {
  let q = db().from('forum_topics').select('id,section,lang,slug,title,body,author_name,author_kind,status,views,replies,pinned,created_at,last_at')
    .eq('lang', lang).eq('status', 'published');
  if (section) q = q.eq('section', section);
  if (exclude) q = q.neq('section', exclude);
  const { data } = await q.order('pinned', { ascending: false }).order('last_at', { ascending: false }).limit(limit);
  return (data as Topic[]) || [];
}

export async function getPinnedDiary(lang: string): Promise<Topic | null> {
  const { data } = await db().from('forum_topics').select('id,section,lang,slug,title,body,author_name,author_kind,status,views,replies,pinned,created_at,last_at')
    .eq('lang', lang).eq('status', 'published').eq('author_kind', 'asya').eq('pinned', true).order('last_at', { ascending: false }).limit(1);
  return ((data as Topic[]) || [])[0] || null;
}

export async function getTopic(lang: string, slug: string): Promise<Topic | null> {
  const { data } = await db().from('forum_topics').select('*').eq('lang', lang).eq('slug', slug).eq('status', 'published').maybeSingle();
  return (data as Topic) || null;
}

export async function getPosts(topicId: number): Promise<Post[]> {
  const { data } = await db().from('forum_posts').select('id,topic_id,body,author_name,author_kind,status,best,created_at')
    .eq('topic_id', topicId).eq('status', 'published').order('best', { ascending: false }).order('created_at');
  return (data as Post[]) || [];
}

export async function sectionCounts(lang: string): Promise<Record<string, number>> {
  const { data } = await db().from('forum_topics').select('section').eq('lang', lang).eq('status', 'published');
  const out: Record<string, number> = {};
  for (const r of (data as { section: string }[]) || []) out[r.section] = (out[r.section] || 0) + 1;
  return out;
}

const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};
export function slugify(s: string) {
  const t = s.toLowerCase().split('').map(c => (c in TR ? TR[c] : c)).join('');
  return t.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'tema';
}

export function ipHash(ip: string) {
  return createHash('sha256').update(`forum:${ip}:${process.env.PANEL_KEY || ''}`).digest('hex').slice(0, 24);
}

export function excerpt(s: string, n = 180) {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
}

export function fmtDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const KIND_LABEL: Record<string, [string, string]> = {
  asya: ['Доктор Асия Виноград', 'Dr. Asiia Vinograd'],
  team: ['Команда форума', 'Forum team'],
};
