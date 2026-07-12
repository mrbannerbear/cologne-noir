import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { formatBdt } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { customDecantPrice } from "@/lib/pricing";
import { variantLabel } from "@/lib/products";
import { orderSchema } from "@/lib/validations";

function createOrderNumber() {
  return `CN-${Date.now().toString().slice(-6)}`;
}

function buildOrderMessage(params: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  productName: string;
  label: string;
  quantity: number;
  totalBdt: number;
  notes?: string | null;
}) {
  return [
    `🛎️ New Order — ${params.orderNumber}`,
    "",
    `👤 ${params.customerName}`,
    `📞 ${params.phone}`,
    `📍 ${params.address}, ${params.city}`,
    "",
    `🧴 ${params.label} — ${params.productName} × ${params.quantity}`,
    `💰 Total: ${formatBdt(params.totalBdt)}`,
    params.notes ? `📝 Note: ${params.notes}` : undefined,
    "",
    "Confirm via Prisma Studio once you've contacted the customer.",
  ]
    .filter(Boolean)
    .join("\n");
}

function createOrderNumber() {
  return `CN-${Date.now().toString().slice(-6)}`;
}

function buildOrderMessage(params: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  productName: string;
  label: string;
  quantity: number;
  totalBdt: number;
  notes?: string | null;
}) {
  return [
    `🛎️ New Order — ${params.orderNumber}`,
    "",
    `👤 ${params.customerName}`,
    `📞 ${params.phone}`,
    `📍 ${params.address}, ${params.city}`,
    "",
    `🧴 ${params.label} — ${params.productName} × ${params.quantity}`,
    `💰 Total: ${formatBdt(params.totalBdt)}`,
    params.notes ? `📝 Note: ${params.notes}` : undefined,
    "",
    "Confirm via Prisma Studio once you've contacted the customer.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const body = orderSchema.parse(payload);

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });
    }

    const orderNumber = createOrderNumber();
    let label: string;
    let unitPriceBdt: number;
    let productVariantId: string | null = null;
    let customMl: number | null = null;

    if (body.productVariantId) {
      const variant = await prisma.productVariant.findFirst({
        where: { id: body.productVariantId, productId: product.id },
      });

      if (!variant) {
        return NextResponse.json({ success: false, message: "Variant not found." }, { status: 404 });
      }

      if (variant.stockQty < body.quantity) {
        return NextResponse.json({ success: false, message: "Variant is sold out." }, { status: 409 });
      }

      label = variantLabel(variant.size, product.actualBottleMl);
      unitPriceBdt = variant.priceBdt;
      productVariantId = variant.id;
    } else {
      const ml = body.customMl ?? 0;
      label = `${ml}ml Custom Decant`;
      
      const fullBottleVariant = await prisma.productVariant.findFirst({
        where: { productId: product.id, size: "FULL_BOTTLE" },
      });

      if (!fullBottleVariant) {
        return NextResponse.json({ success: false, message: "Full bottle pricing not found." }, { status: 404 });
      }

      unitPriceBdt = customDecantPrice(fullBottleVariant.priceBdt, product.actualBottleMl, ml);
      customMl = ml;
    }

    const totalPriceBdtAtOrder = unitPriceBdt * body.quantity;
    const productName = `${product.brand} ${product.name}`;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: body.customerName,
          phone: body.phone,
          address: body.address,
          city: body.city,
          notes: body.notes ?? null,
          totalBdt: totalPriceBdtAtOrder,
          items: {
            create: {
              productId: product.id,
              productVariantId,
              customMl,
              label,
              quantity: body.quantity,
              unitPriceBdtAtOrder: unitPriceBdt,
              totalPriceBdtAtOrder,
            },
          },
        },
      });

      if (productVariantId) {
        await tx.productVariant.update({
          where: { id: productVariantId },
          data: { stockQty: { decrement: body.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid order payload.", errors: error.flatten() },
        { status: 400 },
      );
    }

    console.error("Order creation failed:", error);
    return NextResponse.json({ success: false, message: "Could not create order." }, { status: 500 });
  }
}
