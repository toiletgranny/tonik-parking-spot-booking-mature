---
paths:
  - "src/features/bookings/**"
---

# Bookings

- Booking days are `IsoDate` strings ("2026-04-03"), never `Date` objects. Use the helpers in `src/lib/dates.ts`; "today" means today in Europe/Warsaw.
- The database allows one booking per space per day. Don't check availability before inserting: insert and turn error `23505` into a friendly message.
- The database also rejects weekend days.
- After a write, revalidate both `/` and `/bookings`.
- Field labels follow the Figma "Parking Spot Details" component: "Name", "License plate", "Note".
