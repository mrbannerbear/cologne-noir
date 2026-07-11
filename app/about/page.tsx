"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  } as const;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      <motion.div {...fadeUp} className="space-y-12">
        
        {/* Editorial Heading */}
        <section className="text-left space-y-4">
          <p className="label-caps text-xs text-muted">A Note on Sourcing</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.05] tracking-tight text-foreground">
            Built on trust, fast confirmation, and <span className="italic">clean</span> presentation.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted font-sans pt-2">
            Cologne Noir is an Instagram-first perfume business based in Chittagong. This storefront replaces back-and-forth messaging with a clear catalog — but fulfillment stays personal. Every order is verified by phone or WhatsApp before anything ships.
          </p>
        </section>

        {/* Postcard Panel - Storytelling section with vertical hairline divider */}
        <section className="border border-border bg-background-warm p-6 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            
            {/* Left Column */}
            <div className="space-y-6">
              <span className="inline-block h-2 w-2 bg-foreground/60" />
              <h2 className="font-display text-2xl font-light text-foreground">
                Authenticity Above All
              </h2>
              <p className="text-xs leading-relaxed text-muted font-sans">
                Authenticity is non-negotiable in decanting. We source our bottles exclusively from authorized retailers and trusted distributors. Every variant page displays the original bottle economics so you know the direct pricing logic behind each custom volume.
              </p>
              <div className="h-px bg-border/60" />
              <div className="space-y-2 text-xs font-mono text-muted">
                <p>· Sourced from verified houses only</p>
                <p>· Decanted using precision glass syringes</p>
                <p>· Sealed in high-grade glass atomizers</p>
              </div>
            </div>

            {/* Right Column (Divided by a vertical hairline rule on desktop) */}
            <div className="space-y-6 border-t border-border/80 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <span className="inline-block h-2 w-2 bg-foreground/60" />
              <h2 className="font-display text-2xl font-light text-foreground">
                Fulfillment Logistics
              </h2>
              <p className="text-xs leading-relaxed text-muted font-sans">
                We ship nationwide across Bangladesh from Chittagong. Once you request an order, we will reach out manually via phone or WhatsApp to verify details. 
              </p>
              <div className="space-y-3 pt-2">
                <h3 className="label-caps text-[10px] text-foreground font-semibold">Expected Timelines</h3>
                <div className="grid grid-cols-2 gap-4 border border-border/80 bg-background p-4 text-[11px]">
                  <div>
                    <p className="label-caps text-[8px] text-muted">Chittagong</p>
                    <p className="font-display font-medium text-foreground mt-0.5">1 – 2 Days</p>
                  </div>
                  <div>
                    <p className="label-caps text-[8px] text-muted">Other Cities</p>
                    <p className="font-display font-medium text-foreground mt-0.5">2 – 5 Days</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Polaroid/Collage Stack Storytelling Moment (Unique Design) */}
        <section className="bg-surface-paper border border-border p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="space-y-6 max-w-md">
            <span className="label-caps text-xs text-muted font-mono">The Collage / 01</span>
            <h2 className="font-display text-3xl font-light leading-tight">
              A zine approach to modern scent buying.
            </h2>
            <ol className="space-y-4 text-xs text-muted font-mono leading-relaxed">
              <li className="flex gap-3">
                <span className="text-foreground font-bold">01.</span>
                <span>Select a bottle preset or specify a custom millilitre decant.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground font-bold">02.</span>
                <span>Fill out your shipping information — no login or pre-payment required.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-foreground font-bold">03.</span>
                <span>We verify the order via WhatsApp, package the decant, and ship via COD.</span>
              </li>
            </ol>
          </div>

          {/* Rotated Polaroids stack with white border and shadow */}
          <div className="relative w-64 h-72 flex items-center justify-center select-none">
            
            {/* Postcard background */}
            <div className="absolute w-44 h-56 bg-background border border-border p-3 shadow-md -rotate-6 transition-transform hover:rotate-0 duration-300">
              <div className="w-full h-4/5 bg-surface-paper border border-border/60 flex items-center justify-center">
                <span className="font-display text-xs italic text-muted">Afnan decant</span>
              </div>
              <p className="font-mono text-[9px] text-muted text-center mt-2.5">Rare Reef — 10ml</p>
            </div>

            {/* Postcard foreground */}
            <div className="absolute w-44 h-56 bg-background border border-border p-3 shadow-lg rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="w-full h-4/5 bg-background-warm border border-border/60 flex items-center justify-center">
                <span className="font-display text-xs italic text-muted">Lattafa decant</span>
              </div>
              <p className="font-mono text-[9px] text-muted text-center mt-2.5">Khamrah — 15ml</p>
            </div>

          </div>

        </section>

        {/* Action Buttons */}
        <section className="flex flex-col gap-3 sm:flex-row pt-4 justify-start">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-3 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300"
          >
            Browse Products
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-border px-6 py-3 text-xs label-caps text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
          >
            Back to Home
          </Link>
        </section>

      </motion.div>
    </div>
  );
}
