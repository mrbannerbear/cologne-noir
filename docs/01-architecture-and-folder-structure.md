# Architecture & Folder Structure

## High-level architecture

```
Instagram (@cologne.noir) --> traffic --> Next.js site (Vercel, Bun runtime)
                                              |
                                   +----------+-----------+
                                   |                       |
                              Neon Postgres          WhatsApp notification
                              (via Prisma)           (order alert to you)
                                   |
                          Prisma Studio (you, local)
                          = your "admin panel" for now
```

- The site is a standard Next.js App Router app. Server Components fetch products directly
  from the database (no separate API layer needed for reads).
- The only API route in Phase 1 is `POST /api/orders`, which validates input, computes final
  price server-side (including custom decant amounts — see `03-features-and-user-flows.md`),
  writes to the database, and fires a WhatsApp notification.
- You manage products (add/edit/mark sold out) by connecting Prisma Studio to the production
  database and editing rows directly.

## Folder structure

```
cologne-noir/
├── app/
│   ├── layout.tsx                # root layout: nav, footer, fonts, metadata
│   ├── page.tsx                  # homepage: hero + featured products
│   ├── globals.css               # Tailwind base + glass design tokens
│   ├── products/
│   │   ├── page.tsx              # full catalog, filterable by gender/type/brand
│   │   └── [slug]/
│   │       └── page.tsx          # product detail + order form
│   ├── order/
│   │   └── confirmation/
│   │       └── page.tsx          # "thanks, we'll call you" page
│   ├── about/
│   │   └── page.tsx              # brand story, shipping info, authenticity promise
│   └── api/
│       └── orders/
│           └── route.ts          # POST: validate, price, create order, notify WhatsApp
│
├── components/
│   ├── ui/                       # shadcn/ui primitives, restyled for the glass look
│   │   ├── glass-button.tsx
│   │   ├── glass-card.tsx
│   │   ├── glass-sheet.tsx       # bottom sheet for the order form
│   │   └── ...
│   ├── nav-bar.tsx
│   ├── footer.tsx
│   ├── product-card.tsx          # catalog grid item
│   ├── product-grid.tsx
│   ├── notes-pyramid.tsx         # top/middle/base notes display
│   ├── variant-selector.tsx      # presets (5/10/15ml, full bottle) + custom ml input
│   └── order-form.tsx            # client component, calls /api/orders
│
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── whatsapp.ts                # sendWhatsAppNotification() helper
│   ├── pricing.ts                 # pricePerMl(), customDecantPrice() — see 02-database-schema.md
│   ├── validations.ts            # Zod schemas (order form, etc.)
│   └── format.ts                 # price/currency formatting (BDT)
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                   # seeds initial products from your IG catalog
│
├── types/
│   └── index.ts                  # shared TS types (Product, Variant, Order, etc.)
│
├── public/
│   └── (static assets only — product photos go in Vercel Blob, not here)
│
├── .env.local.example
├── AGENTS.md                     # scaffolded by create-next-app — guidance for AI coding agents
├── next.config.ts
├── postcss.config.mjs            # Tailwind v4 config lives here + in globals.css, not a tailwind.config.ts
├── tsconfig.json
├── bunfig.toml
├── bun.lockb
└── package.json
```

## Conventions for whoever/whatever builds this
- Server Components by default. Only mark a component `"use client"` if it needs interactivity
  (the order form, the variant selector, the glass hover/press animations, mobile nav toggle).
- All database access goes through `lib/prisma.ts` — never instantiate `PrismaClient` elsewhere.
- All external input (the order form, including custom decant ml) is validated with Zod in
  `lib/validations.ts` **and** re-priced server-side in `lib/pricing.ts` — never trust a price
  sent from the client.
- Currency is BDT (৳), formatted via `lib/format.ts`.
- No client-side state library needed (no cart in Phase 1) — component-local state is enough.
- Package manager is **Bun** throughout: `bun install`, `bun add`, `bun run dev`, `bunx <tool>`
  instead of the npm/npx equivalents. Commit `bun.lockb`, not `package-lock.json`. `package.json`
  scripts must use `bun --bun next dev/build/start` so Bun's runtime is actually used, not just
  Bun-as-installer running Node under the hood.

## Next.js 16-specific notes
- **Turbopack is the default bundler** — no config needed, just don't pass `--webpack` unless
  you hit a compatibility issue with a specific package.
- **`params` and `searchParams` are async** in Server Components (`app/products/[slug]/page.tsx`,
  etc.) — they're `Promise`s now, not plain objects:
  ```tsx
  export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    // ...
  }
  ```
- **Tailwind v4** is CSS-first — there's no `tailwind.config.ts`. Design tokens (including the
  glass CSS variables from `04-ui-ux-design-system.md`) are declared directly in `globals.css`
  via `@theme` / `:root`, imported with `@import "tailwindcss";` at the top of the file.
- **Middleware is now `proxy.ts`** (renamed from `middleware.ts`) — not used in Phase 1 (no
  auth yet), but relevant once Phase 2's admin dashboard needs route protection.
- `create-next-app` scaffolds an `AGENTS.md` at the project root — keep it; it's useful context
  for any AI coding agent (including whichever one builds this from these docs) and doesn't
  affect the running app.
