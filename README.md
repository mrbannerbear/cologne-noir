# Cologne Noir

Catalog and order-intake site for **Cologne Noir** — an authentic fragrance decant and full-bottle
business shipping across Bangladesh. Built to replace "DM to order" with a real product catalog,
while keeping fulfillment personal: every order is confirmed by hand before it ships.

**Live site:** _add URL once deployed_
**Instagram:** [@cologne.noir](https://instagram.com/cologne.noir)

---

## What this is

- Browse fragrances by gender, brand, and notes (top / middle / base pyramid)
- Order preset decant sizes (5ml / 10ml / 15ml) or a custom amount, priced automatically from
  the bottle's actual size (75ml / 100ml / 125ml — not everything is 100ml)
- Simple cash-on-delivery order form — no cart, no payment gateway yet, by design
- Instant WhatsApp alert on every new order
- Apple-style "liquid glass" UI in a strict black/white/grey palette

## Tech stack

| | |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Framework | Next.js 16+ (App Router), TypeScript |
| Styling | Tailwind CSS + custom glass utility layer |
| Components | shadcn/ui (Radix primitives), restyled |
| Motion | Framer Motion |
| Database | PostgreSQL ([Neon](https://neon.tech)) |
| ORM | Prisma |
| Validation | Zod |
| Notifications | WhatsApp (CallMeBot → Meta Cloud API) |
| Images | Vercel Blob |
| Hosting | Vercel |

## Project docs

Full specs live in [`/docs`](./docs) — read in order if you're picking this project up fresh
(human or AI coding agent):

1. [Project brief](./docs/00-project-brief.md) — scope, goals, non-goals
2. [Architecture & folder structure](./docs/01-architecture-and-folder-structure.md)
3. [Database schema](./docs/02-database-schema.md) — Prisma models, decant pricing logic
4. [Features & user flows](./docs/03-features-and-user-flows.md) — order flow, API contract
5. [UI/UX design system](./docs/04-ui-ux-design-system.md) — liquid glass spec, responsive rules
6. [WhatsApp notifications](./docs/05-whatsapp-notifications.md)
7. [Setup & deployment](./docs/06-setup-deployment.md)
8. [Roadmap](./docs/07-roadmap-phase2.md) — admin dashboard, payments, what's deliberately deferred

## Getting started

```bash
bun install
cp .env.local.example .env.local   # fill in DATABASE_URL, WhatsApp keys, Blob token
bunx prisma migrate dev
bunx prisma db seed
bun run dev
```

Full setup and Vercel deployment steps: [`docs/06-setup-deployment.md`](./docs/06-setup-deployment.md).

## Managing inventory

No admin dashboard yet (intentionally — see [roadmap](./docs/07-roadmap-phase2.md)). Products
and stock are managed directly via Prisma Studio:

```bash
bunx prisma studio
```

## Status

🚧 Phase 1 — catalog + manual-confirm ordering. Not yet handling payments or accounts by design.

## License

Private/proprietary — not for reuse without permission.
