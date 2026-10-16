import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { panelDb, panelUser, PANEL_NAMES } from './panel'
import seed from '@/data/braino-seed.json'

export const BRAINO_COOKIE = 'braino_guest'

function sign(v: string) {
  return createHmac('sha256', process.env.BRAINO_PREVIEW_KEY || process.env.PANEL_KEY || 'no-key').update(`braino:${v}`).digest('hex').slice(0, 32)
}
export function guestCookie(name: string) {
  const id = name.toLowerCase().replace(/[^a-z0-9а-яё_-]/gi, '').slice(0, 24) || 'guest'
  return `${id}.${sign(id)}`
}

/** Who is studying: a panel user (Asya, Rustem) or a preview guest who opened the private link. */
export async function brainoUser(): Promise<{ id: string; name: string } | null> {
  const p = await panelUser()
  if (p) return { id: p, name: PANEL_NAMES[p] || p }
  const v = (await cookies()).get(BRAINO_COOKIE)?.value
  if (!v) return null
  const [id, s] = v.split('.')
  if (id && s && s === sign(id)) return { id: `g:${id}`, name: id }
  return null
}

export const db = () => panelDb()

/** First run: fill the draft content from data/braino-seed.json. */
export async function ensureSeed() {
  const d = db()
  const { count } = await d.from('braino_decks').select('id', { count: 'exact', head: true })
  if ((count || 0) > 0) return
  const s = seed as unknown as {
    decks: [string, string, string, number][]
    cards: Record<string, [string, string][]>
    quiz: [string, string, string, boolean, string][]
    tasks: [string, string, string, string, string[], number, string][]
  }
  await d.from('braino_decks').upsert(s.decks.map(([id, section, topic, sort]) => ({ id, section, topic, sort })))
  await d.from('braino_cards').insert(Object.entries(s.cards).flatMap(([deck_id, cs]) => cs.map(([front, back], sort) => ({ deck_id, front, back, sort }))))
  await d.from('braino_quiz').insert(s.quiz.map(([section, topic, statement, answer, explanation]) => ({ section, topic, statement, answer, explanation })))
  await d.from('braino_tasks').insert(s.tasks.map(([section, topic, stem, question, options, correct, explanation]) => ({ section, topic, stem, question, options, correct, explanation })))
}

/** Honest points: reward remembering, not clicking. */
export function cardPoints(rating: number, ms: number, prevState: number, elapsedDays: number) {
  if (ms < 1000 || rating < 3) return 0
  if (prevState !== 2) return 1 // new or learning card got right
  return 1 + Math.min(5, Math.floor(Math.log2(elapsedDays + 1))) // longer remembered = more points
}
export const quizPoints = (correct: boolean, ms: number) => (correct && ms >= 700 ? 2 : 0)
export const taskPoints = (correct: boolean, ms: number) => (correct && ms >= 5000 ? 5 : 0)

export function weekStart(d = new Date()) {
  const x = new Date(d)
  const day = (x.getUTCDay() + 6) % 7 // Monday = 0
  x.setUTCHours(0, 0, 0, 0)
  x.setUTCDate(x.getUTCDate() - day)
  return x
}
