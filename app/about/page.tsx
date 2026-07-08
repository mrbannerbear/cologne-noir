import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="glass rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-black/42">About Cologne Noir</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
          A perfume storefront built around trust, fast confirmation, and clean presentation.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-black/64 sm:text-lg">
          The site is intentionally lightweight: product discovery, manual COD order intake, and WhatsApp follow-up.
          That keeps the experience aligned with how decants are actually sold today while removing the DM chaos.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border border-black/8 bg-white/75 p-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/60" />
            <h2 className="mt-4 text-lg font-medium text-black">Authenticity first</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Each product listing is meant to show bottle size, decant sizes, and price logic clearly so customers know
              exactly what they are ordering.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-black/8 bg-white/75 p-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-black/60" />
            <h2 className="mt-4 text-lg font-medium text-black">Bangladesh delivery</h2>
            <p className="mt-2 text-sm leading-6 text-black/60">
              Orders are confirmed manually before shipment so you can verify address, timing, and availability before
              anything leaves the shelf.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white/85 px-6 py-3 text-sm font-medium text-black glass"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-black/8 px-6 py-3 text-sm font-medium text-black/72 hover:border-black/15 hover:bg-black/[0.03]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}