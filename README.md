# Tonik Parking

Book a parking space at the Tonik office.

## Setup

Needs Node 26 (see `.nvmrc`) and Docker running.

```sh
npm install
npm run db:start     # local Supabase in Docker
cp .env.example .env.local   # fill in from `npm run db:status`
npm run dev
```

Test accounts are in `supabase/seed.sql`.

## Scripts

- `npm run lint`, `npm run typecheck`, `npm run build`
- `npm run db:reset` rebuilds the local database from `supabase/migrations` and `supabase/seed.sql`
- `npm run db:types` regenerates `src/lib/supabase/database.types.ts` after a schema change
