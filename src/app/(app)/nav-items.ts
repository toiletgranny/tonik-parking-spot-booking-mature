const SECTIONS = [
  { href: "/", label: "Book a space" },
  { href: "/bookings", label: "My bookings" },
  { href: "/week", label: "Week" },
] as const

/** Items for the section switcher at the top of the left column. */
export function navItems(currentHref: string) {
  return SECTIONS.map((section) => ({
    ...section,
    current: section.href === currentHref,
  }))
}
