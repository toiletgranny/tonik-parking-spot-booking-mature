"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export type ProfileFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; savedAt: number }

export async function updateProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const licensePlate = String(formData.get("licensePlate") ?? "")
    .trim()
    .toUpperCase()

  if (!fullName) {
    return { status: "error", message: "Add your name." }
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      license_plate: licensePlate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data!.claims.sub)

  if (error) {
    return { status: "error", message: "We couldn't save your profile." }
  }

  revalidatePath("/", "layout")
  return { status: "success", savedAt: Date.now() }
}
