"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toasts styled like the Figma "Toast" component: dark, top right, no icon.
 * Errors add a red left border and a close button (they stay until dismissed).
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      offset={24}
      icons={{ success: null, info: null, warning: null, error: null }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-80 flex-col gap-1 bg-primary p-6 text-sm text-primary-foreground",
          title: "font-medium",
          description: "text-primary-foreground-muted",
          error: "border-l-4 border-destructive pr-12",
          closeButton:
            "absolute top-5 right-5 flex size-6 items-center justify-center text-primary-foreground-muted hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary-foreground [&_svg]:size-4",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
