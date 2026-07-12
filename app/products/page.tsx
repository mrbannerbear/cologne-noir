import { Suspense } from "react";
import { GenderFilterBar, SearchBar } from "@/components/catalog-filters";
import { ProductGrid } from "@/components/product-grid";
import { getActiveProducts } from "@/lib/products";
import type { GenderFilter } from "@/types";

export const dynamic = "force-dynamic";

type ProductsPageProps = {
  searchParams: Promise<{ gender?: string; q?: string }>;
};

function parseGender(value?: string): GenderFilter {
// ... (keep existing parseGender)

  const normalized = value?.toUpperCase();
  if (normalized === "MEN" || normalized === "WOMEN" || normalized === "UNISEX") {
    return normalized;
  }
  return "ALL";
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { gender, q } = await searchParams;
  const filter = parseGender(gender);
  const products = await getActiveProducts(filter, q);

  return (
    <div className="mx-auto w-full max-w-360xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="label-caps text-muted">Catalog</p>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.05em] text-foreground">
            Decants and full bottles, laid out for fast phone browsing.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted">
            Filter by gender, check live stock on preset sizes, or request a custom ml amount priced
            from the actual bottle size.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Suspense fallback={<div className="h-10 w-64" />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={<div className="h-10" />}>
            <GenderFilterBar />
          </Suspense>
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
