"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { formatBdt } from "@/lib/format";
import { OfferCollage } from "@/components/offer-collage";
import { buttonVariants } from "@/components/ui/button";
import type { OfferView } from "@/types";
import { cn } from "@/lib/utils";

type OfferHeroCarouselProps = {
  offers: OfferView[];
};

const AUTOPLAY_MS = 6000;
const OFFER_BASE_PRICES: Record<string, { price5mlBdt: number; price10mlBdt: number }> = {
  "summer-bundle-1": { price5mlBdt: 855, price10mlBdt: 1510 },
  "summer-bundle-2": { price5mlBdt: 750, price10mlBdt: 1345 },
};

export function OfferHeroCarousel({ offers }: OfferHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const count = offers.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (prefersReducedMotion || paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, paused, prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [24, -24],
  );

  if (count === 0) return null;

  const offer = offers[index]!;
  const basePrices = OFFER_BASE_PRICES[offer.slug];

  return (
    <section
      ref={sectionRef}
      className="grid overflow-hidden border border-border lg:grid-cols-2 min-h-125"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left Side: Editorial Photo Collage */}
      <div className="relative aspect-square lg:aspect-auto bg-surface-paper border-b border-border lg:border-b-0 lg:border-r overflow-hidden">
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0 flex items-center justify-center p-2.5 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={offer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.6, 1] }}
              className="flex items-center"
            >
              <OfferCollage items={offer.items} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

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

      {/* Right Side: Minimal Editorial Information */}
      <div className="relative flex flex-col justify-between bg-background-warm p-6 sm:p-10 lg:p-14 gap-8">
        {count > 1 ? (
          <div className="absolute right-6 top-6 hidden items-center gap-1 lg:right-14 lg:top-14 lg:flex">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous offer"
              className="label-caps h-8 w-8 text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next offer"
              className="label-caps h-8 w-8 text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              →
            </button>
          </div>
        ) : null}

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
              className="space-y-5"
            >
              <div className="space-y-2">
                {offer.occasion ? (
                  <p className="label-caps text-[10px] text-muted">{offer.occasion}</p>
                ) : null}
                <h1 className="font-display text-[clamp(1.75rem,6.4vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-foreground">
                  {offer.name}
                </h1>
                <p className="font-display text-sm italic text-muted">{offer.tagline}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="label-caps text-[10px] text-muted">
                  Bundle of {offer.items.length} · 5ml / 10ml
                </p>
                {basePrices ? (
                  <p className="mt-1 label-caps text-[9px] text-muted">
                    <span className="line-through">{formatBdt(basePrices.price5mlBdt)}</span>
                    {" · "}
                    <span className="line-through">{formatBdt(basePrices.price10mlBdt)}</span>
                  </p>
                ) : null}
                <p className="mt-2 font-mono text-sm text-foreground">
                  {formatBdt(offer.price5mlBdt)} · {formatBdt(offer.price10mlBdt)}
                </p>
                <p className="mt-1 label-caps text-[9px] text-muted">5% off current bundle pricing</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <Link
            href={`/offers/${offer.slug}`}
            className={buttonVariants({ variant: "primary", className: "w-full min-h-11 sm:w-auto" })}
          >
            View the Bundle
          </Link>
        </div>
      </div>
    </section>
  );
}