"use server";

import { placeOrder, type OrderInput, type OrderResult } from "@/lib/orders";

export async function submitOrder(input: OrderInput): Promise<OrderResult> {
  return placeOrder(input);
}
