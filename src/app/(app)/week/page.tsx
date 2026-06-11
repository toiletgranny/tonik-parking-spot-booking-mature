import type { Metadata } from "next"

import { AppShell, ListItem, SectionNav } from "@/components/app-shell"
import { getSpots, getTakenSpots } from "@/features/spots/queries"
import { WeekOverview } from "@/features/week-overview/week-overview"
import { addDays, startOfWeek, todayInOffice } from "@/lib/dates"

import { AccountLinks } from "../account-links"
import { navItems } from "../nav-items"

export const metadata: Metadata = {
  title: "Week overview · Tonik Parking",
}

const WEEKS = [
  { id: "this", label: "This week", offset: 0 },
  { id: "next", label: "Next week", offset: 7 },
] as const

export default async function WeekPage({ searchParams }: PageProps<"/week">) {
  const params = await searchParams
  const week = WEEKS.find((w) => w.id === params.week) ?? WEEKS[0]

  const today = todayInOffice()
  const thisMonday = startOfWeek(today)
  const [spots, takenSpots] = await Promise.all([
    getSpots(),
    getTakenSpots(thisMonday, addDays(thisMonday, 11)),
  ])

  function occupancyFor(offset: number) {
    const monday = addDays(thisMonday, offset)
    return [0, 1, 2, 3, 4].map((i) => {
      const day = addDays(monday, i)
      return {
        day,
        taken: takenSpots.filter((t) => t.day === day).length,
        total: spots.length,
      }
    })
  }

  function freeCaption(offset: number) {
    const free = occupancyFor(offset)
      .filter((d) => d.day >= today)
      .reduce((sum, d) => sum + Math.max(d.total - d.taken, 0), 0)
    return free === 1 ? "1 space free" : `${free} spaces free`
  }

  return (
    <AppShell
      eyebrow="Week overview"
      title={week.label}
      account={<AccountLinks />}
      nav={<SectionNav items={navItems("/week")} />}
      sidebar={
        <div className="flex flex-col">
          {WEEKS.map((w) => (
            <ListItem
              key={w.id}
              href={`/week?week=${w.id}`}
              label={w.label}
              caption={freeCaption(w.offset)}
              active={w.id === week.id}
            />
          ))}
        </div>
      }
    >
      <section className="flex flex-col">
        <h2 className="p-8 text-sm font-medium">How full each day is</h2>
        <WeekOverview days={occupancyFor(week.offset)} today={today} />
      </section>
    </AppShell>
  )
}
