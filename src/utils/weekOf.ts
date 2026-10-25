import type { BlogPost } from '../types'

const DAY = 24 * 60 * 60 * 1000

// The schedule is anchored on the most recent journal entry, so skipped weeks
// (e.g. being sick) shift all future weeks. Before any entries exist, fall back
// to Week 1 = March 29, 2026 (first Sunday of the cooking project).
export type WeekAnchor = { weekNumber: number; date: string }
const DEFAULT_ANCHOR: WeekAnchor = { weekNumber: 1, date: '2026-03-29' }

export function weekAnchor(posts: Pick<BlogPost, 'weekNumber' | 'date'>[]): WeekAnchor {
  return posts.reduce<WeekAnchor>(
    (best, p) => (p.weekNumber > best.weekNumber ? { weekNumber: p.weekNumber, date: p.date } : best),
    posts.length ? { weekNumber: 0, date: DEFAULT_ANCHOR.date } : DEFAULT_ANCHOR,
  )
}

// Sunday nearest to the given YYYY-MM-DD date (a Saturday cook rounds forward, a Monday back)
export function weekStartOfDate(dateStr: string): Date {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + (d.getUTCDay() <= 3 ? -d.getUTCDay() : 7 - d.getUTCDay()))
  return d
}

export function weekOfDate(dateStr: string, anchor: WeekAnchor = DEFAULT_ANCHOR): number {
  const ms = weekStartOfDate(dateStr).getTime() - weekStartOfDate(anchor.date).getTime()
  return Math.max(1, anchor.weekNumber + Math.round(ms / (7 * DAY)))
}

export function weekStartDate(weekNum: number, anchor: WeekAnchor = DEFAULT_ANCHOR): Date {
  const d = weekStartOfDate(anchor.date)
  d.setUTCDate(d.getUTCDate() + (weekNum - anchor.weekNumber) * 7)
  return d
}

export function formatDate(d: Date, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }): string {
  return d.toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' })
}

export function weekLabel(weekNum: number, anchor: WeekAnchor = DEFAULT_ANCHOR): string {
  return formatDate(weekStartDate(weekNum, anchor))
}

// "Week of" label for an existing entry, based on the date it was actually cooked
export function postWeekLabel(post: Pick<BlogPost, 'date'>): string {
  return formatDate(weekStartOfDate(post.date))
}

// Today's date in US Central time (where we cook), as YYYY-MM-DD
export function todayStr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
}

export function currentWeek(anchor: WeekAnchor = DEFAULT_ANCHOR): number {
  return weekOfDate(todayStr(), anchor)
}
