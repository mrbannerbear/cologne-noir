import { Gender, VariantSize } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { seedProducts } from "../lib/seed-data";

async function main() {
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        brand: product.brand,
        name: product.name,
        concentration: product.concentration,
        gender: product.gender as Gender,
        description: product.description,
        topNotes: product.topNotes,
        middleNotes: product.middleNotes,
        baseNotes: product.baseNotes,
        actualBottleMl: product.actualBottleMl,
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
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        concentration: product.concentration,
        gender: product.gender as Gender,
        description: product.description,
        topNotes: product.topNotes,
        middleNotes: product.middleNotes,
        baseNotes: product.baseNotes,
        actualBottleMl: product.actualBottleMl,
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
