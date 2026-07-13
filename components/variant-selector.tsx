"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, ChangeEvent } from "react";
import { customDecantPrice } from "@/lib/pricing";
import { formatBdt } from "@/lib/format";
import type { ProductVariantView } from "@/types";
import { cn } from "@/lib/utils";

export type VariantSelection =
  | { mode: "preset"; variantId: string; label: string; unitPrice: number }
  | { mode: "custom"; customMl: number; label: string; unitPrice: number };

type VariantSelectorProps = {
  product: {
    actualBottleMl: number;
    variants: ProductVariantView[];
  };
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
};

export function VariantSelector({ product, selection, onChange }: VariantSelectorProps) {
  const [customOpen, setCustomOpen] = useState(selection.mode === "custom");
  const [customMl, setCustomMl] = useState(selection.mode === "custom" ? String(selection.customMl) : "20");

  const fullBottlePrice = useMemo(
    () => product.variants.find((v) => v.size === "FULL_BOTTLE")?.priceBdt ?? 0,
    [product.variants],
  );

  const customPrice = useMemo(
    () => customDecantPrice(fullBottlePrice, product.actualBottleMl, Number(customMl || 0)),
    [fullBottlePrice, product.actualBottleMl, customMl],
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
      unitPrice: customDecantPrice(fullBottlePrice, product.actualBottleMl, ml),
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
        unitPrice: customDecantPrice(fullBottlePrice, product.actualBottleMl, ml),
      });
    }
  }

  return (
    <div className="space-y-4 text-foreground">
      <p className="label-caps text-[10px] text-muted">Select Volume</p>
      
      {/* Rectangular Variant Selection Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {product.variants.map((variant) => {
          const isSelected = selection.mode === "preset" && selection.variantId === variant.id;
          const soldOut = variant.stockQty <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={soldOut}
              onClick={() => selectPreset(variant)}
              className={cn(
                "rounded-[2px] border p-3 text-left transition-all duration-300",
                isSelected
                  ? "border-ink bg-ink text-white font-medium"
                  : "border-border bg-transparent text-foreground hover:border-foreground",
                soldOut && "cursor-not-allowed border-border bg-transparent text-muted/65 line-through opacity-50"
              )}
            >
              <span className="block text-xs label-caps tracking-wider">{variant.label}</span>
              <span className={cn(
                "mt-1 block text-xs font-mono",
                isSelected ? "text-white/80" : "text-muted"
              )}>
                {soldOut ? "Sold out" : `${formatBdt(variant.priceBdt)}`}
              </span>
            </button>
          );
        })}
        
        <button
          type="button"
          onClick={selectCustom}
          className={cn(
            "rounded-[2px] border p-3 text-left transition-all duration-300",
            selection.mode === "custom"
              ? "border-ink bg-ink text-white font-medium"
              : "border-border bg-transparent text-foreground hover:border-foreground"
          )}
        >
          <span className="block text-xs label-caps tracking-wider">Custom Size</span>
          <span className={cn(
            "mt-1 block text-xs font-mono",
            selection.mode === "custom" ? "text-white/80" : "text-muted"
          )}>
            Made to order
          </span>
        </button>
      </div>

      {/* Underline-style input section */}
      <AnimatePresence initial={false}>
        {customOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/80 pt-4 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <span className="label-caps text-[9px] text-muted">millilitre quantity (ml)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={customMl}
                       onChange={(event: ChangeEvent<HTMLInputElement>) => updateCustomMl(event.target.value)}
                      className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>
                <div className="shrink-0 pb-2 text-right">
                  <p className="label-caps text-[9px] text-muted">derived price</p>
                  <p className="font-mono text-sm text-foreground font-semibold mt-1">
                    {formatBdt(customPrice)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
