# Setup & Deployment

## Prerequisites
- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- A [Neon](https://neon.tech) account (free tier — Postgres)
- A [Vercel](https://vercel.com) account
- WhatsApp notification method set up (see `05-whatsapp-notifications.md` — Option A to start)

## Local setup

```bash
bunx create-next-app@latest cologne-noir --typescript --tailwind --app --turbopack --import-alias "@/*"
cd cologne-noir
```

Say yes to the AGENTS.md prompt. Then, in `package.json`, force the scripts to actually run
under Bun's runtime (by default `next` still runs under Node even though Bun installed it):

```json
"scripts": {
  "dev": "bun --bun next dev",
  "build": "bun --bun next build",
  "start": "bun --bun next start",
  "lint": "eslint"
}
```

```bash
bun add prisma @prisma/client zod framer-motion @vercel/blob
bun add -d tsx dotenv-cli    # tsx runs prisma/seed.ts; dotenv-cli lets Prisma read .env.local
bunx shadcn@latest init      # sets up shadcn/ui as the component foundation
bunx prisma init
```

This creates `prisma/schema.prisma` — replace its contents with the schema from
`02-database-schema.md`. Delete the `.env` file `prisma init` creates — this project keeps a
single source of truth for secrets in `.env.local` (Next.js's native convention), and uses
`dotenv-cli` to let Prisma commands read from it instead of maintaining two env files.

## Environment variables

Create `.env.local` (never commit this — it's gitignored by default):

```
# From Neon dashboard, after creating a project
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# WhatsApp — Option A (CallMeBot, see 05-whatsapp-notifications.md)
WHATSAPP_CALLMEBOT_PHONE="8801XXXXXXXXX"
WHATSAPP_CALLMEBOT_APIKEY="123456"

# WhatsApp — Option B (Meta Cloud API), add these instead/later
# WHATSAPP_ACCESS_TOKEN="EAAG..."
# WHATSAPP_PHONE_NUMBER_ID="123456789012345"
# WHATSAPP_RECIPIENT_NUMBER="8801XXXXXXXXX"
# WHATSAPP_TEMPLATE_NAME="order_notification"

# From Vercel Blob dashboard, once you create a Blob store
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

Create `.env.local.example` with the same keys but placeholder values, and commit *that*
instead — so anyone (or any agent) setting up the project knows what's needed.

## Database setup

Run all Prisma commands through `dotenv-cli` so they pick up `DATABASE_URL` from `.env.local`:

```bash
bunx dotenv -e .env.local -- bunx prisma migrate dev --name init   # creates tables in Neon
bunx dotenv -e .env.local -- bunx prisma db seed                   # loads initial products
```

(Optional: add these as `package.json` scripts — e.g. `"db:migrate"`, `"db:seed"` — once you're
tired of typing the full `dotenv -e .env.local --` prefix.)

## Running locally

```bash
bun run dev
```

## Deploying to Vercel

1. Push the repo to GitHub (commit `bun.lockb`, not a `package-lock.json`/`yarn.lock`).
2. In Vercel: **New Project → Import** the repo.
3. In **Settings → General → Build & Development Settings**, set the Package Manager to
   **Bun** (Vercel auto-detects it from `bun.lockb`, but confirm it's selected).
4. Add all environment variables from `.env.local` in **Settings → Environment Variables** —
   for Production, Preview, and Development.
5. Deploy. Vercel gives you a `*.vercel.app` URL; connect a custom domain later
   (e.g. `colognenoir.com` or `.com.bd`) from the Domains tab.

## Ongoing inventory management (Phase 1)

```bash
bunx dotenv -e .env.local -- bunx prisma studio
```
Run this locally with `DATABASE_URL` pointed at your **production** Neon database (same value
as in Vercel) to add/edit products and update stock without touching code.

## Pre-launch checklist
- [ ] Seed at least the products currently in your last 8 IG posts, with correct
      `actualBottleMl` / `actualBottleFullPriceBdt` for each
- [ ] Test the full order flow end-to-end for **both** a preset size and a custom ml amount —
      confirm the server-computed price matches expectations in both cases
- [ ] Confirm the WhatsApp alert arrives (Option A first)
- [ ] Test responsiveness on an actual phone at minimum — not just browser dev tools
- [ ] Confirm glass/backdrop-blur effects render acceptably on a mid-range Android browser
      (not just a high-end iPhone) — this is your actual customer base
- [ ] Add real shipping/delivery-time expectations to the About page
- [ ] Point your Instagram bio link at the live site
