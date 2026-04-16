"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { createBooking, type BookingFormState } from "./actions"
import { RequiredMark } from "./required-mark"

type BookingFormProps = {
  spotId: number
  day: string
  defaultName: string
  defaultLicensePlate: string
}

export function BookingForm({
  spotId,
  day,
  defaultName,
  defaultLicensePlate,
}: BookingFormProps) {
  const [state, formAction, isPending] = useActionState<
    BookingFormState,
    FormData
  >(createBooking, { status: "idle" })

  useEffect(() => {
    if (state.status === "success") {
      toast("Booking confirmed", {
        description: "Your space is saved. Others will see it as taken.",
      })
    }
  }, [state])

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <input type="hidden" name="spotId" value={spotId} />
      <input type="hidden" name="day" value={day} />
      <div className="flex flex-col gap-4 px-8">
        <div className="flex flex-col gap-1">
          <Label htmlFor="driverName">
            Name <RequiredMark />
          </Label>
          <Input
            id="driverName"
            name="driverName"
            defaultValue={defaultName}
            autoComplete="name"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="licensePlate">
            License plate <RequiredMark />
          </Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            defaultValue={defaultLicensePlate}
            placeholder="e.g. AB24 CDE"
            className="uppercase placeholder:normal-case"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" name="note" placeholder="e.g. 9–5" rows={1} />
        </div>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-4 p-8">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Booking…" : "Confirm and book"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Remember, you&apos;re taking a space that other drivers may need
        </p>
      </div>
    </form>
  )
}
