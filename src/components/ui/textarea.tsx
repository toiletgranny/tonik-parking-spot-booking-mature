import * as React from "react"

import { cn } from "@/lib/utils"

/** Underlined multi-line field, same look as <Input />. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input text-foreground placeholder:text-muted-foreground focus-visible:border-border-accent aria-invalid:border-destructive flex field-sizing-content min-h-10 w-full resize-none border-0 border-b bg-transparent py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
