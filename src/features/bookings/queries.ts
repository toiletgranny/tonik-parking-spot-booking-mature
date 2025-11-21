import type { IsoDate } from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"

export type Booking = {
  id: string
  spotId: number
  day: IsoDate
  driverName: string
  licensePlate: string
  note: string | null
}

/** The signed-in person's bookings between two days (inclusive). */
export async function getOwnBookings(
  from: IsoDate,
  to: IsoDate,
): Promise<Booking[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("id, spot_id, booking_date, driver_name, license_plate, note")
    .gte("booking_date", from)
    .lte("booking_date", to)
    .order("booking_date")

  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    spotId: row.spot_id,
    day: row.booking_date,
    driverName: row.driver_name,
    licensePlate: row.license_plate,
    note: row.note,
  }))
}
