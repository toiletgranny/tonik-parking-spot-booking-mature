"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

/** Toasts styled like the Figma "Toast" component: dark, top right, no icon. */
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
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
