"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { customDecantPrice } from "@/lib/pricing";

type OrderFormProps = {
  product: {
    id: string;
    brand: string;
    name: string;
    actualBottleMl: number;
    actualBottleFullPriceBdt: number;
    variants: Array<{
      id: string;
      size: string;
      label: string;
      priceBdt: number;
      stockQty: number;
    }>;
  };
};

type VariantMode = "preset" | "custom";

export function OrderForm({ product }: OrderFormProps) {
  const router = useRouter();
  const presetVariants = product.variants;
  const [mode, setMode] = useState<VariantMode>(presetVariants[0] ? "preset" : "custom");
  const [variantId, setVariantId] = useState(presetVariants[0]?.id ?? "");
  const [customMl, setCustomMl] = useState("20");
  const [quantity, setQuantity] = useState("1");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedVariant = presetVariants.find((item) => item.id === variantId);
  const unitPrice = mode === "custom" ? customDecantPrice(product, Number(customMl || 0)) : selectedVariant?.priceBdt ?? 0;
  const total = unitPrice * Number(quantity || 1);

  const canSubmit =
    customerName.trim().length > 1 &&
    phone.trim().length > 5 &&
    address.trim().length > 9 &&
    city.trim().length > 1;

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
          productVariantId: mode === "preset" ? variantId : undefined,
          customMl: mode === "custom" ? Number(customMl) : undefined,
          quantity: Number(quantity),
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
    <form onSubmit={onSubmit} className="glass rounded-[2rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-black/42">Order now</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-black">Manual COD checkout</h2>
        </div>
        <div className="rounded-full border border-black/8 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-black/65">
          Live pricing
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("preset")}
            className={`rounded-[1.2rem] border px-4 py-3 text-left text-sm transition ${mode === "preset" ? "border-black/15 bg-white text-black" : "border-black/8 bg-white/65 text-black/62"}`}
          >
            Preset size
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`rounded-[1.2rem] border px-4 py-3 text-left text-sm transition ${mode === "custom" ? "border-black/15 bg-white text-black" : "border-black/8 bg-white/65 text-black/62"}`}
          >
            Custom amount
          </button>
        </div>

        {mode === "preset" ? (
          <div className="grid gap-2">
            {presetVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                disabled={variant.stockQty <= 0}
                onClick={() => setVariantId(variant.id)}
                className={`flex items-center justify-between rounded-[1.15rem] border px-4 py-3 text-left transition ${variantId === variant.id ? "border-black/15 bg-white text-black" : "border-black/8 bg-white/70 text-black/68"} ${variant.stockQty <= 0 ? "opacity-50" : ""}`}
              >
                <span>
                  <span className="block text-sm font-medium">{variant.label}</span>
                  <span className="block text-xs text-black/45">{variant.stockQty > 0 ? `${variant.stockQty} available` : "Sold out"}</span>
                </span>
                <span className="text-sm text-black/72">৳{variant.priceBdt.toLocaleString("en-BD")}</span>
              </button>
            ))}
          </div>
        ) : (
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Custom ml</span>
            <input
              type="number"
              min="1"
              value={customMl}
              onChange={(event) => setCustomMl(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
            />
          </label>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Full name</span>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
              placeholder="Sayed Rahman"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Phone</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
              placeholder="017XXXXXXXX"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Address</span>
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              rows={3}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
              placeholder="House 12, Road 4, Nasirabad"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">City</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
              placeholder="Chittagong"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Quantity</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-black/42">Note</span>
            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-[1.15rem] border border-black/8 bg-white/80 px-4 py-3 text-black outline-none placeholder:text-black/30"
              placeholder="Call after 6pm"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.35rem] border border-black/8 bg-white/80 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">Estimated total</p>
          <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-black">৳{total.toLocaleString("en-BD")}</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="rounded-full border border-black/8 bg-black px-5 py-3 text-sm font-medium text-white transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Placing order..." : "Order now"}
        </button>
      </div>

      {errorMessage ? <p className="mt-4 text-sm text-black/70">{errorMessage}</p> : null}
    </form>
  );
}