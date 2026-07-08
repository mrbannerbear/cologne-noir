import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { customDecantPrice } from "@/lib/pricing";
import { orderSchema } from "@/lib/validations";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

function createOrderNumber() {
  return `CN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 90 + 10)}`;
}

function buildOrderMessage(params: {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  label: string;
  quantity: number;
  totalBdt: number;
  notes?: string | null;
}) {
  return [
    `New Order - ${params.orderNumber}`,
    "",
    `Name: ${params.customerName}`,
    `Phone: ${params.phone}`,
    `Address: ${params.address}, ${params.city}`,
    "",
    `Item: ${params.label} x ${params.quantity}`,
    `Total: ৳${params.totalBdt.toLocaleString("en-BD")}`,
    params.notes ? `Note: ${params.notes}` : undefined,
    "",
    "Confirm in Prisma Studio after contacting the customer.",
  ]
    .filter(Boolean)
    .join("\n");
}

function labelForVariantSize(size: string) {
  if (size === "FULL_BOTTLE") {
    return "Full Bottle";
  }

  return `${size.replace("DECANT_", "").toLowerCase()} Decant`;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const body = orderSchema.parse(payload);

    const product = await prisma.product.findUnique({
      where: { id: body.productId },
      include: { variants: true },
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
      const [, variantSize] = body.productVariantId.split(":");
      const variants = product.variants as Array<{
        id: string;
        size: string;
        priceBdt: number;
        stockQty: number;
      }>;
      const variant = variants.find((item) => item.size === variantSize);

      if (!variant) {
        return NextResponse.json({ success: false, message: "Variant not found." }, { status: 404 });
      }

      if (variant.stockQty < body.quantity) {
        return NextResponse.json({ success: false, message: "Variant is sold out." }, { status: 409 });
      }

      label = labelForVariantSize(variant.size);
      unitPriceBdt = variant.priceBdt;
      productVariantId = variant.id;
    } else {
      const ml = body.customMl ?? 0;
      label = `${ml}ml Custom Decant`;
      unitPriceBdt = customDecantPrice(product, ml);
      customMl = ml;
    }

    const totalPriceBdtAtOrder = unitPriceBdt * body.quantity;

    const order = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
        include: { items: true },
      });

      if (productVariantId) {
        await tx.productVariant.update({
          where: { id: productVariantId },
          data: { stockQty: { decrement: body.quantity } },
        });
      }

      return createdOrder;
    });

    void sendWhatsAppNotification(
      buildOrderMessage({
        orderNumber: order.orderNumber,
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        city: body.city,
        label,
        quantity: body.quantity,
        totalBdt: totalPriceBdtAtOrder,
        notes: body.notes,
      }),
    );

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, message: "Invalid order payload." }, { status: 400 });
    }

    console.error("Order creation failed:", error);
    return NextResponse.json({ success: false, message: "Could not create order." }, { status: 500 });
  }
}