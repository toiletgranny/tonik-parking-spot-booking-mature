import Link from "next/link"

import { cn } from "@/lib/utils"

export type SpotStatus = "available" | "taken" | "mine"

type SpotCardProps = {
  href: string
  label: string
  status: SpotStatus
  selected: boolean
}

const statusText: Record<SpotStatus, string> = {
  available: "Available",
  taken: "Reserved",
  mine: "Reserved",
}

/** Figma "Parking Spot Card". */
export function SpotCard({ href, label, status, selected }: SpotCardProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={selected ? "true" : undefined}
      aria-label={`Space ${label}, ${status === "mine" ? "booked by you" : statusText[status].toLowerCase()}`}
      className={cn(
        // Right and bottom borders only: the grid draws the top and left edge,
        // so neighbouring cards share one 1px line instead of doubling it.
        "relative flex flex-col gap-4 overflow-hidden border-r border-b p-4 outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : status !== "available" && "striped bg-muted",
      )}
    >
      <span className="text-4xl tracking-[-0.04em]">{label}</span>
      <span className="flex min-h-32 flex-col justify-end text-sm">
        {selected ? (
          <span className="truncate">Selected</span>
        ) : (
          <>
            <span className="truncate text-content">{statusText[status]}</span>
            {status === "mine" && (
              <span className="truncate text-muted-foreground">By you</span>
            )}
          </>
        )}
      </span>
    </Link>
  )
}
