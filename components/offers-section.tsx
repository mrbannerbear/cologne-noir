import Image from "next/image";
import Link from "next/link";
import { getActiveOffers } from "@/lib/offers";
import { formatBdt } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

export async function OffersSection() {
  const offers = await getActiveOffers();

  if (offers.length === 0) {
    return null;
  }

  const eventName = offers[0]!.eventName;

  return (
    <section className="mt-10 space-y-6">
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div>
          <p className="label-caps text-xs text-muted">Offers</p>
          <h2 className="mt-1 font-display text-3xl font-light text-foreground">
            {eventName}
          </h2>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className="border border-border bg-background-warm p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                {offer.occasion ? (
                  <p className="label-caps text-[10px] text-muted">{offer.occasion}</p>
                ) : null}
                <h3 className="font-display text-xl sm:text-2xl font-light text-foreground leading-tight">
                  {offer.name}
                </h3>
                <p className="label-caps text-[10px] text-muted">{offer.tagline}</p>
              </div>
              <div className="sm:text-right">
                <p className="label-caps text-[9px] text-muted">Now 5% off</p>
                <p className="font-mono text-sm text-foreground">{formatBdt(offer.price5mlBdt)}</p>
                <p className="font-mono text-xs text-muted">5ml set</p>
                <p className="font-mono text-sm text-foreground pt-1">{formatBdt(offer.price10mlBdt)}</p>
                <p className="font-mono text-xs text-muted">10ml set</p>
              </div>
            </div>

            {/* Included perfumes */}
            <div className="border-t border-border pt-5">
              <p className="label-caps text-[10px] text-muted mb-4">Includes</p>
              <div className="grid gap-x-4 gap-y-5" style={{ gridTemplateColumns: `repeat(${offer.items.length}, minmax(0, 1fr))` }}>
                {offer.items.map((item) => {
                  const image = item.images[0];
                  return (
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      className="group space-y-2"
                    >
                      <div className="relative aspect-square overflow-hidden border border-border bg-background">
                        {image ? (
                          <Image
                            src={image}
                            alt={`${item.brand} ${item.name}`}
                            fill
                            sizes="(max-width: 768px) 40vw, 20vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-background-warm p-2">
                            <span className="text-center font-display text-[9px] font-light text-muted">
                              {item.brand}
                              <br />
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="label-caps text-[8px] text-muted group-hover:text-foreground transition-colors">
                          {item.brand}
                        </p>
                        <p className="text-[11px] font-medium text-foreground leading-tight">
                          {item.name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <Link
                href={`/offers/${offer.slug}`}
                className={buttonVariants({ variant: "primary", className: "min-w-40" })}
              >
                View Bundle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OffersSectionSkeleton() {
  return (
    <div className="mt-10 space-y-6" aria-hidden="true">
      <div className="h-12 w-full max-w-sm bg-border/60" />
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="border border-border bg-background-warm p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="h-2 w-16 bg-border/60" />
              <div className="h-6 w-2/3 bg-border/60" />
              <div className="h-2 w-32 bg-border/60" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square bg-border/60" />
              ))}
            </div>
            <div className="h-10 w-full bg-border/60" />
          </div>
        ))}
      </div>
    </div>
  );
}