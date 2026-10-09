import { Suspense } from "react";
import { GenderFilterBar, SearchBar } from "@/components/catalog-filters";
import { FadeIn } from "@/components/fade-in";
import { OffersSection, OffersSectionSkeleton } from "@/components/offers-section";
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
      <div className="max-w-3xl space-y-4">
        <p className="label-caps text-muted">Catalog</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-light tracking-[-0.02em] text-foreground leading-[1.08]">
          Decants and full bottles
        </h1>
        <p className="max-w-2xl text-base leading-8 text-muted">
          Filter by gender, or order preset decant sizes and full bottles priced from the actual
          bottle size.
        </p>
      </div>

      {/* Offers — active offer-event bundles; hidden entirely when none are active */}
      <Suspense fallback={<OffersSectionSkeleton />}>
        <OffersSection />
      </Suspense>

      {/* Individual perfumes */}
      <section className="mt-16 border-t border-border pt-10" aria-label="Perfume catalog">
        <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-caps text-xs text-muted">Perfumes</p>
            <h2 className="mt-1 font-display text-3xl font-light text-foreground">
              Browse the full catalog
            </h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Suspense fallback={<div className="h-10 w-64 bg-muted/10 rounded-xs" />}>
              <SearchBar />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-16 bg-muted/10 rounded-xs" />}>
              <GenderFilterBar />
            </Suspense>
          </div>
        </div>

        <div className="mt-8">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductResults gender={gender} q={q} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
