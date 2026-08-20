import type { Gender, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GenderFilter, ProductVariantView, ProductWithVariants } from "@/types";
import { isVariantVisible } from "@/lib/order-rules";

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
  const hasStock = product.isAvailable;

  const blobBase = process.env.BLOB || "";

  const visibleVariants = product.variants.filter((variant) => isVariantVisible(variant.size));

  const variants: ProductVariantView[] = visibleVariants.map((variant) => {
    if (variant.priceBdt < priceFloor) priceFloor = variant.priceBdt;
    if (variant.priceBdt > priceCeiling) priceCeiling = variant.priceBdt;

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
    isAvailable: product.isAvailable,
    variants,
    priceFloor: variants.length ? priceFloor : 0,
    priceCeiling: variants.length ? priceCeiling : 0,
    hasStock,
  };
}

export async function getActiveProducts(gender: GenderFilter = "ALL", search?: string) {
  const products = await prisma.product.findMany({
    where: {
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
  const products = await prisma.product.findMany({
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

  if (!product) {
    return null;
  }

  return toProductView(product);
}

export async function getCollectionStats() {
  const [productCount, variantStats] = await Promise.all([
    prisma.product.count(),
    prisma.productVariant.aggregate({
      _count: true,
      _min: { priceBdt: true },
      _max: { priceBdt: true },
    }),
  ]);

  return {
    totalProducts: productCount,
    variantCount: variantStats._count,
    priceFloor: variantStats._min.priceBdt ?? 0,
    priceCeiling: variantStats._max.priceBdt ?? 0,
  };
}

export async function getProductSlugs() {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function getRelatedProducts(slug: string, limit = 3) {
  const products = await prisma.product.findMany({
    where: { slug: { not: slug } },
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map(toProductView);
}

export function genderLabel(gender: Gender) {
  if (gender === "MEN") return "Men";
  if (gender === "WOMEN") return "Women";
  return "Unisex";
}
