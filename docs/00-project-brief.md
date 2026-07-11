# Cologne Noir — Project Brief

## What this is
A catalog + order-intake website for Cologne Noir, an Instagram-based perfume decant and
full-bottle business (@cologne.noir, Chittagong, ships across Bangladesh). The site replaces
"DM to order" with a proper product catalog and order form, while keeping order *fulfillment*
manual (you confirm every order by phone/WhatsApp before shipping — this is intentional, not a
gap).

## Goals (Phase 1)
1. Public catalog: browse products, see variants (preset decant sizes, custom decant amount,
   full bottle), prices, stock.
2. Product detail page with an order form (COD, no payment gateway yet).
3. Order saved to a real database.
4. You get pinged on WhatsApp the moment an order comes in.
5. You manage inventory via Prisma Studio (a free GUI for the database) — no custom admin UI yet.
6. Deployed on Vercel, fast, fully responsive across phone/tablet/desktop (most traffic comes
   from Instagram on phones).
7. Visual language: editorial, French-perfumery-house aesthetic — white/off-white/grey/black
   palette, high-contrast serif typography, hairline rules, hazy film-grain texture, collage
   moments in storytelling sections. Calm and print-inspired, not app-like.

## Explicit non-goals for Phase 1
- No online payment (bKash/Nagad/card) — COD only, confirmed manually.
- No customer accounts / login.
- No custom admin dashboard — deferred to Phase 2 (see `07-roadmap-phase2.md`).
- No multi-vendor / multi-currency support.

## Why this scope
Your business right now is relationship- and trust-driven (decants especially — customers need
to trust authenticity). A slick checkout doesn't fix that; a clean catalog + fast personal
follow-up does. This spec is the smallest system that removes the pain of manually replying to
"is this available? how much for 5ml?" DMs, while keeping the trust-building phone call step
you already do well.

## Tech stack (locked in)
- **Runtime/package manager:** Bun (not Node/npm)
- **Framework:** Next.js 16+ (App Router), TypeScript
- **Styling:** Tailwind CSS + editorial design tokens (see `04-ui-ux-design-system.md`)
- **Component base:** shadcn/ui (Radix primitives) for accessibility, heavily restyled
- **Motion:** Framer Motion (for the spring/glass micro-interactions)
- **Database:** PostgreSQL via Neon (serverless Postgres, free tier, plays well with Vercel)
- **ORM:** Prisma
- **Validation:** Zod
- **Notifications:** WhatsApp (see `05-whatsapp-notifications.md` for the two setup paths)
- **Image storage:** Vercel Blob
- **Hosting:** Vercel

## How to use these docs
These files are written to be handed directly to an AI coding agent (Claude Code, Cursor, etc.)
or followed manually. Read them in order:

1. `00-project-brief.md` — this file
2. `01-architecture-and-folder-structure.md`
3. `02-database-schema.md`
4. `03-features-and-user-flows.md`
5. `04-ui-ux-design-system.md`
6. `05-whatsapp-notifications.md`
7. `06-setup-deployment.md`
8. `07-roadmap-phase2.md`
