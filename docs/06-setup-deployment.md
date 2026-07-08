# Setup & Deployment

## Prerequisites
- [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
- A [Neon](https://neon.tech) account (free tier — Postgres)
- A [Vercel](https://vercel.com) account
- WhatsApp notification method set up (see `05-whatsapp-notifications.md` — Option A to start)

## Local setup

```bash
bunx create-next-app@latest cologne-noir --typescript --tailwind --app
cd cologne-noir

bun add prisma @prisma/client zod framer-motion
bunx shadcn@latest init      # sets up shadcn/ui as the component foundation
bunx prisma init
```

This creates `prisma/schema.prisma` — replace its contents with the schema from
`02-database-schema.md`.

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

```bash
bunx prisma migrate dev --name init      # creates tables in Neon from your schema
bunx prisma db seed                      # runs prisma/seed.ts to load initial products
```

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
bunx prisma studio
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
