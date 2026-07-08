import type { Gender, VariantSize } from "@prisma/client";

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
  actualBottleFullPriceBdt: number;
  images: string[];
  isActive: boolean;
  variants: ProductVariantView[];
  priceFloor: number;
  priceCeiling: number;
  hasStock: boolean;
};

export type ProductVariantView = {
  id: string;
  size: VariantSize;
  label: string;
  priceBdt: number;
  stockQty: number;
};

export type GenderFilter = Gender | "ALL";
