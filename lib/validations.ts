import { z } from "zod";

export const orderSchema = z
  .object({
    productId: z.string().min(1),
    productVariantId: z.string().min(1).optional(),
    customMl: z.coerce.number().int().positive().optional(),
    quantity: z.coerce.number().int().positive().default(1),
    customerName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(6).max(32),
    address: z.string().trim().min(10).max(500),
    city: z.string().trim().min(2).max(80),
    notes: z.string().trim().max(500).nullable().optional(),
  })
  .refine((data) => Boolean(data.productVariantId) !== Boolean(data.customMl), {
    message: "Provide exactly one of productVariantId or customMl.",
    path: ["productVariantId"],
  });