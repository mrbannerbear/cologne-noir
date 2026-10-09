import type { Offer, OfferEvent, Product, ProductVariant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { OfferItemView, OfferView } from "@/types";

type OfferWithEvent = Offer & { event: Pick<OfferEvent, "slug" | "name"> };
type ProductWithVariants = Product & { variants: ProductVariant[] };

export async function getActiveOffers(): Promise<OfferView[]> {
  const offers = await prisma.offer.findMany({
    where: { isActive: true, event: { isActive: true } },
    include: { event: { select: { slug: true, name: true } } },
    orderBy: [{ event: { createdAt: "asc" } }, { sortOrder: "asc" }],
  });

  if (offers.length === 0) return [];

  const slugs = Array.from(new Set(offers.flatMap((offer) => offer.productSlugs)));
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const blobBase = process.env.BLOB || "";

  return offers.map((offer) => toOfferView(offer, productBySlug, blobBase));
}

export function toOfferView(
  offer: OfferWithEvent,
  productBySlug: Map<string, ProductWithVariants>,
  blobBase: string,
): OfferView {
  const items: OfferItemView[] = offer.productSlugs
    .map((slug) => productBySlug.get(slug))
    .filter((product): product is ProductWithVariants => Boolean(product))
    .map((product) => ({
      slug: product.slug,
      brand: product.brand,
      name: product.name,
      images: product.images.map((img) =>
        img.startsWith("http") ? img : `${blobBase}${img}`,
      ),
    }));

  return {
    id: offer.id,
    slug: offer.slug,
    name: offer.name,
    tagline: offer.tagline,
    occasion: offer.occasion,
    description: offer.description,
    price5mlBdt: offer.price5mlBdt,
    price10mlBdt: offer.price10mlBdt,
    eventSlug: offer.event.slug,
    eventName: offer.event.name,
    items,
  };
}

export async function getOfferById(id: string): Promise<OfferWithEvent | null> {
  return prisma.offer.findUnique({
    where: { id },
    include: { event: { select: { slug: true, name: true } } },
  });
}

export async function getOfferBySlug(slug: string): Promise<OfferWithEvent | null> {
  return prisma.offer.findUnique({
    where: { slug },
    include: { event: { select: { slug: true, name: true } } },
  });
}