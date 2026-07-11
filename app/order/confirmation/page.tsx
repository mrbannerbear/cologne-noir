import Link from "next/link";

type OrderConfirmationProps = {
  searchParams: Promise<{ orderNumber?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationProps) {
  const { orderNumber } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      
      {/* Receipt Container */}
      <section className="w-full border border-border bg-background-warm p-6 sm:p-12 text-center space-y-8">
        
        <div className="space-y-4">
          <span className="mx-auto inline-block h-2.5 w-2.5 bg-foreground/60" />
          <p className="label-caps text-xs text-muted">Order Intake Successful</p>
          <h1 className="font-display text-4xl font-light text-foreground leading-tight">
            We&apos;ll verify your order shortly.
          </h1>
        </div>

        {/* Print Receipt Section */}
        {orderNumber ? (
          <div className="border border-border/80 bg-background p-6 font-mono text-xs text-left max-w-md mx-auto space-y-4">
            <div className="flex justify-between border-b border-border/50 pb-2 label-caps text-[10px] text-muted">
              <span>Receipt Details</span>
              <span>Invoice</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">Order Reference:</span>
                <span className="text-foreground font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Fulfillment:</span>
                <span className="text-foreground">Manual verification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status:</span>
                <span className="text-foreground font-semibold">Pending confirmation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payment Method:</span>
                <span className="text-foreground">Cash on Delivery (COD)</span>
              </div>
            </div>
            <div className="border-t border-border/50 pt-2 text-[10px] text-muted leading-relaxed text-center">
              Please keep your phone active. A Cologne Noir representative will contact you via SMS, Phone, or WhatsApp to confirm your shipping details.
            </div>
          </div>
        ) : null}

        <p className="mx-auto max-w-md text-xs leading-relaxed text-muted font-sans">
          Your order will not be processed or shipped until a representative has verified the request. Thank you for shopping with Cologne Noir.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-ink bg-ink text-white px-5 py-3 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300"
          >
            Keep Browsing
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-border px-5 py-3 text-xs label-caps text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
          >
            Back Home
          </Link>
        </div>

      </section>

    </div>
  );
}
