# Features & User Flows

## Feature list (Phase 1)

| Feature | Priority | Notes |
|---|---|---|
| Product catalog (grid) | Must | Filter by gender (Men/Women/Unisex), maybe brand |
| Product detail page | Must | Images, note pyramid (top/middle/base), variant picker, price, stock |
| Variant selector (presets) | Must | 5ml/10ml/15ml/Full Bottle pills |
| Order form (no cart) | Must | One product at a time |
| Order confirmation page | Must | Sets expectations: "we'll message you shortly" |
| WhatsApp notification | Must | Instant alert to you on new order |
| Out-of-stock handling | Must | Product-level `isAvailable = false` → show "Sold Out", disable ordering on both client and server |
| About / Shipping info page | Should | Authenticity promise, delivery areas, COD explanation |
| Search | Could | Only worth it once catalog > ~20 products |

## User flow: Browse → Order

1. Customer lands on homepage (likely from an IG bio link or story swipe-up).
2. Sees featured products + a "Shop All" link to `/products`, filterable by Men/Women/Unisex.
3. Clicks a product → `/products/[slug]`.
4. Sees photos, brand/name, gender tag, the note pyramid (Top / Middle / Base notes), and a
**variant selector**:
   - Pills for each active preset: "5ml — ৳450", "10ml — ৳850", "15ml — ৳1,250", "Full Bottle
     (100ml) — ৳8,500". Every preset is orderable while the product is available.
5. Selects a variant + quantity, clicks **"Order Now"**.
6. A glass bottom-sheet order form appears asking for:
   - Full name
   - Phone number
   - Delivery address
   - City
   - Optional note (e.g. "call after 6pm")
7. Submits → `POST /api/orders`.
8. Server validates with Zod, **uses the variant's stored price server-side** (never trust the
   client's number), creates `Order` + `OrderItem`, generates `orderNumber`.
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

**Server logic:**
1. Validate body against Zod schema (`lib/validations.ts`).
2. Look up the `Product`. If `product.isAvailable` is `false`, reject the order. Look up the
   `ProductVariant` by `productVariantId`, use its stored `priceBdt` — **always from the
   database, ignore any price the client might have sent**.
3. Compute `totalPriceBdtAtOrder = unitPrice * quantity`.
4. Generate a friendly `orderNumber` (e.g. `CN-${Date.now().toString().slice(-6)}`).
5. Create `Order` + one `OrderItem` (with `label` snapshotted, e.g. `"10ml Decant"`) in a
   single Prisma transaction.
6. Decrement `stockQty` on the variant (admin-facing stock tracking).
7. Fire WhatsApp notification — wrapped in try/catch, doesn't block the order response.
8. Return `{ orderNumber }` to the client.

**Response:**
```json
{ "success": true, "orderNumber": "CN-482913" }
```

## Error handling
- Invalid/missing fields → 400 with field-level errors from Zod.
- Product or variant not found / product unavailable → 404 with a clear message.
- WhatsApp send failure → order still succeeds; log the error server-side.
