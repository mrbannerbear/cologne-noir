import type { VariantSize } from "@prisma/client";

/**
 * TEMPORARY ordering rules — "separate file with notes as reminder".
 *
 * These are presentation/ordering gates only. The DATABASE IS INTENTIONALLY
 * UNCHANGED: `ProductVariant` rows for hidden/blocked sizes still exist and
 * keep their stock/price. Revisit and remove when the business rules change.
 *
 *  - HIDDEN_VARIANT_SIZES  -> omitted from the public UI (not shown, not selectable
 *    by customers). Still orderable through the API if a crafted request arrives.
 *  - BLOCKED_ORDER_VARIANT_SIZES -> REJECTED at order time (server-side guard in
 *    `lib/orders.ts`). May or may not be visible in the UI.
 */
export const HIDDEN_VARIANT_SIZES: readonly VariantSize[] = ["DECANT_100ML"];

export const BLOCKED_ORDER_VARIANT_SIZES: readonly VariantSize[] = ["DECANT_100ML"];

export function isVariantVisible(size: VariantSize): boolean {
  return !HIDDEN_VARIANT_SIZES.includes(size);
}

export function isVariantOrderable(size: VariantSize): boolean {
  return !BLOCKED_ORDER_VARIANT_SIZES.includes(size);
}