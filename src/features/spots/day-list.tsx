import { ListItem } from "@/components/app-shell"
import { formatDay, type IsoDate } from "@/lib/dates"

type DayListProps = {
  days: IsoDate[]
  selectedDay: IsoDate
  spotCount: number
  takenCountByDay: Map<IsoDate, number>
}

function freeSpacesCaption(free: number) {
  if (free <= 0) return "Full"
  return free === 1 ? "1 space" : `${free} spaces`
}

export function DayList({
  days,
  selectedDay,
  spotCount,
  takenCountByDay,
}: DayListProps) {
  return (
    <div className="flex flex-col">
      {days.map((day) => (
        <ListItem
          key={day}
          href={`/?day=${day}`}
          label={formatDay(day)}
          caption={freeSpacesCaption(
            spotCount - (takenCountByDay.get(day) ?? 0),
          )}
          active={day === selectedDay}
        />
      ))}
    </div>
  )
}
