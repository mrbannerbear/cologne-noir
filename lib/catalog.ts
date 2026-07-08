import { customDecantPrice } from "@/lib/pricing";

export type CatalogGender = "MEN" | "WOMEN" | "UNISEX";

export type CatalogVariantSize = "DECANT_5ML" | "DECANT_10ML" | "DECANT_15ML" | "FULL_BOTTLE";

export type CatalogVariant = {
  size: CatalogVariantSize;
  label: string;
  priceBdt: number;
  stockQty: number;
};

export type CatalogProduct = {
  slug: string;
  brand: string;
  name: string;
  gender: CatalogGender;
  description: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  actualBottleMl: number;
  actualBottleFullPriceBdt: number;
  variants: CatalogVariant[];
  images: string[];
  isActive: boolean;
  priceFloor: number;
};

const productData: Omit<CatalogProduct, "priceFloor">[] = [
  {
    slug: "afnan-rare-reef",
    brand: "Afnan",
    name: "Rare Reef",
    gender: "MEN",
    description:
      "Marine freshness with a clean dry-down and enough presence to read clearly in a small room or on a warm evening.",
    topNotes: ["Bergamot", "Marine accord", "Apple"],
    middleNotes: ["Lavender", "Cardamom", "Clary sage"],
    baseNotes: ["Amber", "Musk", "Woody notes"],
    actualBottleMl: 100,
    actualBottleFullPriceBdt: 8500,
    variants: [
      { size: "DECANT_5ML", label: "5ml Decant", priceBdt: 450, stockQty: 8 },
      { size: "DECANT_10ML", label: "10ml Decant", priceBdt: 850, stockQty: 5 },
      { size: "DECANT_15ML", label: "15ml Decant", priceBdt: 1250, stockQty: 3 },
      { size: "FULL_BOTTLE", label: "Full Bottle", priceBdt: 8500, stockQty: 1 },
    ],
    images: [],
    isActive: true,
  },
  {
    slug: "lattafa-khamrah",
    brand: "Lattafa",
    name: "Khamrah",
    gender: "UNISEX",
    description:
      "Warm, sweet, and immediately recognizable. Built for people who want a richer evening signature without going loud.",
    topNotes: ["Cinnamon", "Nutmeg", "Bergamot"],
    middleNotes: ["Dates", "Praline", "Tuberose"],
    baseNotes: ["Vanilla", "Tonka bean", "Amberwood"],
    actualBottleMl: 100,
    actualBottleFullPriceBdt: 6800,
    variants: [
      { size: "DECANT_5ML", label: "5ml Decant", priceBdt: 350, stockQty: 10 },
      { size: "DECANT_10ML", label: "10ml Decant", priceBdt: 650, stockQty: 7 },
      { size: "DECANT_15ML", label: "15ml Decant", priceBdt: 950, stockQty: 4 },
      { size: "FULL_BOTTLE", label: "Full Bottle", priceBdt: 6800, stockQty: 2 },
    ],
    images: [],
    isActive: true,
  },
  {
    slug: "coach-dreams",
    brand: "Coach",
    name: "Dreams",
    gender: "WOMEN",
    description:
      "A softer floral-woody profile with enough brightness for day wear and enough structure to avoid feeling thin.",
    topNotes: ["Pear", "Bitter orange", "Pink pepper"],
    middleNotes: ["Gardenia", "Litchi", "Rose"],
    baseNotes: ["Vetiver", "Cedar", "Musk"],
    actualBottleMl: 90,
    actualBottleFullPriceBdt: 9200,
    variants: [
      { size: "DECANT_5ML", label: "5ml Decant", priceBdt: 500, stockQty: 6 },
      { size: "DECANT_10ML", label: "10ml Decant", priceBdt: 950, stockQty: 4 },
      { size: "DECANT_15ML", label: "15ml Decant", priceBdt: 1400, stockQty: 2 },
      { size: "FULL_BOTTLE", label: "Full Bottle", priceBdt: 9200, stockQty: 1 },
    ],
    images: [],
    isActive: true,
  },
];

export const featuredProducts: CatalogProduct[] = productData.map((product) => ({
  ...product,
  priceFloor: Math.min(...product.variants.map((variant) => variant.priceBdt)),
}));

export function getProductBySlug(slug: string) {
  return featuredProducts.find((product) => product.slug === slug);
}

export function getCollectionStats() {
  const activeProducts = featuredProducts.filter((product) => product.isActive).length;
  const allVariants = featuredProducts.flatMap((product) => product.variants);
  const priceFloor = Math.min(...allVariants.map((variant) => variant.priceBdt));
  const priceCeiling = Math.max(...allVariants.map((variant) => variant.priceBdt));

  return {
    activeProducts,
    variantCount: allVariants.length,
    priceFloor,
    priceCeiling,
  };
}

export function getCustomPreview(product: Pick<CatalogProduct, "actualBottleFullPriceBdt" | "actualBottleMl">) {
  return customDecantPrice(product, 20);
}