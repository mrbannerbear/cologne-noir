import Link from "next/link";
import { featuredProducts, getCollectionStats } from "@/lib/catalog";
import { formatBdt } from "@/lib/format";

export default function Home() {
  const stats = getCollectionStats();
  const heroProduct = featuredProducts[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-black/70 glass">
            <span className="h-2 w-2 rounded-full bg-black/60" />
            Liquid glass, monochrome, phone-first
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-black sm:text-6xl lg:text-7xl">
              Perfume decants, presented with a quieter kind of luxury.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-black/64 sm:text-lg">
              Cologne Noir turns Instagram DMs into a catalog-led ordering flow. Browse the collection,
              check live stock, and place one COD order at a time while every request is confirmed by WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/8 bg-white/85 px-6 py-3 text-sm font-medium text-black glass hover:bg-white"
            >
              Browse catalog
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-black/8 bg-transparent px-6 py-3 text-sm font-medium text-black/72 hover:border-black/15 hover:bg-black/[0.03]"
            >
              Read the shipping flow
            </Link>
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,17,17,0.04),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.03),transparent_32%)]" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-black/42">Featured release</p>
                <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-black">{heroProduct.brand}</h2>
              </div>
              <div className="rounded-full border border-black/8 bg-white/85 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/65">
                {heroProduct.gender}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.26em] text-black/42">{heroProduct.name}</p>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-black">
                {formatBdt(stats.priceFloor)} - {formatBdt(stats.priceCeiling)}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Preset variants", value: `${stats.variantCount}` },
                { label: "Active products", value: `${stats.activeProducts}` },
                { label: "Custom decants", value: "Server-priced" },
                { label: "Fulfillment", value: "Manual COD" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-black/8 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/42">{item.label}</p>
                  <p className="mt-2 text-lg font-medium text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Catalog-first",
            text: "Products will load from Prisma, with preset decants and full bottles tracked separately.",
          },
          {
            title: "Server priced",
            text: "Custom milliliters are always recalculated on the server, never trusted from the client.",
          },
          {
            title: "COD only",
            text: "No payment gateway yet. Every order is confirmed manually before it leaves your hands.",
          },
          {
            title: "Liquid glass",
            text: "Monochrome, blurred surfaces set the tone while the product photography stays in control.",
          },
        ].map((item) => (
          <article key={item.title} className="glass rounded-[1.75rem] p-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/60" />
            <h3 className="mt-5 text-lg font-medium text-black">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-black/60">{item.text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
