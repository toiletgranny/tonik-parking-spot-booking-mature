"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { updateProfile, type ProfileFormState } from "./actions"
import type { Profile } from "./queries"

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState<
    ProfileFormState,
    FormData
  >(updateProfile, { status: "idle" })

  useEffect(() => {
    if (state.status === "success") {
      toast("Profile saved", {
        description: "We'll use these details when you book a space.",
      })
    }
  }, [state])

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-6 px-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor="fullName">Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={profile.fullName}
          autoComplete="name"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="licensePlate">License plate</Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          defaultValue={profile.licensePlate ?? ""}
          placeholder="e.g. AB24 CDE"
          className="uppercase placeholder:normal-case"
        />
        <p className="text-xs text-muted-foreground">
          Filled in for you when you book a space.
        </p>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" className="mt-2 self-start" disabled={isPending}>
        {isPending ? "Saving…" : "Save"}
      </Button>
    </form>
  )
}
