import * as React from "react"

import { cn } from "@/lib/utils"

/** Underlined multi-line field, same look as <Input />. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-10 w-full resize-none border-0 border-b border-input bg-transparent py-2 text-base text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-border-accent disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
