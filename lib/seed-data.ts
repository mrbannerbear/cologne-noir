import type { Gender, VariantSize } from "@prisma/client";

export type SeedVariant = {
  size: VariantSize;
  priceBdt: number;
  stockQty: number;
};

export type SeedProduct = {
  slug: string;
  brand: string;
  name: string;
  concentration?: string;
  gender: Gender;
  description: string;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  actualBottleMl: number;
  variants: SeedVariant[];
  images: string[];
  isActive: boolean;
};

export const seedProducts: SeedProduct[] = [
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
    variants: [
      { size: "DECANT_5ML", priceBdt: 450, stockQty: 8 },
      { size: "DECANT_10ML", priceBdt: 850, stockQty: 5 },
      { size: "DECANT_100ML", priceBdt: 8500, stockQty: 3 },
      { size: "FULL_BOTTLE", priceBdt: 8500, stockQty: 1 },
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
    variants: [
      { size: "DECANT_5ML", priceBdt: 350, stockQty: 10 },
      { size: "DECANT_10ML", priceBdt: 650, stockQty: 7 },
      { size: "DECANT_100ML", priceBdt: 6800, stockQty: 4 },
      { size: "FULL_BOTTLE", priceBdt: 6800, stockQty: 2 },
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
    variants: [
      { size: "DECANT_5ML", priceBdt: 500, stockQty: 6 },
      { size: "DECANT_10ML", priceBdt: 950, stockQty: 4 },
      { size: "DECANT_100ML", priceBdt: 10200, stockQty: 2 },
      { size: "FULL_BOTTLE", priceBdt: 9200, stockQty: 1 },
    ],
    images: [],
    isActive: true,
  },
];
