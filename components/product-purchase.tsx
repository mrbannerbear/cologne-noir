"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatBdt } from "@/lib/format";
import type { ProductWithVariants } from "@/types";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassSheet } from "@/components/ui/glass-sheet";
import { VariantSelector, type VariantSelection } from "@/components/variant-selector";

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

  return {
    mode: "custom",
    customMl: 20,
    label: "20ml Custom Decant",
    unitPrice: Math.round((product.actualBottleFullPriceBdt / product.actualBottleMl) * 20),
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
      <section className="glass rounded-[1.5rem] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="label-caps text-muted">Choose size</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatBdt(total)}</p>
          </div>
          <span className="label-caps text-muted">{selection.label}</span>
        </div>

        <div className="mt-4">
          <VariantSelector product={product} selection={selection} onChange={setSelection} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
          <div>
            <p className="label-caps text-muted">Quantity</p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="mt-2 w-20 rounded-[0.875rem] border border-white/12 bg-black/40 px-3 py-2 text-foreground outline-none"
            />
          </div>
          <GlassButton
            type="button"
            disabled={!canOpenSheet}
            onClick={() => setSheetOpen(true)}
            className="min-w-[9rem]"
          >
            Order now
          </GlassButton>
        </div>
      </section>

      <GlassSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={`${product.brand} ${product.name}`}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-muted">
            <p>{selection.label} × {qty}</p>
            <p className="mt-1 text-lg font-medium text-foreground">{formatBdt(total)}</p>
            <p className="mt-2 text-xs">COD — we&apos;ll confirm by WhatsApp before shipping.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label-caps text-muted">Full name</span>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                placeholder="Sayed Rahman"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted">Phone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                placeholder="017XXXXXXXX"
              />
            </label>
            <label className="block">
              <span className="label-caps text-muted">City</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                placeholder="Chittagong"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="label-caps text-muted">Address</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                placeholder="House 12, Road 4, Nasirabad"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="label-caps text-muted">Note (optional)</span>
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-white/12 bg-black/40 px-4 py-3 text-foreground outline-none"
                placeholder="Call after 6pm"
              />
            </label>
          </div>

          <GlassButton type="submit" disabled={isSubmitting || !canSubmit} className="w-full">
            {isSubmitting ? "Placing order..." : `Confirm order · ${formatBdt(total)}`}
          </GlassButton>

          {errorMessage ? <p className="text-sm text-muted">{errorMessage}</p> : null}
        </form>
      </GlassSheet>
    </>
  );
}
