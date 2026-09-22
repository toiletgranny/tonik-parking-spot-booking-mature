# Tonik Parking

Book a parking space at the Tonik office. Pick a day, pick a free space, and it's yours. Everyone can see which spaces are taken, but not who took them.

This README gets you from zero to the app running on your laptop, with its own local database. You don't need to be a developer to follow it.

## What you need

- **A Mac, Windows or Linux computer** with about 6 GB of free disk space.
- **Node.js 26** (the LTS version). Download it from [nodejs.org](https://nodejs.org). Check with `node -v`.
- **Docker Desktop.** The app's database runs inside Docker, so nothing gets installed into your system. Download it from [docker.com](https://www.docker.com/products/docker-desktop/), install it and **open it** (it has to be running in the background).
- **Git**, and optionally the [GitHub CLI](https://cli.github.com) (`gh`).

## Setup

Run these in a terminal, inside the project folder.

**1. Install the project's packages**

```sh
npm install
```

This also installs the Supabase command-line tool for this project only, so you don't need to install it separately.

> We use **npm**. You'll also see **pnpm** and **Yarn** in other projects: they do the same job. Stick to npm here, because the exact package versions are locked in `package-lock.json`.

**2. Start the local database**

```sh
npm run db:start
```

The first time, this downloads about 1 GB and takes a few minutes. Later starts take seconds. When it's done, it prints a table of addresses and keys.

**3. Tell the app where the database is**

```sh
cp .env.example .env.local
```

Open `.env.local` and fill in the two values. To see them again at any time, run:

```sh
npm run db:status
```

- `NEXT_PUBLIC_SUPABASE_URL`: the **Project URL** (`http://127.0.0.1:54321`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the **Publishable** key (starts with `sb_publishable_`)

`.env.local` is ignored by git on purpose: environment files stay on your machine.

**4. Run the app**

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a test account.

## Test accounts

| Email                | Password      | Notes                     |
| -------------------- | ------------- | ------------------------- |
| `alex@example.com`   | `password123` | Has a saved license plate |
| `sam@example.com`    | `password123` |                           |
| `jordan@example.com` | `password123` |                           |

Sign-ups are turned off: these accounts come from `supabase/seed.sql`. The local database starts with the ten parking spaces and these three people, and no bookings.

## Everyday commands

| Command             | What it does                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`       | Runs the app at localhost:3000                                                              |
| `npm run db:start`  | Starts the local database (Docker Desktop must be open)                                     |
| `npm run db:stop`   | Stops it. Your data is kept                                                                 |
| `npm run db:status` | Shows the database's addresses and keys                                                     |
| `npm run db:reset`  | Wipes the local database and rebuilds it from `supabase/migrations` and `supabase/seed.sql` |
| `npm run lint`      | Checks the code for mistakes and broken team rules                                          |
| `npm run typecheck` | Checks the TypeScript types                                                                 |
| `npm run build`     | Builds the app the way production would                                                     |

## Looking inside the database

The local database comes with **Supabase Studio**, a web app for browsing it: [http://127.0.0.1:54323](http://127.0.0.1:54323).

- **Table Editor**: the `parking_spots`, `bookings` and `profiles` tables.
- **Authentication**: the user accounts.

It's your own copy, so feel free to experiment. `npm run db:reset` puts it back the way it was.

## Where things live

```
src/
  app/                  pages (routes): /, /bookings, /week, /profile, /login
  features/
    auth/               signing in and out
    bookings/           booking form, My bookings, edit and cancel
    spots/              day list and the grid of spaces
    profile/            name and saved license plate
    week-overview/      how full each day is
  components/
    ui/                 shadcn/ui components, styled to match Figma
    app-shell.tsx       the page frame shared by every screen
  lib/                  shared helpers: dates, Supabase clients
  proxy.ts              keeps you signed in, sends signed-out visitors to /login
supabase/
  migrations/           the database structure, step by step (tables, access rules)
  seed.sql              the starting data for local development
  config.toml           local Supabase settings
CLAUDE.md               team conventions (read by Claude Code, useful for people too)
```

Who can see and change which rows is decided in the database itself, by the policies in `supabase/migrations`.

The design lives in the Tonik Parking Figma file. Colors, type and components in the code follow its names.

## Working on a change

1. Create a branch, make your change, and open a pull request.
2. **CI** (GitHub Actions) runs lint, typecheck and build on every pull request. It must be green before merging. We squash-merge.
3. Before every `git push`, a **Husky** hook runs lint and typecheck on your machine, so you find out a few minutes earlier.
4. Team conventions are in [CLAUDE.md](CLAUDE.md). The big one: a folder in `src/features` never imports from another feature folder (ESLint will stop you).

**Working in a fork?**

- GitHub Actions are switched off in new forks. Turn them on once in your fork's **Actions** tab.
- If you cloned with `gh repo clone`, run `gh repo set-default <your-username>/<repo>` so pull requests open in your fork, not in the original repo.

## When something goes wrong

- **`Cannot connect to the Docker daemon`**: Docker Desktop isn't running. Open it, wait until it says it's running, and try again.
- **`port is already allocated`** when starting the database: another local Supabase project is running. Stop it first (`npx supabase stop --project-id <its name>`), or stop this one with `npm run db:stop`.
- **The app shows an error about the Supabase URL or key**: check `.env.local` against `npm run db:status`, then restart `npm run dev`.
- **Signed out after `npm run db:reset`**: expected. The reset wipes sessions too, so sign in again.
