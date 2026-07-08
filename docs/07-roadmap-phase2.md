# Roadmap — Phase 2 and Beyond

Trigger for starting Phase 2: **order volume makes Prisma Studio inconvenient** — e.g. you're
updating stock multiple times a day, or you want someone else (not you) to be able to manage
products without database access.

## Phase 2: Admin Dashboard
- Route group: `app/(admin)/admin/...`, protected by simple auth to start (you deferred proper
  auth — a single shared password via a middleware check is a reasonable bridge; upgrade to
  email/magic-link auth, e.g. with `next-auth`, once it matters).
- Screens:
  - **Orders** — list with status filter (Pending/Confirmed/Shipped/Delivered), tap to update
    status (replaces manually editing in Prisma Studio).
  - **Products** — add/edit product + variants, toggle `isActive`, update `stockQty` and
    prices, upload photos directly (Vercel Blob upload widget) instead of via seed scripts.
- This reuses the exact same Prisma schema from Phase 1 — no data migration needed, just a UI
  layer on top.

## Phase 3 candidates (not yet scoped — revisit based on real usage)
- **Move off CallMeBot to the official WhatsApp Cloud API** (Option B in
  `05-whatsapp-notifications.md`) once the site is live and depended on daily — the unofficial
  option is fine for launch but isn't something to build a real business on long-term.
- **Decant markup field**: right now `customDecantPrice()` is a pure per-ml split of the full
  bottle price. If you want custom decants priced slightly above straight-line (to cover
  bottling labor/empty vials), add a `decantMarkupPercent` field to `Product` and apply it in
  `lib/pricing.ts` — small, additive change, no schema migration pain.
- **Online payment**: bKash/Nagad merchant integration once COD friction (failed
  deliveries, no-shows) becomes a real cost.
- **Cart / multi-item orders**: once customers regularly want to order 2+ products at once —
  currently out of scope since the order form is single-product by design.
- **Customer accounts / order history**: only worth it if repeat-customer rate justifies it.
- **Search**: once catalog grows past ~20-30 active products.
- **Analytics**: basic Vercel Analytics is free and worth turning on early even without a
  dashboard — gives you traffic data with zero extra work.

## Deliberately not planned
- Multi-vendor marketplace features — you are the only seller.
- Subscription/recurring orders — not how decant buying typically works.
- Native mobile app — a fast, installable mobile web experience (PWA manifest, ~1 hour of work)
  gets you 90% of the benefit without app store overhead; consider this before a real app.
