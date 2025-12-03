import type { Metadata } from "next"

import { SignOutButton } from "@/features/auth/sign-out-button"
import { MyBookings } from "@/features/bookings/my-bookings"
import { isPeriodId } from "@/features/bookings/periods"

export const metadata: Metadata = {
  title: "My bookings · Tonik Parking",
}

export default async function MyBookingsPage({
  searchParams,
}: PageProps<"/bookings">) {
  const params = await searchParams

  return (
    <MyBookings
      period={isPeriodId(params.period) ? params.period : "week"}
      selectedBookingId={
        typeof params.booking === "string" ? params.booking : undefined
      }
      account={<SignOutButton />}
    />
  )
}
