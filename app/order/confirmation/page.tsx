import Link from "next/link";
type OrderConfirmationProps = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationProps) {
  const { orderNumber } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <section className="glass w-full rounded-[1.5rem] p-6 text-center sm:p-10">
        <span className="mx-auto inline-block h-3 w-3 rounded-full bg-foreground/70" />
        <p className="mt-5 label-caps text-muted">Order received</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.05em] text-foreground">
          Thanks. We&apos;ll reach out shortly to confirm your order.
        </h1>
        {orderNumber ? (
          <p className="mt-4 label-caps text-muted">{orderNumber}</p>
        ) : null}
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          A real person from Cologne Noir will message or call you within a few hours to verify
          availability, address, and delivery timing. Nothing ships until you confirm.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="glass inline-flex items-center justify-center rounded-[1.25rem] px-5 py-3 text-sm font-medium text-foreground hover:glass-hover"
          >
            Keep browsing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-medium text-muted hover:border-white/20 hover:text-foreground"
          >
            Back home
          </Link>
        </div>
      </section>
    </div>
  );
}
