import type { Metadata } from "next"
import { Miranda_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const mirandaSans = Miranda_Sans({
  variable: "--font-miranda-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Tonik Parking",
  description: "Book a parking space at the Tonik office",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${mirandaSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
