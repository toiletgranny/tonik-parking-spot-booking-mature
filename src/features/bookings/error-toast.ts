import { toast } from "sonner"

import type { BookingError } from "./actions"

/** Error toast: red left border, stays until the person closes it. */
export function showBookingError({ title, description }: BookingError) {
  toast.error(title, {
    description,
    duration: Infinity,
    closeButton: true,
  })
}
