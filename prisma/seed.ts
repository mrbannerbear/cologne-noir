import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { importProductsFromFile } from "@/scripts/import-products";

async function seed() {
  const filePath = path.resolve(
    process.cwd(),
    process.env.CSV_PATH ?? "data/products.csv",
  );

  if (!fs.existsSync(filePath)) {
    console.warn(`No CSV found at ${filePath}; skipping product import.`);
    return;
  }

  try {
    await importProductsFromFile(filePath);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});