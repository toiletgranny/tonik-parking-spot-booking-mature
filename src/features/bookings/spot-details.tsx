import Image from "next/image"

import { BookingDetailsForm } from "./booking-details-form"
import { BookingForm } from "./booking-form"
import type { Booking } from "./queries"

type SpotDetailsProps =
  | { state: "empty" }
  | {
      state: "available"
      spotId: number
      spotLabel: string
      day: string
      defaultName: string
    }
  | { state: "taken"; spotLabel: string }
  | { state: "mine"; spotLabel: string; booking: Booking }

/** Right-hand "Details" column on the booking page (Figma "Parking Spot Details"). */
export function SpotDetails(props: SpotDetailsProps) {
  if (props.state === "empty") {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <Image src="/arrow-hint.svg" alt="" width={72} height={48} />
        <p className="text-muted-foreground text-xs">
          Select a space to view details or book it
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-2 px-8">
        <p className="text-muted-foreground text-xs">Space</p>
        <p className="text-2xl tracking-[-0.04em]">{props.spotLabel}</p>
      </div>
      {props.state === "available" && (
        <BookingForm
          spotId={props.spotId}
          day={props.day}
          defaultName={props.defaultName}
        />
      )}
      {props.state === "taken" && (
        <p className="text-content px-8 text-sm">
          Someone has already booked this space for the day.
        </p>
      )}
      {props.state === "mine" && (
        <BookingDetailsForm
          key={props.booking.id}
          booking={props.booking}
          afterDeleteHref={`/?day=${props.booking.day}`}
        />
      )}
    </div>
  )
}
