import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <section className="glass w-full rounded-[2rem] p-6 text-center sm:p-10">
        <span className="mx-auto inline-block h-3 w-3 rounded-full bg-black/60" />
        <p className="mt-5 text-xs uppercase tracking-[0.3em] text-black/42">Order received</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">
          Thanks. We’ll reach out shortly to confirm the order.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/62 sm:text-lg">
          The next step is a human check-in over WhatsApp or phone. That keeps the process clear, accurate, and aligned
          with how Cologne Noir already fulfills orders.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white/85 px-6 py-3 text-sm font-medium text-black glass"
          >
            Keep browsing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-black/8 px-6 py-3 text-sm font-medium text-black/72 hover:border-black/15 hover:bg-black/[0.03]"
          >
            Back home
          </Link>
        </div>
      </section>
    </div>
  );
}