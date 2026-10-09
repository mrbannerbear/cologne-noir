"use client";

import type { FormEvent, ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { submitOfferOrder } from "@/lib/actions";
import { formatBdt } from "@/lib/format";
import type { BundleSize, OfferView } from "@/types";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OfferOrderProps = {
  offer: OfferView;
  showPriceLine?: boolean;
};

const SIZE_OPTIONS: Array<{ value: BundleSize; label: string }> = [
  { value: "DECANT_5ML", label: "5ml" },
  { value: "DECANT_10ML", label: "10ml" },
];

export function OfferOrder({ offer, showPriceLine = true }: OfferOrderProps) {
  const router = useRouter();
  const [size, setSize] = useState<BundleSize>("DECANT_5ML");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sizeOptions = SIZE_OPTIONS.map((option) => ({
    ...option,
    price:
      option.value === "DECANT_5ML"
        ? offer.price5mlBdt
        : offer.price10mlBdt,
  }));

  const selected = sizeOptions.find((option) => option.value === size) ?? sizeOptions[0]!;
  const total = selected.price;

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const canSubmit = useMemo(
    () =>
      customerName.trim().length > 1 &&
      phone.trim().length > 5 &&
      address.trim().length > 9 &&
      city.trim().length > 1,
    [address, city, customerName, phone],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitOfferOrder({
        offerId: offer.id,
        size,
        customerName,
        phone,
        address,
        city,
        notes: notes.trim() ? notes.trim() : null,
      });

      if (!result.success) {
        setErrorMessage("message" in result ? result.message : "Unable to place order.");
        return;
      }

      router.push(`/order/confirmation?orderNumber=${encodeURIComponent(result.orderNumber)}`);
    } catch {
      setErrorMessage("Unable to place order right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-4 pt-2">
        {showPriceLine ? (
          <div className="flex flex-wrap items-end gap-4 justify-between border-t border-border pt-6">
            <div>
              <p className="label-caps text-[10px] text-muted">Bundle Price</p>
              <p className="mt-1 font-display text-2xl font-light text-foreground">{formatBdt(total)}</p>
            </div>
            <Button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="min-w-40 h-10"
            >
              Order This Bundle
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="w-full min-w-44 h-11 sm:w-auto"
          >
            Order This Bundle
          </Button>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={closeSheet} title={offer.name}>
        <form onSubmit={onSubmit} className="space-y-6">

          {/* Size Selector */}
          <div>
            <span className="label-caps text-[10px] text-muted">Size</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSize(option.value)}
                  aria-pressed={size === option.value}
                  className={cn(
                    "rounded-[2px] border px-4 py-2 text-xs label-caps transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                    size === option.value
                      ? "border-ink bg-ink text-white font-medium"
                      : "border-border bg-transparent text-muted hover:border-foreground hover:text-foreground"
                  )}
                >
                  {option.label} · {formatBdt(option.price)}
                </button>
              ))}
            </div>
          </div>

          {/* Order Snapshot Receipt */}
          <div className="border border-border bg-background p-4 text-xs font-mono space-y-2">
            <p className="text-foreground font-semibold">{offer.name}</p>
            <p className="text-muted">{selected.label} set · {offer.items.length} decants</p>
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
          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className={cn("w-full", (isSubmitting || !canSubmit) && "cursor-not-allowed")}
          >
            {isSubmitting ? "Placing Order..." : `Confirm Order · ${formatBdt(total)}`}
          </Button>

          {errorMessage ? (
            <p className="text-xs font-mono text-muted text-center pt-2">{errorMessage}</p>
          ) : null}

        </form>
      </Sheet>
    </>
  );
}