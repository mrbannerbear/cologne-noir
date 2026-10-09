import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { importProductsFromFile } from "@/scripts/import-products";

type OfferSeed = {
  slug: string;
  name: string;
  tagline: string;
  occasion: string;
  productSlugs: string[];
  price5mlBdt: number;
  price10mlBdt: number;
  sortOrder: number;
};

const OFFER_EVENT = {
  slug: "summer-clearance-2026",
  name: "Summer Clearance 2026",
  description: "Curated 3-perfume decant bundles at clearance prices.",
};

const OFFERS: OfferSeed[] = [
  {
    slug: "summer-bundle-1",
    name: "Summer Bundle 1",
    tagline: "Fresh • Clean • All-Day",
    occasion: "Summer",
    productSlugs: [
      "rasasi-hawas-ice-edp",
      "marwa-edp",
      "rayhaan-azul-edp",
    ],
    price5mlBdt: 810,
    price10mlBdt: 1435,
    sortOrder: 1,
  },
  {
    slug: "summer-bundle-2",
    name: "Summer Bundle 2",
    tagline: "Bold • Fresh • Versatile",
    occasion: "Summer",
    productSlugs: [
      "nine-pm-edp",
      "rayhaan-aquatica-edp",
      "rasasi-daarej-sport-edp",
    ],
    price5mlBdt: 710,
    price10mlBdt: 1280,
    sortOrder: 2,
  },
];

async function seedOffers() {
  const event = await prisma.offerEvent.upsert({
    where: { slug: OFFER_EVENT.slug },
    update: {
      name: OFFER_EVENT.name,
      description: OFFER_EVENT.description,
      isActive: true,
    },
    create: {
      slug: OFFER_EVENT.slug,
      name: OFFER_EVENT.name,
      description: OFFER_EVENT.description,
      isActive: true,
    },
  });

  for (const offer of OFFERS) {
    await prisma.offer.upsert({
      where: { slug: offer.slug },
      update: {
        name: offer.name,
        tagline: offer.tagline,
        occasion: offer.occasion,
        productSlugs: offer.productSlugs,
        price5mlBdt: offer.price5mlBdt,
        price10mlBdt: offer.price10mlBdt,
        sortOrder: offer.sortOrder,
        isActive: true,
        eventId: event.id,
      },
      create: {
        slug: offer.slug,
        name: offer.name,
        tagline: offer.tagline,
        occasion: offer.occasion,
        productSlugs: offer.productSlugs,
        price5mlBdt: offer.price5mlBdt,
        price10mlBdt: offer.price10mlBdt,
        sortOrder: offer.sortOrder,
        isActive: true,
        eventId: event.id,
      },
    });
  }

  const keptSlugs = OFFERS.map((offer) => offer.slug);
  const removed = await prisma.offer.deleteMany({
    where: { eventId: event.id, slug: { notIn: keptSlugs } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} stale offer(s) from "${OFFER_EVENT.name}".`);
  }

  console.log(`Seeded offer event "${OFFER_EVENT.name}" with ${OFFERS.length} offer(s).`);
}

async function seed() {
  const filePath = path.resolve(
    process.cwd(),
    process.env.CSV_PATH ?? "data/products.csv",
  );

  if (fs.existsSync(filePath)) {
    try {
      await importProductsFromFile(filePath);
    } finally {
      await prisma.$disconnect();
    }

    await seedOffers();
    await prisma.$disconnect();
    return;
  }

  console.warn(`No CSV found at ${filePath}; skipping product import.`);
  await seedOffers();
  await prisma.$disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});