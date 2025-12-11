import Link from "next/link"
import type { ReactNode } from "react"

import {
  AppShell,
  ContentWithDetails,
  ListItem,
  SectionNav,
} from "@/components/app-shell"
import { formatDay, todayInOffice } from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

import { BookingDetailsForm } from "./booking-details-form"
import { isInPeriod, PERIODS, type PeriodId } from "./periods"

type MyBookingsProps = {
  period: PeriodId
  selectedBookingId?: string
  account: ReactNode
}

function bookingsCaption(count: number) {
  return count === 1 ? "1 booking" : `${count} bookings`
}

export async function MyBookings({
  period,
  selectedBookingId,
  account,
}: MyBookingsProps) {
  const supabase = await createClient()
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      "id, booking_date, driver_name, license_plate, note, parking_spots(label)",
    )
    .order("booking_date", { ascending: false })

  if (error) throw error

  const today = todayInOffice()
  const periodLabel = PERIODS.find((p) => p.id === period)!.label
  const shown = bookings.filter((b) =>
    isInPeriod(b.booking_date, period, today),
  )
  const days = [...new Set(shown.map((b) => b.booking_date))]
  const selected = shown.find((b) => b.id === selectedBookingId)

  return (
    <AppShell
      eyebrow="Selected period"
      title={periodLabel}
      account={account}
      nav={
        <SectionNav
          items={[
            { href: "/", label: "Book a space", current: false },
            { href: "/bookings", label: "My bookings", current: true },
          ]}
        />
      }
      sidebar={
        <div className="flex flex-col">
          {PERIODS.map((p) => (
            <ListItem
              key={p.id}
              href={`/bookings?period=${p.id}`}
              label={p.label}
              caption={bookingsCaption(
                bookings.filter((b) => isInPeriod(b.booking_date, p.id, today))
                  .length,
              )}
              active={p.id === period}
            />
          ))}
        </div>
      }
    >
      <ContentWithDetails
        details={
          selected ? (
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2 px-8">
                <p className="text-xs text-muted-foreground">Space</p>
                <p className="text-2xl tracking-[-0.04em]">
                  {selected.parking_spots.label}
                </p>
              </div>
              <BookingDetailsForm
                key={selected.id}
                booking={{
                  id: selected.id,
                  driverName: selected.driver_name,
                  licensePlate: selected.license_plate,
                  note: selected.note,
                }}
                afterDeleteHref={`/bookings?period=${period}`}
              />
            </div>
          ) : (
            <p className="px-8 text-xs text-muted-foreground">
              Select a booking to see its details
            </p>
          )
        }
      >
        {days.length === 0 && <p className="p-8 text-sm">No bookings.</p>}
        {days.map((day) => (
          <div key={day} className="flex flex-col">
            <h2 className="p-8 text-sm font-medium">{formatDay(day)}</h2>
            <div className="flex flex-col gap-2 px-8">
              {shown
                .filter((b) => b.booking_date === day)
                .map((booking) => {
                  const isSelected = booking.id === selected?.id
                  return (
                    <Link
                      key={booking.id}
                      href={`/bookings?period=${period}&booking=${booking.id}`}
                      scroll={false}
                      aria-current={isSelected ? "true" : undefined}
                      className={cn(
                        "relative flex flex-col gap-4 overflow-hidden border p-4",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "striped bg-muted",
                      )}
                    >
                      <span className="text-4xl tracking-[-0.04em]">
                        {booking.parking_spots.label}
                      </span>
                      <span className="flex min-h-32 flex-col justify-end text-sm">
                        {isSelected ? (
                          <span>Selected</span>
                        ) : (
                          <>
                            <span className="text-content">Reserved</span>
                            <span className="truncate text-muted-foreground">
                              {booking.driver_name}
                            </span>
                          </>
                        )}
                      </span>
                    </Link>
                  )
                })}
            </div>
          </div>
        ))}
      </ContentWithDetails>
    </AppShell>
  )
}
