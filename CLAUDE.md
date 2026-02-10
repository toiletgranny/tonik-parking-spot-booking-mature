# Tonik Parking

Book a parking space at the Tonik office. Next.js 16 (App Router), Supabase running locally in Docker, shadcn/ui, Tailwind 4.

@AGENTS.md

## Commands

- `npm run dev`, `npm run lint`, `npm run typecheck`, `npm run build`
- `npm run db:start` / `db:stop` / `db:status`: the local Supabase stack
- `npm run db:reset`: rebuild the local database from migrations and seed
- `npm run db:types`: regenerate `src/lib/supabase/database.types.ts` after a schema change

## Where things live

- `src/app`: routes. Pages put features together and stay thin.
- `src/features/<name>`: one folder per feature (`auth`, `bookings`, `spots`, …) with its components, server actions (`actions.ts`) and data reads (`queries.ts`).
- `src/components/ui`: shadcn/ui components, restyled to match our Figma file. Check the diff before re-running `shadcn add` over them.
- `src/components`: shared layout pieces (`app-shell.tsx`).
- `src/lib`: shared helpers (dates, Supabase clients, `cn`).
- `supabase/migrations`: schema changes. Never edit a migration that's on `main`; add a new one.

## Rules

- A feature never imports from another feature. ESLint enforces this. Share code through `src/lib` or `src/components`, or combine features in a page.
- Writes go through Server Actions; call `revalidatePath` afterwards.
- UI copy: US English, sentence case, same words as the Figma file.
- Small PRs, squash-merged. CI (lint, typecheck, build) must be green.
