import Image from "next/image";
import Link from "next/link";
import type { OfferItemView } from "@/types";
import { cn } from "@/lib/utils";

export const OFFER_PRINT_ROTATIONS = ["-rotate-1", "rotate-2", "rotate-1", "-rotate-2"] as const;

/* A single photo "print" — framed photo + caption. Sizing/rotation is
   supplied by the caller so the same block serves both the mobile two-row
   collage and the tablet/desktop overlapping single row. */
function Print({ item, className }: { item: OfferItemView; className?: string }) {
  const image = item.images[0];
  return (
    <Link
      href={`/products/${item.slug}`}
      className={cn(
        "group relative shrink-0 bg-background border border-border p-2 sm:p-2.5",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-background-warm">
        {image ? (
          <Image
            src={image}
            alt={`${item.brand} ${item.name}`}
            fill
            sizes="(max-width: 1024px) 40vw, 20vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-85"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2">
            <span className="text-center font-display text-[10px] font-light text-muted">
              {item.brand}
              <br />
              {item.name}
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 truncate font-display text-xs font-light text-foreground">
        {item.brand} {item.name}
      </p>
    </Link>
  );
}

/* The overlapping photo-print collage for a bundle. Pure presentational
   markup (no motion) so the homepage hero and the offer detail page share
   one source of truth for the sizing/rotation/mobile-fit treatment.
   On phones this is a two-row staggered layout of larger prints; on
   tablet/desktop it's the single overlapping row. */
export function OfferCollage({ items }: { items: OfferItemView[] }) {
  if (items.length === 0) {
    return (
      <span className="font-display text-4xl italic leading-none tracking-tight text-muted select-none">
        Cologne Noir
      </span>
    );
  }

  const rows: OfferItemView[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <>
      {/* Mobile: two staggered rows of larger prints */}
      <div className="flex w-full flex-col items-center gap-1 sm:hidden">
        {rows.map((row, r) => (
          <div key={r} className="flex w-full items-center justify-center gap-5">
            {row.map((item, c) => (
              <Print
                key={item.slug}
                item={item}
                className={cn(
                  "w-32",
                  c > 0 && "-ml-2",
                  (r + c) % 2 === 0 ? "-rotate-1" : "rotate-2",
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Tablet / desktop: single overlapping row */}
      <div className="hidden items-center sm:flex">
        {items.map((item, i) => (
          <Print
            key={item.slug}
            item={item}
            className={cn(
              "sm:w-44 lg:w-56",
              i > 0 && "sm:-ml-10 lg:-ml-12",
              OFFER_PRINT_ROTATIONS[i % OFFER_PRINT_ROTATIONS.length],
            )}
          />
        ))}
      </div>
    </>
  );
}