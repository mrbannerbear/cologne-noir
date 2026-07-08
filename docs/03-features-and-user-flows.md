# Features & User Flows

## Feature list (Phase 1)

| Feature | Priority | Notes |
|---|---|---|
| Product catalog (grid) | Must | Filter by gender (Men/Women/Unisex), maybe brand |
| Product detail page | Must | Images, note pyramid (top/middle/base), variant picker, price, stock |
| Variant selector (preset + custom) | Must | 5ml/10ml/15ml/Full Bottle pills + "Custom Amount" input |
| Order form (no cart) | Must | One product at a time |
| Order confirmation page | Must | Sets expectations: "we'll message you shortly" |
| WhatsApp notification | Must | Instant alert to you on new order |
| Out-of-stock handling | Must | Disable preset "Order" button, show "Sold Out" — custom amounts are always orderable (made to order) unless you deactivate the product |
| About / Shipping info page | Should | Authenticity promise, delivery areas, COD explanation |
| Search | Could | Only worth it once catalog > ~20 products |

## User flow: Browse → Order

1. Customer lands on homepage (likely from an IG bio link or story swipe-up).
2. Sees featured products + a "Shop All" link to `/products`, filterable by Men/Women/Unisex.
3. Clicks a product → `/products/[slug]`.
4. Sees photos, brand/name, gender tag, the note pyramid (Top / Middle / Base notes), and a
   **variant selector**:
   - Pills for each active preset: "5ml — ৳450", "10ml — ৳850", "15ml — ৳1,250", "Full Bottle
     (100ml) — ৳8,500" — disabled + "Sold Out" if `stockQty` is 0.
   - A **"Custom Amount"** pill that reveals a number input (ml). As the customer types, the
     price updates live using `pricePerMl` from `lib/pricing.ts` (client-side estimate only —
     server recalculates on submit).
5. Selects a variant (or enters a custom ml amount) + quantity, clicks **"Order Now"**.
6. A glass bottom-sheet order form appears asking for:
   - Full name
   - Phone number
   - Delivery address
   - City
   - Optional note (e.g. "call after 6pm")
7. Submits → `POST /api/orders`.
8. Server validates with Zod, **recomputes the price server-side** (critical for custom
   amounts — never trust the client's number), creates `Order` + `OrderItem`, generates
   `orderNumber`.
9. Server calls `sendWhatsAppNotification()` with the order summary.
10. Customer is redirected to `/order/confirmation` with their order number and a message like
    *"Thanks! We'll message or call you on [phone] within a few hours to confirm your order."*
11. You get the WhatsApp alert, contact the customer, confirm — then manually update the
    order's `status` in Prisma Studio (PENDING → CONFIRMED → SHIPPED → DELIVERED).

## API contract: `POST /api/orders`

**Request body (preset size):**
```json
{
  "productId": "clx...",
  "productVariantId": "clx...",
  "quantity": 1,
  "customerName": "Sayed Rahman",
  "phone": "017XXXXXXXX",
  "address": "House 12, Road 4, Nasirabad",
  "city": "Chittagong",
  "notes": "Please call before delivery"
}
```

**Request body (custom decant amount):**
```json
{
  "productId": "clx...",
  "customMl": 22,
  "quantity": 1,
  "customerName": "Sayed Rahman",
  "phone": "017XXXXXXXX",
  "address": "House 12, Road 4, Nasirabad",
  "city": "Chittagong",
  "notes": null
}
```
Exactly one of `productVariantId` or `customMl` must be present — validate this explicitly with
a Zod `.refine()`.

**Server logic:**
1. Validate body against Zod schema (`lib/validations.ts`), including the "exactly one of
   variant or customMl" rule.
2. Look up the `Product`. If `productVariantId` is set: look up the `ProductVariant`, confirm
   `stockQty > 0` (or allow backorder, your call), use its `priceBdt`. If `customMl` is set:
   compute the price via `customDecantPrice(product, customMl)` from `lib/pricing.ts` —
   **always recomputed server-side, ignore any price the client might have sent**.
3. Compute `totalPriceBdtAtOrder = unitPrice * quantity`.
4. Generate a friendly `orderNumber` (e.g. `CN-${Date.now().toString().slice(-6)}`).
5. Create `Order` + one `OrderItem` (with `label` snapshotted, e.g. `"22ml Custom Decant"` or
   `"10ml Decant"`) in a single Prisma transaction.
6. Decrement `stockQty` on the variant if a preset size was used (skip for custom).
7. Fire WhatsApp notification — wrapped in try/catch, doesn't block the order response.
8. Return `{ orderNumber }` to the client.

**Response:**
```json
{ "success": true, "orderNumber": "CN-482913" }
```

## Error handling
- Invalid/missing fields, or both/neither of `productVariantId`/`customMl` set → 400 with
  field-level errors from Zod.
- Product or variant not found / inactive → 404.
- Preset variant out of stock (if you choose to block it) → 409 with a clear message.
- WhatsApp send failure → order still succeeds; log the error server-side.
