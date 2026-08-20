import type { Gender, VariantSize } from "@prisma/client";

// ── Product domain ────────────────────────────────────────

export type ProductVariantView = {
  id: string;
  size: VariantSize;
  label: string;
  priceBdt: number;
  stockQty: number;
};

export type ProductWithVariants = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  gender: Gender;
  description: string | null;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  actualBottleMl: number;
  images: string[];
  isAvailable: boolean;
  variants: ProductVariantView[];
  priceFloor: number;
  priceCeiling: number;
  hasStock: boolean;
};

export type GenderFilter = Gender | "ALL";

// ── Order domain ──────────────────────────────────────────

export type VariantSelection = {
  variantId: string;
  label: string;
  unitPrice: number;
};

export type OrderFormData = {
  productId: string;
  productVariantId: string;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
};

export type OrderApiResponse =
  | { success: true; orderNumber: string }
  | { success: false; message: string };

// ── Collection / stats ───────────────────────────────────

export type CollectionStats = {
  totalProducts: number;
  variantCount: number;
  priceFloor: number;
  priceCeiling: number;
};
