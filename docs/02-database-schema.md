# Database Schema

## Why Postgres + Prisma (not just JSON/spreadsheet)
You said you eventually want an admin dashboard. Starting with a real relational database now
means Phase 2 is "build a UI on top of existing data" instead of "migrate a spreadsheet into a
database while the site is live." Prisma Studio gives you a free, instant admin-panel-like GUI
in the meantime.

## Key pricing concept: derive decant price from actual bottle size
Bottles don't always come in 100ml — you mentioned 75ml and 125ml variants exist too. So each
`Product` stores its **actual** bottle size and **actual** full-bottle price, and every decant
price (preset or custom) is derived from that at a **price-per-ml** rate:

```
pricePerMl = actualBottleFullPriceBdt / actualBottleMl
decantPrice(ml) = round(pricePerMl * ml)
```

Example: a 125ml bottle priced at ৳12,500 → pricePerMl = ৳100/ml → a custom 22ml decant =
৳2,200. This keeps every bottle size consistent without you manually recalculating decant
prices by hand each time.

Preset decant sizes (5ml / 10ml / 15ml) are still stored as real `ProductVariant` rows with
their own `priceBdt` and `stockQty` — because you likely pre-bottle these ahead of time, so
they have real, trackable stock. **Custom** decant amounts are *not* pre-bottled or
pre-stocked; they're calculated live at order time from `pricePerMl`, with no stock tracking
(decanted to order).

## Prisma schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Gender {
  MEN
  WOMEN
  UNISEX
}

enum VariantSize {
  DECANT_5ML
  DECANT_10ML
  DECANT_15ML
  FULL_BOTTLE
}

enum OrderStatus {
  PENDING       // just came in, not yet contacted
  CONFIRMED     // you called/messaged, customer confirmed
  SHIPPED
  DELIVERED
  CANCELLED
}

model Product {
  id                     String   @id @default(cuid())
  slug                   String   @unique          // e.g. "afnan-rare-reef"
  brand                  String                     // "Afnan"
  name                   String                     // "Rare Reef"
  gender                 Gender
  description            String?  @db.Text

  // Fragrance note pyramid
  topNotes               String[]
  middleNotes            String[]
  baseNotes              String[]

  // Real bottle economics — the source of truth for all decant pricing
  actualBottleMl         Int                        // 75, 100, 125, etc. — the real bottle size
  actualBottleFullPriceBdt Int                      // what a full bottle at that size costs you

  images                 String[]                   // Vercel Blob URLs, first = cover image
  isActive               Boolean  @default(true)     // hide instead of delete
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  variants               ProductVariant[]
  orderItems             OrderItem[]

  @@index([isActive])
  @@index([gender])
}

model ProductVariant {
  id          String       @id @default(cuid())
  productId   String
  product     Product      @relation(fields: [productId], references: [id], onDelete: Cascade)

  size        VariantSize                          // preset size (never used for custom)
  priceBdt    Int                                   // pre-computed from pricePerMl at creation,
                                                      // editable by hand if you want to round nicely
  stockQty    Int          @default(0)
  sku         String?      @unique

  orderItems  OrderItem[]

  @@index([productId])
  @@unique([productId, size])                       // one row per size per product
}

model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique                 // human-friendly, e.g. "CN-1042"
  customerName  String
  phone         String
  address       String      @db.Text
  city          String
  notes         String?     @db.Text
  status        OrderStatus @default(PENDING)
  totalBdt      Int
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  items         OrderItem[]

  @@index([status])
  @@index([createdAt])
}

model OrderItem {
  id                String          @id @default(cuid())
  orderId           String
  order             Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId         String                          // always set, even for custom decants
  product           Product         @relation(fields: [productId], references: [id])

  productVariantId  String?                         // set for preset sizes; null for custom
  productVariant    ProductVariant? @relation(fields: [productVariantId], references: [id])

  customMl          Int?                            // set only when this was a custom amount

  label             String                          // snapshot, e.g. "10ml Decant" or "22ml Custom Decant"
  quantity          Int
  unitPriceBdtAtOrder Int                            // snapshot — protects history from future price changes
  totalPriceBdtAtOrder Int

  @@index([orderId])
}
```

## `lib/pricing.ts` (referenced by both the API route and the UI for live estimates)

```ts
export function pricePerMl(product: { actualBottleFullPriceBdt: number; actualBottleMl: number }) {
  return product.actualBottleFullPriceBdt / product.actualBottleMl;
}

export function customDecantPrice(
  product: { actualBottleFullPriceBdt: number; actualBottleMl: number },
  ml: number,
) {
  return Math.round(pricePerMl(product) * ml);
}
```

**Important:** the UI can use this for a live price preview as the customer types a custom `ml`
value, but the `/api/orders` route must **recompute it server-side** from the product's current
`actualBottleFullPriceBdt` / `actualBottleMl` before saving — never trust a price the client sends.

## Design notes
- **Notes as three separate arrays** (`topNotes`, `middleNotes`, `baseNotes`) instead of one
  flat list — matches how fragrance pyramids are actually described and lets the product page
  render the classic top/middle/base layout.
- **`gender` as an enum**, not a string — keeps filtering reliable (`MEN` / `WOMEN` / `UNISEX`).
- **`actualBottleMl` + `actualBottleFullPriceBdt` on `Product`**, not hardcoded to 100ml —
  handles the 75ml/100ml/125ml reality directly, with `pricePerMl` as the single source of
  truth for every decant price.
- **`OrderItem.customMl`**: nullable, only populated for made-to-order custom decants. When set,
  `productVariantId` is null; when a preset size is ordered, it's the reverse.
- **Unit + total price snapshots on `OrderItem`**: protects order history if you later change a
  bottle's price or restock at a different cost.
- **`isActive` instead of deleting products**: keeps order history intact.

## Managing inventory day-to-day (Phase 1)
```bash
bunx prisma studio
```
Point it at your production `DATABASE_URL` (Neon connection string). Add products, set
`actualBottleMl` / `actualBottleFullPriceBdt`, then add `ProductVariant` rows for the preset
sizes you're pre-bottling, with prices computed via `pricePerMl` (round however you like — e.g.
to the nearest ৳10). No custom decant rows needed — those are calculated live.
