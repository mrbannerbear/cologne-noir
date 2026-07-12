import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { ShopAllLink } from "@/components/catalog-filters";
import { formatBdt } from "@/lib/format";
import { getCollectionStats, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, stats] = await Promise.all([
    getFeaturedProducts(4),
    getCollectionStats(),
  ]);
  const heroProduct = featuredProducts[0];
  const coverImage = heroProduct?.images[0];

  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      
      {/* Editorial Hero: Split-Screen Layout */}
      <section className="grid overflow-hidden border border-border lg:grid-cols-2 min-h-[500px]">
        
        {/* Left Side: Photographic or Design Visual */}
        <div className="relative aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={`${heroProduct.brand} ${heroProduct.name}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-8 bg-background-warm">
              <span className="label-caps text-xs text-muted">Fragrances</span>
              <div className="space-y-4">
                <p className="font-display text-7xl italic leading-none tracking-tight select-none">
                  Cologne
                </p>
                <p className="font-display text-7xl font-light leading-none tracking-wider select-none text-muted pl-12">
                  Noir
                </p>
              </div>
              <span className="label-caps text-[0.65rem] text-muted">Est. 2024</span>
            </div>
          )}
          {heroProduct && coverImage ? (
            <div className="absolute bottom-6 left-6 right-6 bg-background/90 p-4 border border-border">
              <span className="label-caps text-[10px] text-muted">Featured Bottle</span>
              <h3 className="font-display text-xl mt-1 text-foreground">
                {heroProduct.brand}
              </h3>
              <p className="font-display text-sm italic text-muted mt-0.5">
                {heroProduct.name}
              </p>
            </div>
          ) : null}
        </div>

        {/* Right Side: Editorial Information */}
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

          {/* Stats Grid with hairline rules */}
          <div className="grid grid-cols-2 border border-border bg-background">
            {[
              { label: "Active catalog", value: `${stats.activeProducts} scents` },
              { label: "Preset sizes", value: "5 / 10 / 15ml" },
              { label: "Custom milliletre", value: "Available" },
              { label: "Fulfillment", value: "Manual COD" },
            ].map((item, idx) => (
              <div
                key={item.label}
                className={`p-4 text-left border-border ${idx < 2 ? "border-b" : ""} ${idx % 2 === 0 ? "border-r" : ""}`}
              >
                <p className="label-caps text-[9px] text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-medium font-display text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ShopAllLink />
            <Link
              href="/about"
              className="inline-flex items-center justify-center border border-border px-6 py-3 text-xs label-caps text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
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
        <ProductGrid products={featuredProducts} />
      </section>

    </div>
  );
}
