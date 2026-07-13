"use client";

import type { FormEvent, ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBdt } from "@/lib/format";
import type { ProductWithVariants } from "@/types";
import { GlassSheet } from "@/components/ui/glass-sheet";
import { VariantSelector } from "@/components/variant-selector";
import type { VariantSelection } from "@/types";
import { cn } from "@/lib/utils";

type ProductPurchaseProps = {
  product: ProductWithVariants;
};

function initialSelection(product: ProductWithVariants): VariantSelection {
  const firstAvailable = product.variants.find((variant) => variant.stockQty > 0);

  if (firstAvailable) {
    return {
      mode: "preset",
      variantId: firstAvailable.id,
      label: firstAvailable.label,
      unitPrice: firstAvailable.priceBdt,
    };
  }

  const fullBottleVariant = product.variants.find((v) => v.size === "FULL_BOTTLE");
  const fullBottlePrice = fullBottleVariant?.priceBdt ?? 0;

  return {
    mode: "custom",
    customMl: 20,
    label: "20ml Custom Decant",
    unitPrice: Math.round((fullBottlePrice / product.actualBottleMl) * 20),
  };
}

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const router = useRouter();
  const [selection, setSelection] = useState<VariantSelection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState("1");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const qty = Number(quantity || 1);
  const total = selection.unitPrice * qty;
  const presetSoldOut =
    selection.mode === "preset" &&
    product.variants.find((variant) => variant.id === selection.variantId)?.stockQty === 0;

  const canOpenSheet = selection.mode === "custom" || !presetSoldOut;

  const canSubmit = useMemo(
    () =>
      customerName.trim().length > 1 &&
      phone.trim().length > 5 &&
      address.trim().length > 9 &&
      city.trim().length > 1 &&
      qty > 0,
    [address, city, customerName, phone, qty],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productVariantId: selection.mode === "preset" ? selection.variantId : undefined,
          customMl: selection.mode === "custom" ? selection.customMl : undefined,
          quantity: qty,
          customerName,
          phone,
          address,
          city,
          notes: notes.trim() ? notes.trim() : null,
        }),
      });

      const data = (await response.json()) as { success: boolean; orderNumber?: string; message?: string };

      if (!response.ok || !data.success || !data.orderNumber) {
        setErrorMessage(data.message ?? "Unable to place order.");
        return;
      }

      router.push(`/order/confirmation?orderNumber=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      setErrorMessage("Unable to place order right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        
        {/* Live pricing display */}
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="label-caps text-[10px] text-muted">Running Total</p>
            <p className="mt-1 font-display text-3xl font-light text-foreground">{formatBdt(total)}</p>
          </div>
          <span className="label-caps text-[10px] text-muted font-mono">{selection.label}</span>
        </div>

        {/* Variant selector */}
        <div>
          <VariantSelector product={product} selection={selection} onChange={setSelection} />
        </div>

        {/* Quantity and Checkout Trigger */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end justify-between border-t border-border/80 pt-6">
          <div className="space-y-2 flex-1">
            <span className="label-caps text-[10px] text-muted">Quantity</span>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quantity}
                 onChange={(event: ChangeEvent<HTMLInputElement>) => setQuantity(event.target.value)}
                className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
              />
            </div>
          </div>
          
          <button
            type="button"
            disabled={!canOpenSheet}
            onClick={() => setSheetOpen(true)}
            className={cn(
              "inline-flex items-center justify-center border border-ink bg-ink text-white px-6 py-3 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300 font-medium rounded-[2px] min-w-[10rem] h-[40px]",
              !canOpenSheet && "opacity-55 cursor-not-allowed"
            )}
          >
            Order Now
          </button>
        </div>
        
      </div>

      <GlassSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={`${product.brand} ${product.name}`}
      >
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Order Snapshot Receipt */}
          <div className="border border-border bg-background p-4 text-xs font-mono space-y-2">
            <p className="text-foreground font-semibold">{selection.label} × {qty}</p>
            <p className="text-sm font-semibold text-foreground">{formatBdt(total)}</p>
            <p className="text-[10px] text-muted pt-1 border-t border-border/60">
              COD — we will confirm by WhatsApp before shipping.
            </p>
          </div>

          {/* Underline Style Input Form Grid */}
          <div className="space-y-4">
            
            <label className="block space-y-1">
              <span className="label-caps text-[10px] text-muted">Full name</span>
              <input
                value={customerName}
                 onChange={(event: ChangeEvent<HTMLInputElement>) => setCustomerName(event.target.value)}
                className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
                placeholder="Sayed Rahman"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="label-caps text-[10px] text-muted">Phone</span>
                <input
                  value={phone}
                   onChange={(event: ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
                  className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
                  placeholder="017XXXXXXXX"
                />
              </label>
              
              <label className="block space-y-1">
                <span className="label-caps text-[10px] text-muted">City</span>
                <input
                  value={city}
                   onChange={(event: ChangeEvent<HTMLInputElement>) => setCity(event.target.value)}
                  className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
                  placeholder="Chittagong"
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className="label-caps text-[10px] text-muted">Delivery Address</span>
              <textarea
                value={address}
                 onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setAddress(event.target.value)}
                rows={2}
                className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200 resize-none"
                placeholder="House 12, Road 4, Nasirabad"
              />
            </label>

            <label className="block space-y-1">
              <span className="label-caps text-[10px] text-muted">Special Notes (optional)</span>
              <input
                value={notes}
                 onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
                className="w-full bg-transparent border-b border-border focus:border-ink pb-2 text-sm text-foreground outline-none focus:border-b-2 transition-all duration-200"
                placeholder="Call after 6pm"
              />
            </label>
            
          </div>

          {/* Solid Ink Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className={cn(
              "w-full inline-flex items-center justify-center border border-ink bg-ink text-white px-5 py-3.5 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300 font-semibold rounded-[2px]",
              (isSubmitting || !canSubmit) && "opacity-55 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Placing Order..." : `Confirm Order · ${formatBdt(total)}`}
          </button>

          {errorMessage ? (
            <p className="text-xs font-mono text-muted text-center pt-2">{errorMessage}</p>
          ) : null}
          
        </form>
      </GlassSheet>
    </>
  );
}
