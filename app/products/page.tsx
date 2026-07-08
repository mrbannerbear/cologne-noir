import Link from "next/link";
import { featuredProducts } from "@/lib/catalog";
import { formatBdt } from "@/lib/format";

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-black/42">Catalog</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
            A compact collection, laid out for fast phone browsing.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-black/62">
            The first build slice uses curated product cards and the exact pricing model from the docs. Once Prisma is
            wired, this page will switch to live inventory without changing the layout.
          </p>
        </div>
        <div className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] text-black/65">
          <span className="h-2 w-2 rounded-full bg-black/60" />
          Men / Women / Unisex
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredProducts.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="glass group overflow-hidden rounded-[1.75rem] p-4 transition hover:-translate-y-0.5"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-black/8 bg-[radial-gradient(circle_at_top,rgba(17,17,17,0.04),transparent_45%),linear-gradient(160deg,rgba(255,255,255,0.92),rgba(255,255,255,0.68))] p-4">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-black/70">
                    {product.gender}
                  </span>
                  <span className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-black/60">
                    {product.actualBottleMl}ml
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-black/42">{product.brand}</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-black">{product.name}</h2>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-black/42">From</p>
                <p className="mt-1 text-lg font-medium text-black">{formatBdt(product.priceFloor)}</p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-black/62 group-hover:text-black">
                View details
                <span aria-hidden="true">-&gt;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}