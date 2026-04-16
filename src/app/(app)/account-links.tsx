import Link from "next/link"

import { SignOutButton } from "@/features/auth/sign-out-button"

/** Profile and sign-out links in the top-left corner of every page. */
export function AccountLinks() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <Link href="/profile" className="hover:underline">
        Profile
      </Link>
      <SignOutButton />
    </div>
  )
}
