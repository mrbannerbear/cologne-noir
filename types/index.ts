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
  isActive: boolean;
  variants: ProductVariantView[];
  priceFloor: number;
  priceCeiling: number;
  hasStock: boolean;
};

export type GenderFilter = Gender | "ALL";

// ── Order domain ──────────────────────────────────────────

export type VariantSelection =
  | { mode: "preset"; variantId: string; label: string; unitPrice: number }
  | { mode: "custom"; customMl: number; label: string; unitPrice: number };

export type OrderFormData = {
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

export type OrderApiResponse =
  | { success: true; orderNumber: string }
  | { success: false; message: string };

// ── Collection / stats ───────────────────────────────────

export type CollectionStats = {
  activeProducts: number;
  variantCount: number;
  priceFloor: number;
  priceCeiling: number;
};
