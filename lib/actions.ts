"use server";

import { placeOrder, placeBundleOrder, type OfferOrderInput, type OrderInput, type OrderResult } from "@/lib/orders";

export async function submitOrder(input: OrderInput): Promise<OrderResult> {
  return placeOrder(input);
}

export async function submitOfferOrder(input: OfferOrderInput): Promise<OrderResult> {
  return placeBundleOrder(input);
}
