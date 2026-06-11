import type { Metadata } from "next"

import { SectionNav } from "@/components/app-shell"
import { MyBookings } from "@/features/bookings/my-bookings"
import { isPeriodId } from "@/features/bookings/periods"

import { AccountLinks } from "../account-links"
import { navItems } from "../nav-items"

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
      account={<AccountLinks />}
      nav={<SectionNav items={navItems("/bookings")} />}
    />
  )
}
