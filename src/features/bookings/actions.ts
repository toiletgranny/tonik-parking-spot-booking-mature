"use server"

import { revalidatePath } from "next/cache"

import { isIsoDate } from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"

/** An error says what happened (title) and what to do next (description). */
export type BookingError = { title: string; description: string }

export type BookingFormState =
  | { status: "idle" }
  | ({ status: "error" } & BookingError)
  | { status: "success"; bookedAt: number }

const missingDetails: BookingError = {
  title: "Add a name and license plate",
  description: "We need both so everyone knows whose car is in the space.",
}

function fail(error: BookingError): BookingFormState {
  return { status: "error", ...error }
}

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim()
}

export async function createBooking(
  _previousState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const spotId = Number(formData.get("spotId"))
  const day = formData.get("day")
  const driverName = readText(formData, "driverName")
  const licensePlate = readText(formData, "licensePlate").toUpperCase()
  const note = readText(formData, "note")

  if (!Number.isInteger(spotId) || !isIsoDate(day)) {
    return fail({
      title: "We couldn't read this booking",
      description: "Pick the day and space again, then book.",
    })
  }
  if (!driverName || !licensePlate) {
    return fail(missingDetails)
  }

  const supabase = await createClient()
  const { error } = await supabase.from("bookings").insert({
    spot_id: spotId,
    booking_date: day,
    driver_name: driverName,
    license_plate: licensePlate,
    note: note || null,
  })

  if (error?.code === "23505") {
    // Refresh so the space now shows as taken.
    revalidatePath("/")
    revalidatePath("/bookings")
    return fail({
      title: "Someone just booked this space",
      description:
        "Pick another free space for this day. The list is up to date now.",
    })
  }
  // 42501: row-level security refused the insert (the day is in the past).
  if (error?.code === "42501") {
    return fail({
      title: "This day has already passed",
      description: "Pick today or a later workday.",
    })
  }
  // 23514: a check constraint failed (weekend).
  if (error?.code === "23514") {
    return fail({
      title: "You can't book weekends",
      description: "Pick a workday, Monday to Friday.",
    })
  }
  if (error) {
    return fail({
      title: "We couldn't save your booking",
      description: "Nothing was booked. Try again in a moment.",
    })
  }

  revalidatePath("/")
  revalidatePath("/bookings")
  return { status: "success", bookedAt: Date.now() }
}

export async function updateBooking(
  _previousState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const bookingId = String(formData.get("bookingId") ?? "")
  const driverName = readText(formData, "driverName")
  const licensePlate = readText(formData, "licensePlate").toUpperCase()
  const note = readText(formData, "note")

  if (!driverName || !licensePlate) {
    return fail(missingDetails)
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("bookings")
    .update({
      driver_name: driverName,
      license_plate: licensePlate,
      note: note || null,
    })
    .eq("id", bookingId)

  if (error) {
    return fail({
      title: "We couldn't save your changes",
      description: "Your booking is unchanged. Try again in a moment.",
    })
  }

  revalidatePath("/bookings")
  revalidatePath("/")
  return { status: "success", bookedAt: Date.now() }
}

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (error) {
    return { ok: false as const }
  }

  revalidatePath("/bookings")
  revalidatePath("/")
  return { ok: true as const }
}
