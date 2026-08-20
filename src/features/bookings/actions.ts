"use server"

import { revalidatePath } from "next/cache"

import { isIsoDate } from "@/lib/dates"
import { createClient } from "@/lib/supabase/server"

export type BookingFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; bookedAt: number }

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
    return { status: "error", message: "Pick a day and a space first." }
  }
  if (!driverName || !licensePlate) {
    return {
      status: "error",
      message: "Add a name and a license plate.",
    }
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
    return {
      status: "error",
      message: "Someone has just booked this space. Pick another one.",
    }
  }
  // 42501: row-level security refused the insert (the day is in the past).
  // 23514: a check constraint failed (weekend).
  if (error?.code === "42501" || error?.code === "23514") {
    return {
      status: "error",
      message: "You can only book workdays from today onwards.",
    }
  }
  if (error) {
    return {
      status: "error",
      message: "We couldn't save your booking. Try again.",
    }
  }

  revalidatePath("/")
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
    return {
      status: "error",
      message: "Add a name and a license plate.",
    }
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
    return { status: "error", message: "We couldn't save your changes." }
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
