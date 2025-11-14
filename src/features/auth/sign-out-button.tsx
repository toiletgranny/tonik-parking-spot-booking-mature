import { Button } from "@/components/ui/button"

import { signOut } from "./actions"

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="link" size="sm" className="h-auto px-0">
        Sign out
      </Button>
    </form>
  )
}
