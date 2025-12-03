import { addDays, startOfWeek, type IsoDate } from "@/lib/dates"

export const PERIODS = [
  { id: "all", label: "All time" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
] as const

export type PeriodId = (typeof PERIODS)[number]["id"]

export function isPeriodId(value: unknown): value is PeriodId {
  return PERIODS.some((period) => period.id === value)
}

/** Whether `day` falls in the period around `today`. */
export function isInPeriod(day: IsoDate, period: PeriodId, today: IsoDate) {
  switch (period) {
    case "all":
      return true
    case "week": {
      const monday = startOfWeek(today)
      return day >= monday && day <= addDays(monday, 6)
    }
    case "month":
      return day.slice(0, 7) === today.slice(0, 7)
    case "year":
      return day.slice(0, 4) === today.slice(0, 4)
  }
}
