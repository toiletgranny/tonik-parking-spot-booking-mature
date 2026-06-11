import Link from "next/link"

import { formatDay, type IsoDate } from "@/lib/dates"
import { cn } from "@/lib/utils"

/** At or above this share of taken spaces, a day is "nearly full". */
const NEARLY_FULL = 0.8

export type DayOccupancy = {
  day: IsoDate
  taken: number
  total: number
}

type WeekOverviewProps = {
  days: DayOccupancy[]
  today: IsoDate
}

function status({ taken, total }: DayOccupancy) {
  if (taken >= total) return "Full"
  if (taken / total >= NEARLY_FULL) return "Nearly full"
  return null
}

export function WeekOverview({ days, today }: WeekOverviewProps) {
  return (
    <ul className="flex flex-col px-8 pb-8">
      {days.map((occupancy) => {
        const { day, taken, total } = occupancy
        const isPast = day < today
        const label = status(occupancy)
        const percent = total === 0 ? 0 : Math.round((taken / total) * 100)

        const row = (
          <>
            <span className="text-sm">{formatDay(day)}</span>
            <span
              className="h-2 w-full bg-muted"
              role="img"
              aria-label={`${taken} of ${total} spaces taken`}
            >
              <span
                className="block h-full bg-primary"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
              {label && (
                <span className="border border-border-accent px-2 py-0.5 text-xs text-foreground">
                  {label}
                </span>
              )}
              {taken} of {total} taken
            </span>
          </>
        )

        const rowClass =
          "grid grid-cols-1 items-center gap-3 border-b py-6 sm:grid-cols-[12rem_minmax(0,1fr)_14rem] sm:gap-8"

        return (
          <li key={day}>
            {isPast ? (
              <div className={cn(rowClass, "opacity-50")}>{row}</div>
            ) : (
              <Link
                href={`/?day=${day}`}
                className={cn(rowClass, "hover:bg-muted/50")}
              >
                {row}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
