import type { Metadata } from "next"

import { AppShell, SectionNav } from "@/components/app-shell"
import { getProfile } from "@/features/profile/queries"
import { ProfileForm } from "@/features/profile/profile-form"

import { AccountLinks } from "../account-links"

export const metadata: Metadata = {
  title: "Profile · Tonik Parking",
}

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <AppShell
      eyebrow="Your profile"
      title={profile.fullName || "Your profile"}
      account={<AccountLinks />}
      nav={
        <SectionNav
          items={[
            { href: "/", label: "Book a space", current: false },
            { href: "/bookings", label: "My bookings", current: false },
          ]}
        />
      }
      sidebar={null}
    >
      <section className="flex flex-col">
        <h2 className="p-6 text-sm font-medium">Details</h2>
        <ProfileForm profile={profile} />
      </section>
    </AppShell>
  )
}
