import { SignOutButton } from "@/features/auth/sign-out-button"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  return (
    <main className="flex flex-1 flex-col gap-4 p-8">
      <p className="text-content text-sm">Signed in as {data?.claims.email}</p>
      <SignOutButton />
    </main>
  )
}
