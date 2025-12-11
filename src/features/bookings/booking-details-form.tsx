"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect, useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { cancelBooking, updateBooking, type BookingFormState } from "./actions"
import { RequiredMark } from "./required-mark"

type BookingDetailsFormProps = {
  booking: {
    id: string
    driverName: string
    licensePlate: string
    note: string | null
  }
  /** Where to go after the booking is deleted. */
  afterDeleteHref: string
}

/** Edit or delete one of your own bookings (Figma "Booked (User)" details). */
export function BookingDetailsForm({
  booking,
  afterDeleteHref,
}: BookingDetailsFormProps) {
  const router = useRouter()
  const [isDeleting, startDeleting] = useTransition()
  const [state, formAction, isSaving] = useActionState<
    BookingFormState,
    FormData
  >(updateBooking, { status: "idle" })

  useEffect(() => {
    if (state.status === "success") toast("Changes saved")
  }, [state])

  function handleDelete() {
    startDeleting(async () => {
      const result = await cancelBooking(booking.id)
      if (!result.ok) {
        toast("We couldn't delete this booking", {
          description: "Try again in a moment.",
        })
        return
      }
      toast("Booking deleted", {
        description: "The space is free for others again.",
      })
      router.push(afterDeleteHref)
    })
  }

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <input type="hidden" name="bookingId" value={booking.id} />
      <div className="flex flex-col gap-4 px-8">
        <div className="flex flex-col gap-1">
          <Label htmlFor="driverName">
            Name <RequiredMark />
          </Label>
          <Input
            id="driverName"
            name="driverName"
            defaultValue={booking.driverName}
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
            defaultValue={booking.licensePlate}
            className="uppercase"
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            name="note"
            defaultValue={booking.note ?? ""}
            placeholder="e.g. 9–5"
            rows={1}
          />
        </div>
        {state.status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-2 p-8">
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Think carefully: once deleted, this booking can&apos;t be
                restored. There&apos;s no going back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  )
}
