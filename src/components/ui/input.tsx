import * as React from "react"

import { cn } from "@/lib/utils"

/** Underlined text field from the Figma "Info Field" component. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border-0 border-b border-input bg-transparent py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-border-accent disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
