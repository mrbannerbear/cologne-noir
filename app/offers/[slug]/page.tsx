import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FadeIn } from "@/components/fade-in";
import { OfferCollage } from "@/components/offer-collage";
import { OfferOrder } from "@/components/offer-order";
import { ProductGrid } from "@/components/product-grid";
import { formatBdt } from "@/lib/format";
import { getActiveOffers, getActiveOfferViewBySlug } from "@/lib/offers";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type OfferPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getActiveOfferViewBySlug(slug);

  if (!offer) {
    return { title: "Offer Not Found" };
  }

  const coverImage = offer.products[0]?.images[0];
  const description =
    offer.description ??
    offer.tagline ??
    `${offer.name} — a curated ${offer.items.length}-decant bundle.`;

  return {
    title: `${offer.name} — ${offer.eventName}`,
    description,
    alternates: {
      canonical: `https://colognenoir.com/offers/${offer.slug}`,
    },
    openGraph: {
      title: `${offer.name} — ${offer.eventName}`,
      description,
      url: `https://colognenoir.com/offers/${offer.slug}`,
      images: coverImage
        ? [{ url: coverImage, width: 1200, height: 1500, alt: offer.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${offer.name} — ${offer.eventName}`,
      description,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;

  return (
    <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs label-caps text-muted hover:text-foreground transition-colors editorial-link"
        >
          <span aria-hidden="true">←</span>
          Back to catalog
        </Link>
      </div>

      <Suspense fallback={<OfferDetailSkeleton />}>
        <OfferDetail slug={slug} />
      </Suspense>
    </div>
  );
}

function OfferDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <section className="grid overflow-hidden border border-border lg:grid-cols-2 min-h-125">
        <div className="aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r overflow-hidden">
          <div className="flex h-full items-center justify-center p-8">
            <div className="flex items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-44 w-32 sm:h-56 sm:w-40 lg:h-64 lg:w-48 bg-background border border-border p-2",
                    i > 0 && "-ml-4 sm:-ml-10",
                  )}
                >
                  <div className="aspect-square bg-border/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col justify-between gap-8 bg-background-warm p-6 sm:p-10 lg:p-14">
          <div className="space-y-5">
            <div className="h-6 w-40 bg-border/60" />
            <div className="h-10 w-3/4 bg-border/60" />
            <div className="h-3 w-full max-w-md bg-border/60" />
            <div className="h-3 w-2/3 max-w-sm bg-border/60" />
          </div>
          <div className="h-11 w-full max-w-48 bg-border/60" />
        </div>
      </section>
    </div>
  );
}

async function OfferDetail({ slug }: { slug: string }) {
  const offer = await getActiveOfferViewBySlug(slug);

  if (!offer) {
    notFound();
  }

  const moreOffers = (await getActiveOffers()).filter(
    (other) => other.slug !== offer.slug,
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://colognenoir.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catalog",
        item: "https://colognenoir.com/products",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: offer.name,
        item: `https://colognenoir.com/offers/${offer.slug}`,
      },
    ],
  };

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Split-Screen Offer Frame */}
      <FadeIn>
        <section className="grid overflow-hidden border border-border lg:grid-cols-2">
          <div className="relative aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-2.5 sm:p-8">
              <div className="flex items-center">
                <OfferCollage items={offer.items} />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-between bg-background-warm p-6 sm:p-10 lg:p-14 gap-8">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 border border-border px-3 py-1 text-[10px] label-caps text-muted bg-background w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
                {offer.eventName}
              </p>

              <div className="space-y-2">
                {offer.occasion ? (
                  <p className="label-caps text-[10px] text-muted">{offer.occasion}</p>
                ) : null}
                <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-foreground">
                  {offer.name}
                </h1>
                <p className="font-display text-sm italic text-muted">{offer.tagline}</p>
              </div>

              {offer.description ? (
                <p className="max-w-md text-sm leading-relaxed text-muted font-sans pt-1">
                  {offer.description}
                </p>
              ) : null}

              <div className="border-t border-border pt-4">
                <p className="label-caps text-[10px] text-muted mb-3">Includes</p>
                <ul className="space-y-2">
                  {offer.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm text-foreground hover:text-muted transition-colors"
                      >
                        {item.brand} {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <OfferOrder offer={offer} />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Inside the Bundle */}
      {offer.products.length ? (
        <FadeIn delay={0.1}>
          <section className="space-y-6 pt-4">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div>
                <p className="label-caps text-xs text-muted">Inside the bundle</p>
                <h2 className="mt-1 font-display text-3xl font-light text-foreground">
                  The decants
                </h2>
              </div>
              <Link
                href="/products"
                className="label-caps text-xs text-muted hover:text-foreground transition-colors editorial-link"
              >
                Full catalog →
              </Link>
            </div>
            <ProductGrid products={offer.products} />
          </section>
        </FadeIn>
      ) : null}

      {/* Event Blurb */}
      {offer.eventDescription ? (
        <FadeIn delay={0.15}>
          <section className="border border-border bg-surface-paper p-6 sm:p-10 space-y-4">
            <p className="label-caps text-xs text-muted">About this collection</p>
            <p className="max-w-2xl font-display text-2xl font-light leading-relaxed text-foreground">
              {offer.eventDescription}
            </p>
          </section>
        </FadeIn>
      ) : null}

      {/* More Offers */}
      {moreOffers.length ? (
        <FadeIn delay={0.2}>
          <section className="space-y-6 pt-4">
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div>
                <p className="label-caps text-xs text-muted">More offers</p>
                <h2 className="mt-1 font-display text-3xl font-light text-foreground">
                  {offer.eventName}
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreOffers.map((other) => (
                <Link
                  key={other.id}
                  href={`/offers/${other.slug}`}
                  className="border border-border bg-background-warm p-6 hover:border-foreground transition-all duration-300 space-y-3"
                >
                  <div className="space-y-1">
                    <p className="label-caps text-[9px] text-muted">{other.eventName}</p>
                    <h3 className="font-display text-xl font-light text-foreground">
                      {other.name}
                    </h3>
                    <p className="font-display text-sm italic text-muted">{other.tagline}</p>
                  </div>
                  <p className="font-mono text-xs text-muted">
                    {formatBdt(other.price5mlBdt)} · {formatBdt(other.price10mlBdt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </FadeIn>
      ) : null}
    </section>
  );
}