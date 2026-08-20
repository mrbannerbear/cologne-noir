# Database Schema

## Why Postgres + Prisma (not just JSON/spreadsheet)
You said you eventually want an admin dashboard. Starting with a real relational database now
means Phase 2 is "build a UI on top of existing data" instead of "migrate a spreadsheet into a
database while the site is live." Prisma Studio gives you a free, instant admin-panel-like GUI
in the meantime.

## Key pricing concept: preset decant sizes with stored prices
Bottles don't always come in 100ml — 75ml and 125ml variants exist too. Each `Product` stores
its **actual** bottle size so labels and page copy stay accurate. Decant prices are **stored as
real `ProductVariant` rows** (`priceBdt` per size) — set once via the import script / Prisma
Studio, never computed at order time. An order always references one concrete variant.

Example: a 125ml bottle priced at ৳12,500 → you set 5ml/10ml rows at whatever price you want
and edit them freely by hand. There is no per-ml math on the order path.

All `ProductVariant` sizes are preset (5ml / 10ml / full bottle). There is no free-form custom
amount.

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

  // Real bottle size — used for labels and page copy (e.g. "100ml bottle")
  actualBottleMl         Int                        // 75, 100, 125, etc.

  images                 String[]                   // Vercel Blob URLs, first = cover image
  isAvailable            Boolean  @default(true)    // false → sold out, ordering disabled (product stays listed)
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  variants               ProductVariant[]
  orderItems             OrderItem[]

  @@index([isAvailable])
  @@index([gender])
}

model ProductVariant {
  id          String       @id @default(cuid())
  productId   String
  product     Product      @relation(fields: [productId], references: [id], onDelete: Cascade)

  size        VariantSize
  priceBdt    Int
  stockQty    Int          @default(0)              // admin-facing stock tracking; does not gate ordering
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

  productId         String
  product           Product         @relation(fields: [productId], references: [id])

  productVariantId  String?
  productVariant    ProductVariant? @relation(fields: [productVariantId], references: [id])

  label             String                          // snapshot, e.g. "10ml Decant"
  quantity          Int
  unitPriceBdtAtOrder Int                            // snapshot — protects history from future price changes
  totalPriceBdtAtOrder Int

  @@index([orderId])
}
```

## Pricing is stored, not computed
Preset variant prices live in `ProductVariant.priceBdt` and are set by the import script or
Prisma Studio. The `/api/orders` route uses the stored variant price directly — never trusts a
price sent from the client.

## Design notes
- **Notes as three separate arrays** (`topNotes`, `middleNotes`, `baseNotes`) instead of one
  flat list — matches how fragrance pyramids are actually described and lets the product page
  render the classic top/middle/base layout.
- **`gender` as an enum**, not a string — keeps filtering reliable (`MEN` / `WOMEN` / `UNISEX`).
- **`actualBottleMl` on `Product`** — handles the 75ml/100ml/125ml reality for labels and page
  copy, with preset prices stored as `ProductVariant` rows.
- **`Product.isAvailable` instead of deleting products**: `false` keeps the product listed but
  marks it "Sold Out" and disables ordering on both client and server. Per-variant `stockQty`
  is admin-facing tracking only and never gates ordering.
- **Unit + total price snapshots on `OrderItem`**: protects order history if you later change a
  bottle's price or restock at a different cost.

## Managing inventory day-to-day (Phase 1)
```bash
bunx prisma studio
```
Point it at your production `DATABASE_URL` (Neon connection string). Add products, set
`actualBottleMl`, then add `ProductVariant` rows for the preset sizes. Toggle `isAvailable`
on a product to take a listing out of sale without removing it.
