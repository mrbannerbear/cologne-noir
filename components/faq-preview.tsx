"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { FaqItem } from "@/lib/faq";

const pressuredEasing: [number, number, number, number] = [0.4, 0, 0.6, 1];

type FAQPreviewProps = {
  items: FaqItem[];
};

export function FAQPreview({ items }: FAQPreviewProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="border-t border-border">
      {items.map((faq, index) => (
        <motion.div
          key={faq.question}
          className="grid gap-4 border-b border-border py-6 sm:grid-cols-[3rem_1fr] sm:gap-8"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
          }
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.7,
            ease: pressuredEasing,
            delay: prefersReducedMotion ? 0 : index * 0.08,
          }}
        >
          <span className="label-caps text-[0.65rem] text-muted pt-1 select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-light text-foreground">
              {faq.question}
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-muted font-sans">
              {faq.answer}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}