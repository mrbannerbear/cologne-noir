# Cologne Noir — Session Handoff Prompt

> **Purpose of this file:** Paste this entire document as your first message to a new AI
> assistant (Claude, ChatGPT, Claude Code, Cursor, etc.) if a prior session hits its limit or
> ends. Attach the other project docs (`00` through `07`, plus `README.md`) alongside it if
> your tool supports file uploads — this prompt summarizes them, but the full docs have the
> complete detail (schema, API contracts, exact CSS). If you can't attach files, this document
> alone is enough to keep working without re-explaining the project from scratch.

---

## Instructions for the assistant reading this

You are picking up an in-progress project. Do not re-litigate decisions already made below —
they were deliberate, discussed, and settled with the project owner (Sayed) across a prior
session. Treat everything in "Locked decisions" as fixed unless Sayed explicitly says he wants
to revisit it. If you're unsure how something fits together, ask a short, specific question
rather than guessing or re-deriving the architecture from scratch.

If the full doc set (`00`–`07` + `README.md`) is attached, read them before writing any code —
they contain the complete Prisma schema, API contracts, and CSS specs that this handoff only
summarizes. If they're not attached, ask Sayed to provide them, or work from the summary below
and flag that you're missing detail on anything not covered here.

---

## What this project is

A catalog + order-intake website for **Cologne Noir**, an Instagram-based fragrance decant and
full-bottle business (Chittagong, Bangladesh — [@cologne.noir](https://instagram.com/cologne.noir),
ships nationwide). It replaces "DM to order" with a real product catalog and order form.
Fulfillment stays manual and personal — every order is confirmed by phone/WhatsApp before it
ships. That's intentional, not a missing feature.

## Locked decisions

**Scope (Phase 1):**
- Catalog browsing + product detail pages, no cart (one product ordered at a time)
- Cash-on-delivery order form only — no payment gateway, no customer accounts
- No custom admin dashboard yet — inventory is managed via **Prisma Studio** directly against
  the production database. A dashboard is explicitly deferred to Phase 2.
- WhatsApp notification to Sayed on every new order

**Tech stack:**
- **Runtime/package manager:** Bun (not Node/npm — always `bun`/`bunx`, commit `bun.lockb`)
- **Framework:** Next.js **16** (App Router), TypeScript, Turbopack (default bundler)
- **Styling:** Tailwind CSS v4 (CSS-first config — no `tailwind.config.ts`, tokens live in
  `app/globals.css` via `@theme` and `:root`)
- **Components:** shadcn/ui, initialized with **Base UI** as the primitive library (not Radix —
  Base UI became shadcn's default as of this month) and the **Maia** style preset (soft,
  generously rounded, spacious — matches the glass aesthetic; Nova/Lyra/Mira were rejected as
  too compact/sharp for a boutique storefront). Icon library: **Lucide**.
- **Motion:** Framer Motion, for spring-based press/release micro-interactions on glass elements
- **Database:** PostgreSQL via **Neon** (serverless, free tier)
- **ORM:** Prisma, with `dotenv-cli` used to point Prisma commands at `.env.local` (Next.js's
  native env file — deliberately not using Prisma's separate default `.env`)
- **Validation:** Zod
- **Notifications:** WhatsApp — **CallMeBot** (unofficial, free, fast to set up) for launch,
  with a clear upgrade path to the official Meta WhatsApp Cloud API once the site is live and
  depended on daily (Phase 3)
- **Image storage:** Vercel Blob
- **Hosting:** Vercel

**Design direction (revised — supersedes any earlier "liquid glass" mention if you see it
referenced elsewhere):**
- **Editorial, French-perfumery-house aesthetic** — reference points are split-screen
  photographic heroes, high-contrast serif wordmarks (`Bodoni Moda`), hairline rules instead of
  card borders/shadows, torn-paper/polaroid-stack collage moments reserved for storytelling
  sections (About, newsletter), and a subtle page-wide film-grain texture ("hazy" quality).
  Think print magazine spread, not app UI.
- **Warm monochrome palette** — white/off-white/cream/grey/black, no color accents, no gold.
- Buttons are **sharp rectangles** (near-zero border radius), not rounded pills: solid black
  fill for the one primary action per screen, thin outlined ghost style for secondary actions.
- Motion is quiet: scroll fade-ups and slow parallax only — no spring/bounce press animations.
- We initialized shadcn with the **Maia** preset (soft/rounded) before this design pivot — don't
  redo the CLI init, just override the `--radius` token in `globals.css` to ~2px per
  `04-ui-ux-design-system.md`'s config note.
- Full CSS tokens, typography choices, and component-by-component spec are in
  `04-ui-ux-design-system.md` (rewritten — this is the current version, not the original glass
  spec if you happen to see stale references to it anywhere).

**Data model highlights (full schema in `02-database-schema.md`):**
- `Product` has `gender` (enum: MEN/WOMEN/UNISEX), separate `topNotes`/`middleNotes`/`baseNotes`
  string arrays (not one flat notes list), and `actualBottleMl` + `actualBottleFullPriceBdt` —
  because bottles come in 75ml/100ml/125ml, not always 100ml.
- **Decant pricing formula:** `pricePerMl = actualBottleFullPriceBdt / actualBottleMl`. Preset
  sizes (5ml/10ml/15ml/Full Bottle) are real stocked `ProductVariant` rows. **Custom** decant
  amounts are calculated live from this formula at order time — never pre-stocked, always
  recomputed **server-side** on order submission (never trust a client-sent price).
- `OrderItem` snapshots price and label at time of order, and references either a
  `productVariantId` (preset) or `customMl` (custom) — never both, never neither.

## Current progress (verify with Sayed before assuming more than this)

- [x] Full spec written: `00-project-brief.md` through `07-roadmap-phase2.md`, plus `README.md`
- [x] Bun installed locally
- [x] Next.js 16 project scaffolded (`--typescript --tailwind --app --turbopack`)
- [x] `package.json` scripts updated to force `bun --bun next dev/build/start`
- [x] `shadcn@latest init` run — **Base UI** selected as component library, **Maia** preset
      selected, **Lucide** icons
- [ ] Neon project created, `DATABASE_URL` obtained
- [ ] Prisma initialized, schema from `02-database-schema.md` added, `dotenv-cli` set up,
      initial migration run
- [ ] CallMeBot WhatsApp connected, API key obtained
- [ ] Vercel Blob store created, token obtained
- [ ] `.env.local` and `.env.local.example` assembled
- [ ] Git repo initialized, pushed to GitHub
- [ ] Vercel project connected, env vars added, skeleton deployed
- [ ] Any actual product/feature code written (catalog, product page, order form, API route)

**Next likely step when resuming:** finish the remaining setup checklist items above
(`06-setup-deployment.md` has the exact commands), confirm the deploy pipeline works end-to-end
with an empty skeleton, *then* start building features per `03-features-and-user-flows.md`.

## How to work with Sayed on this project
- He's a software developer (Next.js background) pivoting toward Solutions Engineer/pre-sales
  work professionally, but is technically capable and building this himself — explain trade-offs
  concisely, don't over-explain basics, but do flag anything non-obvious (e.g. why a decision
  was made a certain way) since he's picking this up across sessions.
- He explicitly wants **agentic-engineering-standard** documentation: clear specs before code,
  explicit conventions, nothing left implicit. Keep that standard for anything you add.
- If you (the new assistant) make a new decision not covered in the docs, add it to the
  relevant doc file rather than leaving it only in chat — the docs are the source of truth that
  survives session boundaries, chat history doesn't.
