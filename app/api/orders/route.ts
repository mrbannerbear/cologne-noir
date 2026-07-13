import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { customDecantPrice } from "@/lib/pricing";
import { variantLabel } from "@/lib/products";
import { orderSchema } from "@/lib/validations";
import { Prisma } from "@prisma/client";

function createOrderNumber() {
  return `CN-${Date.now().toString().slice(-6)}`;
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
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
      });

      if (productVariantId) {
        await tx.productVariant.update({
          where: { id: productVariantId },
          data: { stockQty: { decrement: body.quantity } },
        });
      }

      return createdOrder;
    });

    // Send Telegram notification
    const telegramMessage = "Order confirmed"
  + `\nOrder Number: ${order.orderNumber}`
  + `\nCustomer: ${order.customerName}`
  + `\nPhone: ${order.phone}`
  + `\nAddress: ${order.address}, ${order.city}`
  + `\nProduct: ${productName}`
  + `\nVariant: ${label}`
  + `\nQuantity: ${body.quantity}`
  + `\nTotal Price: ${totalPriceBdtAtOrder} BDT`
  + (order.notes ? `\nNotes: ${order.notes}` : "");

    await fetch(`https://api.telegram.org/bot8644272195:AAFnW1NuFf8iWU6oDe_68j4B1NYGVZp6ReY/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage
      })
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

