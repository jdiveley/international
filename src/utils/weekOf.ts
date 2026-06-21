// Week 1 = March 29, 2026 (first Sunday of the cooking project)
const WEEK1 = new Date('2026-03-29')

export function weekOfDate(dateStr: string): number {
  const ms = new Date(dateStr).getTime() - WEEK1.getTime()
  return Math.max(1, Math.floor(ms / (7 * 24 * 60 * 60 * 1000)) + 1)
}

export function weekStartDate(weekNum: number): Date {
  const d = new Date(WEEK1)
  d.setUTCDate(d.getUTCDate() + (weekNum - 1) * 7)
  return d
}

export function weekLabel(weekNum: number): string {
  return weekStartDate(weekNum).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

export function currentWeek(): number {
  return weekOfDate(new Date().toISOString().split('T')[0])
}
