import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@/lib/prisma";
import type { Gender, VariantSize } from "@prisma/client";

const PRODUCT_COLUMNS = [
  "slug",
  "brand",
  "name",
  "concentration",
  "gender",
  "description",
  "topNotes",
  "middleNotes",
  "baseNotes",
  "actualBottleMl",
  "images",
  "isActive",
  "size",
  "priceBdt",
  "stockQty",
  "sku",
  "actualBottleFullPriceBdt",
  "hundredMlPrice",
  "fiveMlPriceBdt",
  "tenMlPriceBdt",
] as const;

const HEADER_ALIASES: Record<string, string> = {
  bottleml: "actualBottleMl",
  bottlesize: "actualBottleMl",
  bottle: "actualBottleMl",
  top: "topNotes",
  topnote: "topNotes",
  topnotes: "topNotes",
  middle: "middleNotes",
  middlenote: "middleNotes",
  middlenotes: "middleNotes",
  heart: "middleNotes",
  heartnotes: "middleNotes",
  base: "baseNotes",
  basenote: "baseNotes",
  basenotes: "baseNotes",
  image: "images",
  imagelinks: "images",
  images: "images",
  price: "priceBdt",
  pricebdt: "priceBdt",
  stock: "stockQty",
  stockqty: "stockQty",
  stockquantity: "stockQty",
  active: "isActive",
  fullbottle: "actualBottleFullPriceBdt",
  fullbottleprice: "actualBottleFullPriceBdt",
  fullbottlepricebdt: "actualBottleFullPriceBdt",
  actualbottlefullprice: "actualBottleFullPriceBdt",
  actualbottlefullpricebdt: "actualBottleFullPriceBdt",
  hundredml: "hundredMlPrice",
  hundredmlprice: "hundredMlPrice",
  hundredmlpricebdt: "hundredMlPrice",
  fiveml: "fiveMlPriceBdt",
  fivemlprice: "fiveMlPriceBdt",
  fivemlpricebdt: "fiveMlPriceBdt",
  tenml: "tenMlPriceBdt",
  tenmlprice: "tenMlPriceBdt",
  tenmlpricebdt: "tenMlPriceBdt",
};

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip carriage returns
    } else {
      field += c;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function splitList(value: string): string[] {
  let clean = value.trim();
  if (clean.startsWith("[") && clean.endsWith("]")) {
    clean = clean.slice(1, -1);
  }
  const parts = clean.includes("|") ? clean.split("|") : clean.split(/[,;\n]/);
  return Array.from(new Set(parts.map((p) => p.trim()).filter(Boolean)));
}

export function parseGender(value?: string): Gender | null {
  const s = (value ?? "").trim().toLowerCase();
  if (s === "") return null;
  if (["men", "male", "man", "homme"].includes(s)) return "MEN";
  if (["women", "woman", "female", "femme"].includes(s)) return "WOMEN";
  if (["unisex", "uni", "both", "mixed"].includes(s)) return "UNISEX";
  return null;
}

export function parseSize(value?: string): VariantSize | null {
  const s = (value ?? "").trim().toLowerCase();
  if (s === "") return null;
  if (["decant_5ml", "5ml", "5 ml", "5ml decant"].includes(s)) return "DECANT_5ML";
  if (["decant_10ml", "10ml", "10 ml", "10ml decant"].includes(s)) return "DECANT_10ML";
  if (["decant_100ml", "100ml", "100 ml", "100ml decant"].includes(s)) return "DECANT_100ML";
  if (["full_bottle", "full", "full bottle", "fb", "bottle"].includes(s)) return "FULL_BOTTLE";
  return null;
}

export function parseBool(value?: string): boolean {
  const s = (value ?? "").trim().toLowerCase();
  if (s === "") return true;
  return ["true", "1", "yes", "y", "active", "on"].includes(s);
}

export function parsePositiveInt(value?: string): number | null {
  const n = Number((value ?? "").trim());
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export function slugify(...parts: string[]): string {
  return parts
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

interface ParsedVariant {
  size: VariantSize;
  priceBdt: number;
  stockQty: number;
  sku: string | null;
}

interface ParsedProduct {
  slug: string;
  gender: Gender;
  brand: string;
  name: string;
  concentration: string | null;
  description: string | null;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  actualBottleMl: number;
  images: string[];
  isActive: boolean;
  variants: ParsedVariant[];
}

export function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s._-]+/g, "");
}

export function buildHeaderIndex(headerRow: string[]): Record<string, number> {
  const index: Record<string, number> = {};
  headerRow.forEach((cell, i) => {
    const key = normalizeHeader(cell);
    const resolved = HEADER_ALIASES[key] ?? key;
    index[normalizeHeader(resolved)] = i;
  });
  return index;
}

export function mapRow(cells: string[], headerIndex: Record<string, number>): Record<string, string> {
  const row: Record<string, string> = {};
  for (const col of PRODUCT_COLUMNS) {
    const idx = headerIndex[normalizeHeader(col)];
    if (idx !== undefined && cells[idx] !== undefined) {
      row[col] = cells[idx] ?? "";
    }
  }
  return row;
}

