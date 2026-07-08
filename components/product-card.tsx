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
        "group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-surface transition hover:-translate-y-0.5 hover:border-white/18",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImage} alt={`${product.brand} ${product.name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="glass rounded-full px-3 py-1 label-caps text-foreground">
                {genderLabel(product.gender)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 label-caps text-muted">
                {product.actualBottleMl}ml
              </span>
            </div>
            <div>
              <p className="label-caps text-muted">{product.brand}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{product.name}</h2>
            </div>
          </div>
        )}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <span className="glass rounded-full px-4 py-2 label-caps text-foreground">Sold out</span>
          </div>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-4 p-4">
        <div>
          <p className="label-caps text-muted">{product.brand}</p>
          <p className="mt-1 text-lg font-medium text-foreground">{product.name}</p>
          <p className="mt-1 text-sm text-muted">
            {formatBdt(product.priceFloor)}
            {product.priceCeiling > product.priceFloor ? ` – ${formatBdt(product.priceCeiling)}` : ""}
          </p>
        </div>
        <span className="text-sm text-muted group-hover:text-foreground">View</span>
      </div>
    </Link>
  );
}
