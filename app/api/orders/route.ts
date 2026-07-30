import { NextResponse } from "next/server";
import { placeOrder, type OrderInput } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    const input: OrderInput = {
      productId: String(payload.productId ?? ""),
      productVariantId: payload.productVariantId != null ? String(payload.productVariantId) : undefined,
      customMl: payload.customMl != null ? Number(payload.customMl) : undefined,
      quantity: Number(payload.quantity ?? 1),
      customerName: String(payload.customerName ?? ""),
      phone: String(payload.phone ?? ""),
      address: String(payload.address ?? ""),
      city: String(payload.city ?? ""),
      notes: payload.notes != null ? String(payload.notes) : null,
    };

    const result = await placeOrder(input);

    if (!result.success) {
      if (result.message === "Invalid order payload.") {
        return NextResponse.json(result, { status: 400 });
      }
      if (result.message === "Variant is sold out.") {
        return NextResponse.json(result, { status: 409 });
      }
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not create order." },
      { status: 500 },
    );
  }
}
