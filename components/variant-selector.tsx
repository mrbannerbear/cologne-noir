"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { customDecantPrice } from "@/lib/pricing";
import { formatBdt } from "@/lib/format";
import type { ProductVariantView } from "@/types";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";

export type VariantSelection =
  | { mode: "preset"; variantId: string; label: string; unitPrice: number }
  | { mode: "custom"; customMl: number; label: string; unitPrice: number };

type VariantSelectorProps = {
  product: {
    actualBottleMl: number;
    actualBottleFullPriceBdt: number;
    variants: ProductVariantView[];
  };
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
};

export function VariantSelector({ product, selection, onChange }: VariantSelectorProps) {
  const [customOpen, setCustomOpen] = useState(selection.mode === "custom");
  const [customMl, setCustomMl] = useState(selection.mode === "custom" ? String(selection.customMl) : "20");

  const customPrice = useMemo(
    () => customDecantPrice(product, Number(customMl || 0)),
    [product, customMl],
  );

  function selectPreset(variant: ProductVariantView) {
    setCustomOpen(false);
    onChange({
      mode: "preset",
      variantId: variant.id,
      label: variant.label,
      unitPrice: variant.priceBdt,
    });
  }

  function selectCustom() {
    setCustomOpen(true);
    const ml = Number(customMl || 0);
    onChange({
      mode: "custom",
      customMl: ml,
      label: `${ml}ml Custom Decant`,
      unitPrice: customDecantPrice(product, ml),
    });
  }

  function updateCustomMl(value: string) {
    setCustomMl(value);
    const ml = Number(value || 0);
    if (ml > 0) {
      onChange({
        mode: "custom",
        customMl: ml,
        label: `${ml}ml Custom Decant`,
        unitPrice: customDecantPrice(product, ml),
      });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {product.variants.map((variant) => {
          const selected = selection.mode === "preset" && selection.variantId === variant.id;
          const soldOut = variant.stockQty <= 0;

          return (
            <GlassPill
              key={variant.id}
              selected={selected}
              disabled={soldOut}
              onClick={() => selectPreset(variant)}
              className={cn("h-auto rounded-[1rem] px-4 py-3 text-left normal-case tracking-normal")}
            >
              <span className="block text-sm font-medium">{variant.label}</span>
              <span className="mt-0.5 block text-xs text-muted">
                {soldOut ? "Sold out" : `${formatBdt(variant.priceBdt)} · ${variant.stockQty} left`}
              </span>
            </GlassPill>
          );
        })}
        <GlassPill
          selected={selection.mode === "custom"}
          onClick={selectCustom}
          className="h-auto rounded-[1rem] px-4 py-3 text-left normal-case tracking-normal"
        >
          <span className="block text-sm font-medium">Custom amount</span>
          <span className="mt-0.5 block text-xs text-muted">Made to order</span>
        </GlassPill>
      </div>

      <AnimatePresence initial={false}>
        {customOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="overflow-hidden"
          >
            <label className="block rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <span className="label-caps text-muted">Custom ml</span>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={customMl}
                  onChange={(event) => updateCustomMl(event.target.value)}
                  className="w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                />
                <p className="shrink-0 text-sm text-foreground">{formatBdt(customPrice)}</p>
              </div>
            </label>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
