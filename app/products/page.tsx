import { Suspense } from "react";
import { GenderFilterBar, SearchBar } from "@/components/catalog-filters";
import { FadeIn } from "@/components/fade-in";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getActiveProducts } from "@/lib/products";
import type { Metadata } from "next";
import type { GenderFilter } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalog — Perfume Decants & Full Bottles",
  description:
    "Browse our full catalog of authentic perfume decants and full bottles. Filter by gender or search by brand and name.",
  alternates: {
    canonical: "https://colognenoir.com/products",
  },
  openGraph: {
    title: "Catalog — Perfume Decants & Full Bottles",
    description:
      "Browse authentic perfume decants and full bottles from Cologne Noir. Filter by gender or search by brand and name.",
    url: "https://colognenoir.com/products",
    siteName: "Cologne Noir",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalog — Perfume Decants & Full Bottles",
    description:
      "Browse authentic perfume decants and full bottles from Cologne Noir. Cash on delivery across Bangladesh.",
  },
};

type ProductsPageProps = {
  searchParams: Promise<{ gender?: string; q?: string }>;
};

function parseGender(value?: string): GenderFilter {
  const normalized = value?.toUpperCase();
  if (normalized === "MEN" || normalized === "WOMEN" || normalized === "UNISEX") {
    return normalized;
  }
  return "ALL";
}

async function ProductResults({ gender, q }: { gender?: string; q?: string }) {
  const filter = parseGender(gender);
  const products = await getActiveProducts(filter, q);
  return (
    <FadeIn>
      <ProductGrid products={products} />
    </FadeIn>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { gender, q } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="label-caps text-muted">Catalog</p>
          <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-light tracking-[-0.02em] text-foreground leading-[1.08]">
            Decants and full bottles, laid out for fast phone browsing.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-muted">
            Filter by gender, check live stock on preset sizes, or request a custom ml amount priced
            from the actual bottle size.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Suspense fallback={<div className="h-10 w-64 bg-muted/10 rounded-[2px]" />}>
            <SearchBar />
          </Suspense>
          <Suspense fallback={<div className="h-10 w-16 bg-muted/10 rounded-[2px]" />}>
            <GenderFilterBar />
          </Suspense>
        </div>
      </div>

      <div className="mt-8">
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductResults gender={gender} q={q} />
        </Suspense>
      </div>
    </div>
  );
}
