import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProducts, getProductBySlug } from "@/lib/catalog";
import { formatBdt } from "@/lib/format";
import { OrderForm } from "@/components/order-form";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const pricePreview = product.variants[0]?.priceBdt ?? product.priceFloor;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-black/62 hover:text-black">
        <span aria-hidden="true">&lt;-</span>
        Back to catalog
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <section className="glass overflow-hidden rounded-[2rem] p-4 sm:p-5">
          <div className="aspect-[4/5] rounded-[1.5rem] border border-black/8 bg-[radial-gradient(circle_at_top,rgba(17,17,17,0.04),transparent_38%),linear-gradient(160deg,rgba(255,255,255,0.94),rgba(255,255,255,0.7))] p-5">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-black/70">
                  {product.gender}
                </span>
                <span className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-black/60">
                  {product.actualBottleMl}ml bottle
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-black/42">{product.brand}</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-black/62 sm:text-base">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Top", items: product.topNotes },
              { label: "Middle", items: product.middleNotes },
              { label: "Base", items: product.baseNotes },
            ].map((section) => (
              <article key={section.label} className="rounded-[1.4rem] border border-black/8 bg-white/75 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-black/42">{section.label}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {section.items.map((note) => (
                    <span
                      key={note}
                      className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs text-black/70"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="glass rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-black/42">Price preview</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-black">{formatBdt(pricePreview)}</p>
              </div>
              <div className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/65">
                Live later
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {product.variants.map((variant) => (
                <div
                  key={variant.size}
                  className="flex items-center justify-between rounded-[1.25rem] border border-black/8 bg-white/75 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-black">{variant.label}</p>
                    <p className="text-xs text-black/45">
                      Stock {variant.stockQty > 0 ? `${variant.stockQty} available` : "Sold out"}
                    </p>
                  </div>
                  <p className="text-sm text-black/72">{formatBdt(variant.priceBdt)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-black/8 bg-white/85 p-4">
              <div className="flex items-center gap-2 text-sm text-black/70">
                <span className="h-2 w-2 rounded-full bg-black/60" />
                Custom decants will be priced server-side from the bottle size and bottle price.
              </div>
            </div>
          </section>

          <OrderForm
            product={{
              id: product.slug,
              brand: product.brand,
              name: product.name,
              actualBottleMl: product.actualBottleMl,
              actualBottleFullPriceBdt: product.actualBottleFullPriceBdt,
              variants: product.variants.map((variant) => ({
                id: `${product.slug}:${variant.size}`,
                size: variant.size,
                label: variant.label,
                priceBdt: variant.priceBdt,
                stockQty: variant.stockQty,
              })),
            }}
          />
        </aside>
      </div>

      <section className="mt-8 rounded-[2rem] border border-black/8 bg-white/75 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-black/42">More to explore</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {featuredProducts
            .filter((item) => item.slug !== slug)
            .slice(0, 2)
            .map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="rounded-[1.35rem] border border-black/8 bg-white/85 p-4 transition hover:border-black/15 hover:bg-white"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-black/42">{item.brand}</p>
                <p className="mt-2 text-lg font-medium text-black">{item.name}</p>
                <p className="mt-1 text-sm text-black/58">From {formatBdt(item.priceFloor)}</p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}