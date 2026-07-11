import type { ProductWithVariants } from "@/types";
import { ProductCard } from "@/components/product-card";

type ProductGridProps = {
  products: ProductWithVariants[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="border border-border bg-background-warm p-10 text-center space-y-4">
        <p className="label-caps text-xs text-muted">No products available</p>
        <p className="font-display text-xl text-foreground italic">
          No matches found for your filter. Please try another selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 xl:grid-cols-4 xl:gap-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
