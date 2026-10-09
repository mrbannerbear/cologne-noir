import type { Gender, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GenderFilter, ProductVariantView, ProductWithVariants } from "@/types";
import { isVariantVisible } from "@/lib/order-rules";

/* Hero feature control — set FEATURED_FRAGRANCE to anything that identifies a
   current product (a slug like "marwa-edp", or a human label like "Marwa EDP"
   / "Arabiyat Prestige Marwa"), and it becomes the homepage hero whenever the
   product is available. Empty string → always fall back to the latest product.
   This is a code-only setting for now; later it moves behind auth as an admin
   flag, and getHeroProduct() is the single place that reads it. */
export const FEATURED_FRAGRANCE = "Marwa EDP";

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

async function findFeaturedByLabel(needle: string) {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  return (
    products.find((product) => {
      const brand = product.brand;
      const name = product.name;
      const concentration = product.concentration;

      const candidates = [
        normalizeLabel([name, concentration].filter(Boolean).join(" ")),
        normalizeLabel([brand, name, concentration].filter(Boolean).join(" ")),
        normalizeLabel([brand, name].filter(Boolean).join(" ")),
        normalizeLabel(name),
        normalizeLabel(product.slug.replace(/-/g, " ")),
      ];

      return candidates.includes(needle);
    }) ?? null
  );
}

async function getFeaturedProduct() {
  const needle = normalizeLabel(FEATURED_FRAGRANCE);
  if (!needle) return null;

  const slugForm = needle.replace(/\s+/g, "-");

  const featured =
    (await prisma.product.findUnique({
      where: { slug: slugForm },
      include: { variants: { orderBy: { size: "asc" } } },
    })) ??
    (await findFeaturedByLabel(needle));

  if (!featured || !featured.isAvailable || featured.images.length === 0) {
    return null;
  }

  return toProductView(featured);
}

export async function getHeroProduct() {
  const featured = await getFeaturedProduct();
  if (featured) return featured;

  const [latest] = await prisma.product.findMany({
    include: { variants: { orderBy: { size: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return latest ? toProductView(latest) : null;
}

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

export async function getProductsBySlugs(slugs: string[]) {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  return products.map(toProductView);
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
