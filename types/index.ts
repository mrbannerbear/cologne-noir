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

// ── Offer domain ─────────────────────────────────────────

export type BundleSize = "DECANT_5ML" | "DECANT_10ML";

export type OfferItemView = {
  slug: string;
  brand: string;
  name: string;
  images: string[];
};

export type OfferView = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  occasion: string | null;
  description: string | null;
  price5mlBdt: number;
  price10mlBdt: number;
  eventSlug: string;
  eventName: string;
  items: OfferItemView[];
};

export type OfferDetailView = OfferView & {
  eventDescription: string | null;
  products: ProductWithVariants[];
};

export type OfferOrderFormData = {
  offerId: string;
  size: BundleSize;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
};
