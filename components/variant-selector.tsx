"use client";

import { formatBdt } from "@/lib/format";
import type { ProductVariantView } from "@/types";
import { cn } from "@/lib/utils";
import type { VariantSelection } from "@/types";

type VariantSelectorProps = {
  product: {
    variants: ProductVariantView[];
  };
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
};

export function VariantSelector({ product, selection, onChange }: VariantSelectorProps) {
  return (
    <div className="space-y-4 text-foreground">
      <p className="label-caps text-[10px] text-muted">Select Volume</p>

      {/* Rectangular Variant Selection Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {product.variants.map((variant) => {
          const isSelected = selection.variantId === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() =>
                onChange({
                  variantId: variant.id,
                  label: variant.label,
                  unitPrice: variant.priceBdt,
                })
              }
              className={cn(
                "rounded-[2px] border p-3 text-left transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                isSelected
                  ? "border-ink bg-ink text-white font-medium"
                  : "border-border bg-transparent text-foreground hover:border-foreground"
              )}
            >
              <span className="block text-xs label-caps tracking-wider">{variant.label}</span>
              <span className={cn(
                "mt-1 block text-xs font-mono",
                isSelected ? "text-white/80" : "text-muted"
              )}>
                {formatBdt(variant.priceBdt)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}