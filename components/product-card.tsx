import Link from "next/link";
import { formatBdt } from "@/lib/format";
import { genderLabel } from "@/lib/products";
import type { ProductWithVariants } from "@/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductWithVariants;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const coverImage = product.images[0];
  const soldOut = !product.hasStock;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block space-y-4 hover:opacity-85 transition-opacity duration-300",
        className
      )}
    >
      
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-background-warm">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-4 bg-background-warm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[10px] label-caps text-muted">
                {genderLabel(product.gender)}
              </span>
              <span className="text-[10px] font-mono text-muted">
                {product.actualBottleMl}ml
              </span>
            </div>
            <div className="space-y-1">
              <p className="label-caps text-[9px] text-muted">{product.brand}</p>
              <h2 className="font-display text-xl font-light text-foreground">{product.name}</h2>
            </div>
          </div>
        )}
        
        {/* Sold Out Overlay (Editorial Flat Style) */}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background-warm/90 backdrop-blur-[1px]">
            <span className="border border-ink bg-transparent text-ink px-4 py-2 text-[10px] label-caps font-semibold">
              Sold out
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Details (Print Style) */}
      <div className="space-y-1">
        <div className="flex justify-between items-baseline gap-2">
          <p className="label-caps text-[10px] text-muted">{product.brand}</p>
          <p className="text-[10px] font-mono text-muted">{genderLabel(product.gender)}</p>
        </div>
        <p className="font-sans text-sm font-medium text-foreground tracking-tight">
          {product.name}
        </p>
        <p className="font-mono text-xs text-muted">
          {formatBdt(product.priceFloor)}
          {product.priceCeiling > product.priceFloor ? ` – ${formatBdt(product.priceCeiling)}` : ""}
        </p>
      </div>

    </Link>
  );
}
