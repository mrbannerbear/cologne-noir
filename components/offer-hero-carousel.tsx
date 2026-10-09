"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { formatBdt } from "@/lib/format";
import { OfferOrder } from "@/components/offer-order";
import type { OfferView } from "@/types";
import { cn } from "@/lib/utils";

type OfferHeroCarouselProps = {
  offers: OfferView[];
};

const AUTOPLAY_MS = 6000;

const PRINT_ROTATIONS = ["-rotate-1", "rotate-2", "rotate-1", "-rotate-2"] as const;

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
    if (paused || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

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
          className="absolute inset-0 flex items-center justify-center p-5 sm:p-8"
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
              {offer.items.length > 0 ? (
                offer.items.map((item, i) => {
                  const image = item.images[0];
                  return (
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      className={cn(
                        "relative w-40 sm:w-52 lg:w-56 shrink-0 bg-background border border-border p-2 sm:p-2.5",
                        i > 0 && "-ml-8 sm:-ml-10 lg:-ml-12",
                        PRINT_ROTATIONS[i % PRINT_ROTATIONS.length],
                      )}
                    >
                      <div className="relative aspect-square overflow-hidden bg-background-warm">
                        {image ? (
                          <Image
                            src={image}
                            alt={`${item.brand} ${item.name}`}
                            fill
                            sizes="(max-width: 1024px) 40vw, 20vw"
                            className="object-cover transition-opacity duration-300 group-hover:opacity-85"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center p-2">
                            <span className="text-center font-display text-[10px] font-light text-muted">
                              {item.brand}
                              <br />
                              {item.name}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 truncate font-display text-xs font-light text-foreground">
                        {item.brand} {item.name}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <span className="font-display text-4xl italic leading-none tracking-tight text-muted select-none">
                  Cologne Noir
                </span>
              )}
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
          <div className="absolute right-6 top-6 flex items-center gap-1 sm:right-10 sm:top-10 lg:right-14 lg:top-14">
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
                <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.02em] text-foreground">
                  {offer.name}
                </h1>
                <p className="font-display text-sm italic text-muted">{offer.tagline}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="label-caps text-[10px] text-muted">
                  Bundle of {offer.items.length} · 5ml / 10ml
                </p>
                <p className="mt-2 font-mono text-sm text-foreground">
                  {formatBdt(offer.price5mlBdt)} · {formatBdt(offer.price10mlBdt)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <OfferOrder offer={offer} showPriceLine={false} />
        </div>
      </div>
    </section>
  );
}