import type { Gender, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GenderFilter, ProductVariantView, ProductWithVariants } from "@/types";
import { cacheLife, cacheTag } from "next/cache";

export function variantLabel(size: string, bottleMl?: number) {
  if (size === "FULL_BOTTLE") {
    return bottleMl ? `Full Bottle (${bottleMl}ml)` : "Full Bottle";
  }

  const ml = size.replace("DECANT_", "").toLowerCase();
  return `${ml} Decant`;
}

function toProductView(product: Product & { variants: ProductVariant[] }): ProductWithVariants {
  let priceFloor = Infinity;
  let priceCeiling = -Infinity;
  let hasStock = false;

  const blobBase = process.env.BLOB || "";

  const variants: ProductVariantView[] = product.variants.map((variant) => {
    if (variant.priceBdt < priceFloor) priceFloor = variant.priceBdt;
    if (variant.priceBdt > priceCeiling) priceCeiling = variant.priceBdt;
    if (variant.stockQty > 0) hasStock = true;

    return {
      id: variant.id,
      size: variant.size,
      label: variantLabel(variant.size, product.actualBottleMl),
      priceBdt: variant.priceBdt,
      stockQty: variant.stockQty,
    };
  });

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
    images: product.images.map((img) => img.startsWith("http") ? img : `${blobBase}${img}`),
    isActive: product.isActive,
    variants,
    priceFloor: variants.length ? priceFloor : 0,
    priceCeiling: variants.length ? priceCeiling : 0,
    hasStock,
  };
}

export async function getActiveProducts(gender: GenderFilter = "ALL", search?: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(gender !== "ALL" ? { gender } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { brand: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductView);
}

export async function getFeaturedProducts(limit = 4) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(toProductView);
}

export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

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
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

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