export function pickNonEmpty(rows: Record<string, string>[], col: string): string | undefined {
  for (const row of rows) {
    const v = row[col]?.trim();
    if (v) return v;
  }
  return undefined;
}

export function parseProduct(slug: string, rows: Record<string, string>[], lineNumbers: number[]): ParsedProduct | null {
  const gender = parseGender(pickNonEmpty(rows, "gender"));
  if (!gender) {
    console.error(`  skip lines ${lineNumbers.join(", ")}: invalid or missing gender`);
    return null;
  }

  const brand = pickNonEmpty(rows, "brand");
  const name = pickNonEmpty(rows, "name");
  if (!brand || !name) {
    console.error(`  skip lines ${lineNumbers.join(", ")}: brand and name are required`);
    return null;
  }

  const actualBottleMl = parsePositiveInt(pickNonEmpty(rows, "actualBottleMl"));
  if (actualBottleMl === null) {
    console.error(`  skip lines ${lineNumbers.join(", ")}: actualBottleMl must be a positive integer`);
    return null;
  }

  const pickList = (col: string): string[] => {
    const v = pickNonEmpty(rows, col);
    return v ? splitList(v) : [];
  };

  const buildVariantsFromSizeRows = (): ParsedVariant[] => {
    const variants: ParsedVariant[] = [];
    const seenSizes = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNumber = lineNumbers[i] ?? "?";
      if (!row) continue;

      const sizeRaw = row["size"]?.trim();
      if (!sizeRaw) continue;
      const size = parseSize(sizeRaw);
      if (!size) {
        console.error(`  skip variant on line ${lineNumber}: unknown size "${sizeRaw}"`);
        continue;
      }

      const priceBdt = parsePositiveInt(row["priceBdt"]);
      if (priceBdt === null) {
        console.error(`  skip variant on line ${lineNumber}: priceBdt must be a positive integer`);
        continue;
      }

      if (seenSizes.has(size)) {
        console.error(`  skip duplicate variant ${size} on line ${lineNumber}`);
        continue;
      }
      seenSizes.add(size);

      const stockRaw = Number((row["stockQty"] ?? "0").trim());
      const stockQty = Number.isInteger(stockRaw) ? Math.max(0, stockRaw) : 0;
      const sku = row["sku"]?.trim() || null;

      variants.push({ size, priceBdt, stockQty, sku });
    }

    return variants;
  };

  const buildVariantsFromPriceColumns = (): ParsedVariant[] => {
    const variants: ParsedVariant[] = [];

    const addVariant = (size: VariantSize, priceRaw: string | undefined, label: string) => {
      const priceBdt = parsePositiveInt(priceRaw);
      if (priceBdt === null) {
        console.error(`  skip ${label} variant: invalid price "${priceRaw ?? ""}"`);
        return;
      }
      variants.push({ size, priceBdt, stockQty: 0, sku: null });
    };

    const fullBottle = pickNonEmpty(rows, "actualBottleFullPriceBdt") ?? pickNonEmpty(rows, "hundredMlPrice");
    addVariant("FULL_BOTTLE", fullBottle, "full bottle");
    addVariant("DECANT_5ML", pickNonEmpty(rows, "fiveMlPriceBdt"), "5ml");
    addVariant("DECANT_10ML", pickNonEmpty(rows, "tenMlPriceBdt"), "10ml");

    return variants;
  };

  const variants = pickNonEmpty(rows, "size")
    ? buildVariantsFromSizeRows()
    : buildVariantsFromPriceColumns();

  return {
    slug,
    gender,
    brand,
    name,
    concentration: pickNonEmpty(rows, "concentration") ?? null,
    description: pickNonEmpty(rows, "description") ?? null,
    topNotes: pickList("topNotes"),
    middleNotes: pickList("middleNotes"),
    baseNotes: pickList("baseNotes"),
    actualBottleMl,
    images: pickList("images"),
    isActive: parseBool(pickNonEmpty(rows, "isActive")),
    variants,
  };
}

export interface ImportSummary {
  createdProducts: number;
  updatedProducts: number;
  createdVariants: number;
  updatedVariants: number;
  failed: number;
}

