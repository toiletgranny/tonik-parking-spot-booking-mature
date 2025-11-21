import type { IsoDate } from "@/lib/dates"

import type { Spot } from "./queries"
import { SpotCard, type SpotStatus } from "./spot-card"

type SpotGridProps = {
  day: IsoDate
  spots: Spot[]
  statusBySpotId: Map<number, SpotStatus>
  selectedSpotLabel?: string
}

export function SpotGrid({
  day,
  spots,
  statusBySpotId,
  selectedSpotLabel,
}: SpotGridProps) {
  return (
    <div className="px-8 pb-8">
      <div className="grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-5">
        {spots.map((spot) => (
          <SpotCard
            key={spot.id}
            href={`/?day=${day}&spot=${spot.label}`}
            label={spot.label}
            status={statusBySpotId.get(spot.id) ?? "available"}
            selected={spot.label === selectedSpotLabel}
          />
        ))}
      </div>
    </div>
  )
}
