import LECTURES from '@/data/lectures.json';
import { panelDb } from './panel';

// Free lectures (YouTube + our copy on R2 so they play in Russia). Titles/sections from data/lectures.json,
// video/thumb/description/duration from Supabase `materials` (filled by the autopost bot).
export type Lecture = { yt: string; ru: string; en: string; sections: string[] };
export type LectureFull = Lecture & { slug: string; description: string | null; thumb: string; video: string | null; duration: number | null; created: string | null };

export const lectureSlug = (l: Lecture) =>
  l.en.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);

export const allLectures = () => LECTURES as Lecture[];

export async function lecturesFull(): Promise<LectureFull[]> {
  const list = allLectures();
  const byYt: Record<string, { description: string | null; thumb_url: string | null; duration_sec: number | null; created_at: string; video: string | null }> = {};
  try {
    const db = panelDb();
    const { data } = await db.from('materials').select('id,yt_id,description,thumb_url,duration_sec,created_at,material_media(video_url)')
      .eq('access', 'free').eq('lang', 'ru').not('yt_id', 'is', null).limit(1000);
    for (const m of (data as { yt_id: string; description: string | null; thumb_url: string | null; duration_sec: number | null; created_at: string; material_media: { video_url: string | null } | { video_url: string | null }[] | null }[]) || []) {
      const mm = Array.isArray(m.material_media) ? m.material_media[0] : m.material_media;
      byYt[m.yt_id] = { description: m.description, thumb_url: m.thumb_url, duration_sec: m.duration_sec, created_at: m.created_at, video: mm?.video_url || null };
    }
  } catch {}
  return list.map((l) => {
    const x = byYt[l.yt];
    return { ...l, slug: lectureSlug(l), description: x?.description || null, thumb: x?.thumb_url || `https://i.ytimg.com/vi/${l.yt}/hqdefault.jpg`,
             video: x?.video || null, duration: x?.duration_sec || null, created: x?.created_at || null };
  });
}

export const isoDuration = (s: number) => `PT${Math.floor(s / 3600)}H${Math.floor((s % 3600) / 60)}M${Math.round(s % 60)}S`;
