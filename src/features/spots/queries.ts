import type { IsoDate } from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"

export type Spot = { id: number; label: string }
export type TakenSpot = { spotId: number; day: IsoDate }

export async function getSpots(): Promise<Spot[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("parking_spots")
    .select("id, label")
    .eq("is_active", true)
    .order("sort_order")

  if (error) throw error
  return data
}

/** Which spots are taken on each day in the range. Never says who took them. */
export async function getTakenSpots(
  from: IsoDate,
  to: IsoDate,
): Promise<TakenSpot[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("get_taken_spots", {
    from_date: from,
    to_date: to,
  })

  if (error) throw error
  return data.map((row) => ({ spotId: row.spot_id, day: row.booking_date }))
}
