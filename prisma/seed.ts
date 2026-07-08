import { PrismaClient, Gender, VariantSize } from "@prisma/client";
import { featuredProducts } from "../lib/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const product of featuredProducts) {
    await prisma.product.upsert({
      where: { id: product.slug },
      update: {
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        gender: product.gender as Gender,
        description: product.description,
        topNotes: product.topNotes,
        middleNotes: product.middleNotes,
        baseNotes: product.baseNotes,
        actualBottleMl: product.actualBottleMl,
        actualBottleFullPriceBdt: product.actualBottleFullPriceBdt,
        images: product.images,
        isActive: product.isActive,
        variants: {
          deleteMany: {},
          create: product.variants.map((variant) => ({
            size: variant.size as VariantSize,
            priceBdt: variant.priceBdt,
            stockQty: variant.stockQty,
          })),
        },
      },
      create: {
        id: product.slug,
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        gender: product.gender as Gender,
        description: product.description,
        topNotes: product.topNotes,
        middleNotes: product.middleNotes,
        baseNotes: product.baseNotes,
        actualBottleMl: product.actualBottleMl,
        actualBottleFullPriceBdt: product.actualBottleFullPriceBdt,
        images: product.images,
        isActive: product.isActive,
        variants: {
          create: product.variants.map((variant) => ({
            size: variant.size as VariantSize,
            priceBdt: variant.priceBdt,
            stockQty: variant.stockQty,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });