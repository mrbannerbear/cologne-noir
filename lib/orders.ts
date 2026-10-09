import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { variantLabel } from "@/lib/products";
import { offerOrderSchema, orderSchema } from "@/lib/validations";
import { sendTelegramMessage } from "@/lib/telegram";
import { getEnvironment } from "@/lib/environment";
import { isVariantOrderable } from "@/lib/order-rules";

export type OrderInput = {
  productId: string;
  productVariantId: string;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
};

export type OfferOrderInput = {
  offerId: string;
  size: "DECANT_5ML" | "DECANT_10ML";
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
};

export type OrderResult =
  | { success: true; orderNumber: string }
  | { success: false; message: string; errors?: unknown };

const ENVIRONMENT = getEnvironment();
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

  if (!product) {
    return { success: false, message: "Product not found." };
  }

  if (!product.isAvailable) {
    return { success: false, message: "Product is not available." };
  }

  const orderNumber = createOrderNumber();

  const variant = await prisma.productVariant.findFirst({
    where: { id: body.productVariantId, productId: product.id },
  });

  if (!variant) {
    return { success: false, message: "Variant not found." };
  }

  if (!isVariantOrderable(variant.size)) {
    return { success: false, message: "This size is not orderable right now." };
  }

  const label = variantLabel(variant.size, product.actualBottleMl);
  const unitPriceBdt = variant.priceBdt;
  const productVariantId = variant.id;

  const totalPriceBdtAtOrder = unitPriceBdt * body.quantity;
  const productName = `${product.brand} ${product.name}`;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        environment: ENVIRONMENT,
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
            label,
            quantity: body.quantity,
            unitPriceBdtAtOrder: unitPriceBdt,
            totalPriceBdtAtOrder,
          },
        },
      },
    });

    await tx.productVariant.update({
      where: { id: productVariantId },
      data: { stockQty: { decrement: body.quantity } },
    });

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

const BUNDLE_SIZE_LABEL: Record<OfferOrderInput["size"], string> = {
  DECANT_5ML: "5ml",
  DECANT_10ML: "10ml",
};

export async function placeBundleOrder(input: OfferOrderInput): Promise<OrderResult> {
  let body;
  try {
    body = offerOrderSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: "Invalid order payload.", errors: error.flatten() };
    }
    throw error;
  }

  const offer = await prisma.offer.findUnique({
    where: { id: body.offerId },
    include: {
      event: { select: { slug: true, name: true, isActive: true } },
    },
  });

  if (!offer) {
    return { success: false, message: "Offer not found." };
  }

  if (!offer.isActive || !offer.event.isActive) {
    return { success: false, message: "This offer is not available right now." };
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: offer.productSlugs } },
  });

  const expectedCount = offer.productSlugs.length;
  if (products.length !== expectedCount) {
    return { success: false, message: "This offer is not available right now." };
  }

  for (const product of products) {
    if (!product.isAvailable) {
      return { success: false, message: "This offer is not available right now." };
    }
  }

  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const variants = await prisma.productVariant.findMany({
    where: { productId: { in: products.map((product) => product.id) }, size: body.size },
  });

  if (variants.length !== products.length) {
    return { success: false, message: "This offer is not available right now." };
  }

  const variantByProductId = new Map(variants.map((variant) => [variant.productId, variant]));
  const variantOrderable = variants.every((variant) => isVariantOrderable(variant.size));
  if (!variantOrderable) {
    return { success: false, message: "This size is not orderable right now." };
  }

  const unitPriceBdtAtOrder = body.size === "DECANT_5ML" ? offer.price5mlBdt : offer.price10mlBdt;
  const totalPriceBdtAtOrder = unitPriceBdtAtOrder;
  const orderNumber = createOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        environment: ENVIRONMENT,
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        city: body.city,
        notes: body.notes ?? null,
        totalBdt: totalPriceBdtAtOrder,
        offerId: offer.id,
        items: {
          create: offer.productSlugs.map((slug) => {
            const product = productBySlug.get(slug)!;
            const variant = variantByProductId.get(product.id)!;
            const label = `${offer.name} — ${variantLabel(variant.size)} (${product.brand} ${product.name})`;
            return {
              productId: product.id,
              productVariantId: variant.id,
              label,
              quantity: 1,
              unitPriceBdtAtOrder: variant.priceBdt,
              totalPriceBdtAtOrder: variant.priceBdt,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const variant of variantByProductId.values()) {
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockQty: { decrement: 1 } },
      });
    }

    return createdOrder;
  });

  const itemLines = order.items
    .map((item) => `\n    · ${item.label}`)
    .join("");

  const telegramMessage =
    `${MESSAGE_TYPE}:\n` +
    `\nOrder Number: ${order.orderNumber}` +
    `\nCustomer: ${order.customerName}` +
    `\nPhone: ${order.phone}` +
    `\nAddress: ${order.address}, ${order.city}` +
    `\nBundle: ${offer.name}` +
    `\nSize: ${BUNDLE_SIZE_LABEL[body.size]}` +
    `\nContents:${itemLines}` +
    `\nTotal Price: ${totalPriceBdtAtOrder} BDT` +
    (order.notes ? `\nNotes: ${order.notes}` : "");

  sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, telegramMessage);
  sendTelegramMessage(process.env.TELEGRAM_COMMUNITY_CHAT_ID, telegramMessage);

  return { success: true, orderNumber: order.orderNumber };
}
