import {
  AppShell,
  ContentWithDetails,
  SectionNav,
} from "@/components/app-shell"
import { SignOutButton } from "@/features/auth/sign-out-button"
import { getOwnBookings } from "@/features/bookings/queries"
import { SpotDetails } from "@/features/bookings/spot-details"
import { DayList } from "@/features/spots/day-list"
import { getSpots, getTakenSpots } from "@/features/spots/queries"
import type { SpotStatus } from "@/features/spots/spot-card"
import { SpotGrid } from "@/features/spots/spot-grid"
import {
  formatDay,
  isIsoDate,
  todayInOffice,
  upcomingWorkdays,
} from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"

const DAYS_SHOWN = 10

export default async function BookPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams
  const days = upcomingWorkdays(todayInOffice(), DAYS_SHOWN)
  const firstDay = days[0]
  const lastDay = days[days.length - 1]
  const selectedDay =
    isIsoDate(params.day) && days.includes(params.day) ? params.day : firstDay
  const selectedSpotLabel =
    typeof params.spot === "string" ? params.spot : undefined

  const supabase = await createClient()
  const [{ data: auth }, spots, takenSpots, ownBookings] = await Promise.all([
    supabase.auth.getClaims(),
    getSpots(),
    getTakenSpots(firstDay, lastDay),
    getOwnBookings(firstDay, lastDay),
  ])

  const takenCountByDay = new Map<string, number>()
  for (const taken of takenSpots) {
    takenCountByDay.set(taken.day, (takenCountByDay.get(taken.day) ?? 0) + 1)
  }

  const statusBySpotId = new Map<number, SpotStatus>()
  for (const taken of takenSpots) {
    if (taken.day === selectedDay) statusBySpotId.set(taken.spotId, "taken")
  }
  for (const booking of ownBookings) {
    if (booking.day === selectedDay) statusBySpotId.set(booking.spotId, "mine")
  }

  const selectedSpot = spots.find((spot) => spot.label === selectedSpotLabel)
  const selectedStatus = selectedSpot
    ? (statusBySpotId.get(selectedSpot.id) ?? "available")
    : undefined
  const ownBookingOnSpot = ownBookings.find(
    (booking) =>
      booking.day === selectedDay && booking.spotId === selectedSpot?.id,
  )
  const defaultName = String(auth?.claims.user_metadata?.full_name ?? "")

  return (
    <AppShell
      eyebrow="Selected day"
      title={formatDay(selectedDay)}
      account={<SignOutButton />}
      nav={
        <SectionNav
          items={[
            { href: "/", label: "Book a space", current: true },
            { href: "/bookings", label: "My bookings", current: false },
          ]}
        />
      }
      sidebar={
        <DayList
          days={days}
          selectedDay={selectedDay}
          spotCount={spots.length}
          takenCountByDay={takenCountByDay}
        />
      }
    >
      <ContentWithDetails
        title="Select a space"
        details={
          !selectedSpot ? (
            <SpotDetails state="empty" />
          ) : selectedStatus === "mine" && ownBookingOnSpot ? (
            <SpotDetails
              state="mine"
              spotLabel={selectedSpot.label}
              booking={ownBookingOnSpot}
            />
          ) : selectedStatus === "taken" ? (
            <SpotDetails state="taken" spotLabel={selectedSpot.label} />
          ) : (
            <SpotDetails
              key={`${selectedDay}-${selectedSpot.id}`}
              state="available"
              spotId={selectedSpot.id}
              spotLabel={selectedSpot.label}
              day={selectedDay}
              defaultName={defaultName}
            />
          )
        }
      >
        <SpotGrid
          day={selectedDay}
          spots={spots}
          statusBySpotId={statusBySpotId}
          selectedSpotLabel={selectedSpotLabel}
        />
      </ContentWithDetails>
    </AppShell>
  )
}