export async function importProductsFromFile(filePath: string): Promise<ImportSummary> {
  const text = fs.readFileSync(filePath, "utf8");
  const rawRows = parseCsv(text).filter((row) => row.some((cell) => cell.trim() !== ""));

  if (rawRows.length < 2) {
    throw new Error("CSV must contain a header row and at least one data row.");
  }

  const headerRow = rawRows[0];
  if (!headerRow) {
    throw new Error("CSV is empty.");
  }

  const headerIndex = buildHeaderIndex(headerRow);

  const groups = new Map<string, { rows: Record<string, string>[]; lineNumbers: number[] }>();

  for (let i = 1; i < rawRows.length; i++) {
    const cells = rawRows[i];
    if (!cells) continue;
    const row = mapRow(cells, headerIndex);
    const lineNumber = i + 1;

    let slug = row["slug"]?.trim() ?? "";
    if (!slug) {
      slug = slugify(row["brand"] ?? "", row["name"] ?? "");
    }
    if (!slug) {
      console.error(`  skip line ${lineNumber}: could not determine slug`);
      continue;
    }

    const group = groups.get(slug);
    if (group) {
      group.rows.push(row);
      group.lineNumbers.push(lineNumber);
    } else {
      groups.set(slug, { rows: [row], lineNumbers: [lineNumber] });
    }
  }

  for (const [slug, group] of groups) {
    if (group.lineNumbers.length > 1) {
      console.error(`  warning: slug "${slug}" on lines ${group.lineNumbers.join(", ")} merged as one product`);
    }
  }

  console.log(`Importing ${groups.size} product(s) from ${filePath}\n`);

  let createdProducts = 0;
  let updatedProducts = 0;
  let createdVariants = 0;
  let updatedVariants = 0;
  let failed = 0;

  for (const [slug, group] of groups) {
    const product = parseProduct(slug, group.rows, group.lineNumbers);
    if (!product) {
      failed++;
      continue;
    }

    try {
      const existedBefore = await prisma.product.findUnique({ where: { slug } });

      const result = await prisma.$transaction(async (tx) => {
        const saved = await tx.product.upsert({
          where: { slug },
          update: {
            slug,
            gender: product.gender,
            brand: product.brand,
            name: product.name,
            concentration: product.concentration,
            description: product.description,
            topNotes: product.topNotes,
            middleNotes: product.middleNotes,
            baseNotes: product.baseNotes,
            actualBottleMl: product.actualBottleMl,
            images: product.images,
            isActive: product.isActive,
            updatedAt: new Date(),
          },
          create: {
            slug,
            gender: product.gender,
            brand: product.brand,
            name: product.name,
            concentration: product.concentration,
            description: product.description,
            topNotes: product.topNotes,
            middleNotes: product.middleNotes,
            baseNotes: product.baseNotes,
            actualBottleMl: product.actualBottleMl,
            images: product.images,
            isActive: product.isActive,
          },
        });

        let variantsCreated = 0;
        let variantsUpdated = 0;
        for (const variant of product.variants) {
          const existing = await tx.productVariant.findUnique({
            where: { productId_size: { productId: saved.id, size: variant.size } },
          });
          await tx.productVariant.upsert({
            where: { productId_size: { productId: saved.id, size: variant.size } },
            update: {
              priceBdt: variant.priceBdt,
              stockQty: variant.stockQty,
              sku: variant.sku,
            },
            create: {
              productId: saved.id,
              size: variant.size,
              priceBdt: variant.priceBdt,
              stockQty: variant.stockQty,
              sku: variant.sku,
            },
          });
          if (existing) {
            variantsUpdated++;
          } else {
            variantsCreated++;
          }
        }

        return { variantsCreated, variantsUpdated };
      });

      if (existedBefore) {
        updatedProducts++;
      } else {
        createdProducts++;
      }
      createdVariants += result.variantsCreated;
      updatedVariants += result.variantsUpdated;

      console.log(
        `  ${product.gender.padEnd(6)} ${slug} - ${product.name} (${product.variants.length} variant(s))`,
      );
    } catch (err) {
      failed++;
      console.error(`  FAILED ${slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(
    `\nDone. created: ${createdProducts}, updated: ${updatedProducts}, ` +
      `variants created: ${createdVariants}, updated: ${updatedVariants}, failed: ${failed}`,
  );

  return { createdProducts, updatedProducts, createdVariants, updatedVariants, failed };
}

async function main() {
  const fileArg = process.argv[2];
  const filePath = path.resolve(process.cwd(), fileArg ?? process.env.CSV_PATH ?? "data/products.csv");

  if (!fs.existsSync(filePath)) {
    console.error("CSV file not found:", filePath);
    console.error("\nPlace your CSV at data/products.csv (or pass a path: tsx scripts/import-products.ts <file>)");
    console.error("\nRequired columns: slug, brand, name, gender, actualBottleMl");
    console.error("Optional product columns: concentration, description, topNotes, middleNotes, baseNotes, images, isActive");
    console.error("Variant columns (one row per size): size, priceBdt, stockQty, sku");
    console.error("\nNotes/arrays use \"|\" as separator (or commas inside quotes). Example: topNotes=\"Bergamot|Lemon|Lavender\"");
    console.error("size accepts: DECANT_5ML, DECANT_10ML, DECANT_100ML, FULL_BOTTLE (or 5ml/10ml/100ml/full).");
    console.error("Alternative format: fiveMlPriceBdt, tenMlPriceBdt, actualBottleFullPriceBdt columns instead of size/priceBdt.");
    console.error("See data/products.example.csv for a template.");
    process.exit(1);
  }

  await importProductsFromFile(filePath);
  await prisma.$disconnect();
}

const isMainModule =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  main().catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
}