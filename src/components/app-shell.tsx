import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AppShellProps = {
  /** Small label above the page title, e.g. "Selected day". */
  eyebrow: string
  title: string
  /** Section switcher shown at the top of the left column. */
  nav: ReactNode
  sidebar: ReactNode
  /** Extra items at the bottom of the top-left corner (e.g. sign out). */
  account?: ReactNode
  children: ReactNode
}

/** The page frame from Figma: logo corner, big page title, left list, main area. */
export function AppShell({
  eyebrow,
  title,
  nav,
  sidebar,
  account,
  children,
}: AppShellProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-end justify-between gap-6 border-b px-8 py-8 lg:flex-col lg:items-start lg:border-r lg:py-12">
        <p className="text-content text-sm">Tonik Parking</p>
        <div className="flex w-full items-end justify-between gap-4">
          <Link href="/" aria-label="Tonik Parking home">
            <Image src="/tonik-logo.svg" alt="" width={48} height={48} />
          </Link>
          {account}
        </div>
      </div>
      <header className="flex flex-col gap-8 border-b px-8 py-12">
        <p className="text-content text-sm">{eyebrow}</p>
        <h1 className="text-4xl tracking-[-0.04em] lg:text-5xl">{title}</h1>
      </header>
      <aside className="flex flex-col border-b lg:border-r">
        <div className="p-8">{nav}</div>
        {sidebar}
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

type SectionNavProps = {
  items: { href: string; label: string; current: boolean }[]
}

/** "Book a space · My bookings" switcher at the top of the left column. */
export function SectionNav({ items }: SectionNavProps) {
  return (
    <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={cn(
            "hover:text-foreground",
            item.current
              ? "text-foreground font-medium"
              : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

/** Main area split into content and a "Details" column, as in Figma. */
export function ContentWithDetails({
  title,
  children,
  details,
}: {
  title: ReactNode
  children: ReactNode
  details: ReactNode
}) {
  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.33fr)]">
      <section className="flex min-w-0 flex-col">
        <h2 className="p-8 text-sm font-medium">{title}</h2>
        {children}
      </section>
      <aside className="flex min-h-80 flex-col border-t lg:border-t-0 lg:border-l">
        <h2 className="p-8 text-sm font-medium">Details</h2>
        {details}
      </aside>
    </div>
  )
}

type ListItemProps = {
  href: string
  label: string
  caption: string
  active: boolean
}

/** Row in the left column (Figma "List Item"). */
export function ListItem({ href, label, caption, active }: ListItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "relative flex gap-2 px-8 py-3 text-sm",
        active
          ? "bg-primary text-primary-foreground"
          : "text-content after:bg-border hover:bg-muted after:absolute after:inset-x-8 after:bottom-0 after:h-px",
      )}
    >
      <span className="flex-1">{label}</span>
      <span className={active ? "opacity-75" : "text-muted-foreground"}>
        {caption}
      </span>
    </Link>
  )
}
