import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { ShopAllLink } from "@/components/catalog-filters";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { HeroImage } from "@/components/hero-image";
import type { Metadata } from "next";
import { getCollectionStats, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perfume Decants & Full Bottles — COD Bangladesh",
  description:
    "Browse authentic perfume decants and full bottles from Cologne Noir. Cash on delivery across Bangladesh. Verified by WhatsApp.",
  openGraph: {
    title: "Cologne Noir — Perfume Decants & Full Bottles",
    description:
      "Authentic fragrance decants and full bottles. Cash on delivery across Bangladesh. Verified by WhatsApp.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cologne Noir",
  url: "https://colognenoir.com",
  description:
    "Perfume decants and full bottles from Chittagong. Browse the catalog, order COD, confirm by WhatsApp.",
  foundingDate: "2024",
  areaServed: "BD",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Bengali", "English"],
  },
};

/* The editorial wordmark used both as the no-image fallback and as the
   Suspense skeleton for the hero visual — same box, so nothing reflows. */
function HeroVisualSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 bg-background-warm">
      <span className="label-caps text-xs text-muted">Fragrances</span>
      <div className="space-y-4">
        <p className="font-display text-7xl italic leading-none tracking-tight select-none">Cologne</p>
        <p className="font-display text-7xl font-light leading-none tracking-wider select-none text-muted pl-12">Noir</p>
      </div>
      <span className="label-caps text-[0.65rem] text-muted">Est. 2024</span>
    </div>
  );
}

async function HeroVisual() {
  const [heroProduct] = await getFeaturedProducts(1);

  if (!heroProduct) {
    return <HeroVisualSkeleton />;
  }

  const coverImage = heroProduct.images[0];

  if (!coverImage) {
    return <HeroVisualSkeleton />;
  }

  return (
    <>
      <HeroImage src={coverImage} alt={`${heroProduct.brand} ${heroProduct.name}`} />
      <div className="absolute bottom-6 left-6 right-6 bg-background/90 p-4 border border-border">
        <span className="label-caps text-[10px] text-muted">Featured Bottle</span>
        <h3 className="font-display text-xl mt-1 text-foreground">{heroProduct.brand}</h3>
        <p className="font-display text-sm italic text-muted mt-0.5">{heroProduct.name}</p>
      </div>
    </>
  );
}

/* Only the "Active catalog" figure is dynamic — keep the rest of the grid
   static and give that one cell a pulsing placeholder. */
async function ActiveCatalogCount() {
  const stats = await getCollectionStats();
  return <>{`${stats.activeProducts} scents`}</>;
}

async function FeaturedGrid() {
  const featured = await getFeaturedProducts(4);
  return (
    <FadeIn>
      <ProductGrid products={featured} />
    </FadeIn>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-16">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Editorial Hero: Split-Screen Layout */}
      <section className="grid overflow-hidden border border-border lg:grid-cols-2 min-h-125">

        {/* Left Side: Photographic or Design Visual */}
        <div className="relative aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r">
          <Suspense fallback={<HeroVisualSkeleton />}>
            <HeroVisual />
          </Suspense>
        </div>

        {/* Right Side: Editorial Information — static, paints first */}
        <div className="flex flex-col justify-between bg-background-warm p-6 sm:p-10 lg:p-14 gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-border px-3 py-1 text-[10px] label-caps text-muted bg-background">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              Chittagong · COD · verified
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-foreground">
                Perfume decants, presented with a <span className="italic">quieter</span> kind of luxury.
              </h1>
              <p className="max-w-md text-xs leading-relaxed text-muted font-sans">
                Browse our curated catalog of authentic fragrances. Order preset vial sizes or specify a custom millilitre amount priced directly from the full bottle. We verify every request by phone or WhatsApp before dispatching.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 border border-border bg-background">
            <div className="p-4 text-left border-border border-b border-r">
              <p className="label-caps text-[9px] text-muted">Active catalog</p>
              <p className="mt-1 text-sm font-medium font-display text-foreground">
                <Suspense fallback={<span className="inline-block h-4 w-12 bg-border/60 animate-pulse" />}>
                  <ActiveCatalogCount />
                </Suspense>
              </p>
            </div>
            <div className="p-4 text-left border-border border-b">
              <p className="label-caps text-[9px] text-muted">Preset sizes</p>
              <p className="mt-1 text-sm font-medium font-display text-foreground">5 / 10 / 15ml</p>
            </div>
            <div className="p-4 text-left border-border border-r">
              <p className="label-caps text-[9px] text-muted">Custom milliletre</p>
              <p className="mt-1 text-sm font-medium font-display text-foreground">Available</p>
            </div>
            <div className="p-4 text-left border-border">
              <p className="label-caps text-[9px] text-muted">Fulfillment</p>
              <p className="mt-1 text-sm font-medium font-display text-foreground">Manual COD</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ShopAllLink />
            <Link
              href="/about"
              className={buttonVariants({ variant: "outline" })}
            >
              Shipping & Authenticity
            </Link>
          </div>
        </div>

      </section>

      {/* Featured Grid Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="label-caps text-xs text-muted">A Curated Edit</p>
            <h2 className="mt-1 font-display text-3xl font-light text-foreground">
              Featured Fragrances
            </h2>
          </div>
          <Link
            href="/products"
            className="label-caps text-xs text-muted hover:text-foreground transition-colors editorial-link"
          >
            Catalog →
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedGrid />
        </Suspense>
      </section>

    </div>
  );
}