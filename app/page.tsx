import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { ShopAllLink } from "@/components/catalog-filters";
import { formatBdt } from "@/lib/format";
import { getCollectionStats, getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, stats] = await Promise.all([getFeaturedProducts(4), getCollectionStats()]);
  const heroProduct = featuredProducts[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 label-caps text-muted">
            <span className="h-2 w-2 rounded-full bg-foreground/70" />
            Chittagong · COD · WhatsApp confirmed
          </div>
          <div className="space-y-5">
            <h1
              className="max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-foreground"
            >
              Perfume decants, presented with a quieter kind of luxury.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Browse the Cologne Noir catalog, pick a size, and place a COD order. Every request is
              confirmed personally before it ships anywhere in Bangladesh.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ShopAllLink />
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-muted hover:border-white/20 hover:text-foreground"
            >
              Shipping & authenticity
            </Link>
          </div>
        </div>

        {heroProduct ? (
          <div className="glass relative overflow-hidden rounded-[1.5rem] p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="label-caps text-muted">Featured</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">{heroProduct.brand}</h2>
                </div>
                <span className="glass rounded-full px-3 py-1 label-caps text-foreground">
                  {heroProduct.gender}
                </span>
              </div>
              <div className="space-y-2">
                <p className="label-caps text-muted">{heroProduct.name}</p>
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {formatBdt(heroProduct.priceFloor)}
                  {heroProduct.priceCeiling > heroProduct.priceFloor
                    ? ` – ${formatBdt(heroProduct.priceCeiling)}`
                    : ""}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Active products", value: `${stats.activeProducts}` },
                  { label: "Preset variants", value: `${stats.variantCount}` },
                  { label: "Custom decants", value: "Server-priced" },
                  { label: "Fulfillment", value: "Manual COD" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="label-caps text-muted">{item.label}</p>
                    <p className="mt-2 text-lg font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label-caps text-muted">Catalog</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Featured fragrances</h2>
          </div>
          <ShopAllLink />
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
