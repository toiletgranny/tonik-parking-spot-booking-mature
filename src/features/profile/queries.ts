import { createClient } from "@/lib/supabase/server"

export type Profile = {
  fullName: string
  licensePlate: string | null
}

export async function getProfile(): Promise<Profile> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, license_plate")
    .single()

  if (error) throw error
  return { fullName: data.full_name, licensePlate: data.license_plate }
}
