import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { faqs } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ — Ordering, Delivery & Authenticity",
  description:
    "Answers to common questions about Cologne Noir: cash on delivery, delivery times within Bangladesh, decants vs full bottles, authenticity, minimum order size, damaged orders, and how to place an order.",
  alternates: {
    canonical: "https://colognenoir.com/faq",
  },
  openGraph: {
    title: "FAQ — Ordering, Delivery & Authenticity",
    description:
      "COD availability, delivery times, authenticity, and how to order from Cologne Noir.",
    url: "https://colognenoir.com/faq",
    siteName: "Cologne Noir",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — Ordering, Delivery & Authenticity",
    description:
      "COD availability, delivery times, authenticity, and how to order from Cologne Noir.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        {/* Editorial Intro — sticky on desktop */}
        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <p className="label-caps text-xs text-muted">Common Questions</p>
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-light leading-[1.05] tracking-tight text-foreground">
            Answered plainly, like a note on <span className="italic">a receipt.</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted font-sans pt-2">
            COD fees, delivery windows, and how we verify authenticity — the
            details we&apos;re most often asked about, in one place.
          </p>
        </div>

        {/* Stacked Q&A — hairline rules, print-ledger feel */}
        <div className="border-t border-border">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="grid gap-4 border-b border-border py-6 sm:py-8 sm:grid-cols-[3rem_1fr] sm:gap-8"
            >
              <span className="label-caps text-[0.65rem] text-muted pt-1 select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-light text-foreground sm:text-2xl">
                  {faq.question}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted font-sans">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still unsure — direct to a person */}
      <div className="mt-14 flex flex-col items-start justify-between gap-6 border border-border bg-background-warm p-6 sm:flex-row sm:items-center sm:p-10">
        <div className="space-y-2">
          <p className="label-caps text-xs text-muted">Still have a question?</p>
          <p className="font-display text-xl font-light text-foreground">
            Message us directly — a real person answers.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://wa.me/8801319060664"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "primary" })}
          >
            WhatsApp Us
          </a>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}