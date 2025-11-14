import * as React from "react"

import { cn } from "@/lib/utils"

/** Underlined text field from the Figma "Info Field" component. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input text-foreground placeholder:text-muted-foreground focus-visible:border-border-accent aria-invalid:border-destructive h-10 w-full min-w-0 border-0 border-b bg-transparent py-2 text-base transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
