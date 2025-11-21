/**
 * Dates in this app are plain calendar days ("2026-04-03"), stored in the
 * database as `date`. We never turn them into a moment in time, so a booking
 * can't jump a day when the browser and the server are in different time zones.
 */

/** The office's time zone. "Today" is today in Warsaw, wherever the code runs. */
export const OFFICE_TIME_ZONE = "Europe/Warsaw"

/** A calendar day as an ISO string, e.g. "2026-04-03". */
export type IsoDate = string

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === "string" && ISO_DATE.test(value)
}

export function todayInOffice(now: Date = new Date()): IsoDate {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OFFICE_TIME_ZONE,
  }).format(now)
}

function toUtcDate(day: IsoDate): Date {
  return new Date(`${day}T00:00:00Z`)
}

function fromUtcDate(date: Date): IsoDate {
  return date.toISOString().slice(0, 10)
}

export function addDays(day: IsoDate, amount: number): IsoDate {
  const date = toUtcDate(day)
  date.setUTCDate(date.getUTCDate() + amount)
  return fromUtcDate(date)
}

export function isWeekend(day: IsoDate): boolean {
  const weekday = toUtcDate(day).getUTCDay()
  return weekday === 0 || weekday === 6
}

/** The next `count` working days (Mon–Fri), starting with `from` if it's one. */
export function upcomingWorkdays(from: IsoDate, count: number): IsoDate[] {
  const days: IsoDate[] = []
  let day = from
  while (days.length < count) {
    if (!isWeekend(day)) days.push(day)
    day = addDays(day, 1)
  }
  return days
}

/** "Friday, April 3" */
export function formatDay(day: IsoDate): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(day))
}
