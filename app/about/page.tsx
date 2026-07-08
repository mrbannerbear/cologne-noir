import Link from "next/link";
export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="glass rounded-[1.5rem] p-6 sm:p-8 lg:p-10">
        <p className="label-caps text-muted">About Cologne Noir</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.05em] text-foreground">
          A perfume storefront built around trust, fast confirmation, and clean presentation.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          Cologne Noir is an Instagram-first perfume business based in Chittagong. This site replaces
          back-and-forth DMs with a clear catalog — but fulfillment stays personal. Every order is
          confirmed by phone or WhatsApp before anything ships.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground/70" />
            <h2 className="mt-4 text-lg font-medium text-foreground">Authenticity first</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Every listing shows the real bottle size, preset decant prices, and the per-ml logic
              behind custom amounts — so customers know exactly what they are ordering.
            </p>
          </article>
          <article className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground/70" />
            <h2 className="mt-4 text-lg font-medium text-foreground">Bangladesh delivery</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              COD only for now. We ship across Bangladesh after confirming your address, timing, and
              availability. Typical delivery in Chittagong is 1–2 days; other cities 2–5 days.
            </p>
          </article>
          <article className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 md:col-span-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-foreground/70" />
            <h2 className="mt-4 text-lg font-medium text-foreground">How ordering works</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-muted">
              <li>1. Pick a product and choose a preset size or custom ml amount.</li>
              <li>2. Submit your name, phone, and delivery address.</li>
              <li>3. We message or call you within a few hours to confirm.</li>
              <li>4. Pay cash on delivery when your order arrives.</li>
            </ol>
          </article>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="glass inline-flex items-center justify-center rounded-[1.25rem] px-5 py-3 text-sm font-medium text-foreground hover:glass-hover"
          >
            Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-muted hover:border-white/20 hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
