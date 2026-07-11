import type { Gender, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GenderFilter, ProductVariantView, ProductWithVariants } from "@/types";

export function variantLabel(size: string, bottleMl?: number) {
  if (size === "FULL_BOTTLE") {
    return bottleMl ? `Full Bottle (${bottleMl}ml)` : "Full Bottle";
  }

  const ml = size.replace("DECANT_", "").toLowerCase();
  return `${ml} Decant`;
}

function toProductView(product: Product & { variants: ProductVariant[] }): ProductWithVariants {
  const variants: ProductVariantView[] = product.variants.map((variant) => ({
    id: variant.id,
    size: variant.size,
    label: variantLabel(variant.size, product.actualBottleMl),
    priceBdt: variant.priceBdt,
    stockQty: variant.stockQty,
  }));

  const prices = variants.map((variant) => variant.priceBdt);

  return {
    id: product.id,
    slug: product.slug,
    brand: product.brand,
    name: product.name,
    gender: product.gender,
    description: product.description,
    topNotes: product.topNotes,
    middleNotes: product.middleNotes,
    baseNotes: product.baseNotes,
    actualBottleMl: product.actualBottleMl,
    images: product.images,
    isActive: product.isActive,
    variants,
    priceFloor: prices.length ? Math.min(...prices) : 0,
    priceCeiling: prices.length ? Math.max(...prices) : 0,
    hasStock: variants.some((variant) => variant.stockQty > 0),
  };
}

export async function getActiveProducts(gender: GenderFilter = "ALL") {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(gender !== "ALL" ? { gender } : {}),
    },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductView);
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(toProductView);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  if (!product || !product.isActive) {
    return null;
  }

  return toProductView(product);
}

export async function getCollectionStats() {
  const products = await getActiveProducts();
  const allVariants = products.flatMap((product) => product.variants);

  return {
    activeProducts: products.length,
    variantCount: allVariants.length,
    priceFloor: allVariants.length ? Math.min(...allVariants.map((variant) => variant.priceBdt)) : 0,
    priceCeiling: allVariants.length ? Math.max(...allVariants.map((variant) => variant.priceBdt)) : 0,
  };
}

export function genderLabel(gender: Gender) {
  if (gender === "MEN") return "Men";
  if (gender === "WOMEN") return "Women";
  return "Unisex";
}
