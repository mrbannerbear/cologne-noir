"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatBdt } from "@/lib/format";
import { OfferOrder } from "@/components/offer-order";
import { buttonVariants } from "@/components/ui/button";
import type { OfferView } from "@/types";
import { cn } from "@/lib/utils";

type OfferHeroCarouselProps = {
  offers: OfferView[];
};

const AUTOPLAY_MS = 6000;

export function OfferHeroCarousel({ offers }: OfferHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = offers.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  const offer = offers[index]!;

  return (
    <section
      className="grid overflow-hidden border border-border lg:grid-cols-2 min-h-125"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left Side: Bundle Visual */}
      <div className="relative aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r">
        <AnimatePresence mode="wait">
          <motion.div
            key={offer.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.6, 1] }}
            className="absolute inset-0 grid grid-cols-3"
          >
            {offer.items.map((item) => {
              const image = item.images[0];
              return (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="relative overflow-hidden border-r border-border last:border-r-0"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={`${item.brand} ${item.name}`}
                      fill
                      sizes="(max-width: 1024px) 33vw, 16vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between bg-background-warm p-4">
                      <span className="label-caps text-[9px] text-muted">{item.brand}</span>
                      <span className="font-display text-sm font-light text-foreground">
                        {item.name}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Dots */}
        {count > 1 ? (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {offers.map((o, i) => (
              <button
                key={o.id}
                type="button"
                aria-label={`Show ${o.name}`}
                aria-pressed={i === index}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 w-6 border border-ink transition-colors duration-300",
                  i === index ? "bg-ink" : "bg-transparent hover:bg-ink/40",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Right Side: Editorial Information */}
      <div className="flex flex-col justify-between bg-background-warm p-6 sm:p-10 lg:p-14 gap-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border border-border px-3 py-1 text-[10px] label-caps text-muted bg-background">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
            {offer.eventName}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.6, 1] }}
              className="space-y-4"
            >
              <div className="space-y-2">
                {offer.occasion ? (
                  <p className="label-caps text-[10px] text-muted">{offer.occasion}</p>
                ) : null}
                <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-foreground">
                  {offer.name}
                </h1>
                <p className="label-caps text-xs text-muted">{offer.tagline}</p>
              </div>

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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Price + Order */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-6 border-t border-border pt-4">
            <div>
              <p className="label-caps text-[9px] text-muted">5ml set</p>
              <p className="font-mono text-lg text-foreground">{formatBdt(offer.price5mlBdt)}</p>
            </div>
            <div>
              <p className="label-caps text-[9px] text-muted">10ml set</p>
              <p className="font-mono text-lg text-foreground">{formatBdt(offer.price10mlBdt)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <OfferOrder offer={offer} />
            <Link
              href="/products"
              className={buttonVariants({ variant: "outline" })}
            >
              Browse Catalog
            </Link>
          </div>

          {/* Prev / Next */}
          {count > 1 ? (
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous offer"
                className="rounded-[2px] border border-border bg-background px-3 py-1.5 text-[10px] label-caps text-muted hover:border-foreground hover:text-foreground transition-colors duration-300"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next offer"
                className="rounded-[2px] border border-border bg-background px-3 py-1.5 text-[10px] label-caps text-muted hover:border-foreground hover:text-foreground transition-colors duration-300"
              >
                Next →
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}