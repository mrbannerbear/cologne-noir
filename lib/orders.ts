import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { customDecantPrice } from "@/lib/pricing";
import { variantLabel } from "@/lib/products";
import { orderSchema } from "@/lib/validations";
import { sendTelegramMessage } from "@/lib/telegram";

export type OrderInput = {
  productId: string;
  productVariantId?: string;
  customMl?: number;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
};

export type OrderResult =
  | { success: true; orderNumber: string }
  | { success: false; message: string; errors?: unknown };

const ENVIRONMENT = process.env.NODE_ENV || "development";
const MESSAGE_TYPE =
  ENVIRONMENT === "production" ? "Order confirmed" : "Order confirmed (Development)";

function createOrderNumber() {
  return `CN-${Date.now().toString().slice(-6)}`;
}

export async function placeOrder(input: OrderInput): Promise<OrderResult> {
  let body;
  try {
    body = orderSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: "Invalid order payload.", errors: error.flatten() };
    }
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  });

  if (!product || !product.isActive) {
    return { success: false, message: "Product not found." };
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
      return { success: false, message: "Variant not found." };
    }

    if (variant.stockQty < body.quantity) {
      return { success: false, message: "Variant is sold out." };
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
      return { success: false, message: "Full bottle pricing not found." };
    }

    unitPriceBdt = customDecantPrice(
      fullBottleVariant.priceBdt,
      product.actualBottleMl,
      ml,
    );
    customMl = ml;
  }

  const totalPriceBdtAtOrder = unitPriceBdt * body.quantity;
  const productName = `${product.brand} ${product.name}`;

  const environment = process.env.NODE_ENV ?? "development";

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        environment,
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

  const telegramMessage =
    `${MESSAGE_TYPE}:\n` +
    `\nOrder Number: ${order.orderNumber}` +
    `\nCustomer: ${order.customerName}` +
    `\nPhone: ${order.phone}` +
    `\nAddress: ${order.address}, ${order.city}` +
    `\nProduct: ${productName}` +
    `\nVariant: ${label}` +
    `\nQuantity: ${body.quantity}` +
    `\nTotal Price: ${totalPriceBdtAtOrder} BDT` +
    (order.notes ? `\nNotes: ${order.notes}` : "");

  sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, telegramMessage);
  sendTelegramMessage(process.env.TELEGRAM_COMMUNITY_CHAT_ID, telegramMessage);

  return { success: true, orderNumber: order.orderNumber };
}
