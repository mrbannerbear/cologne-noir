import type { ProductWithVariants } from "@/types";
import { ProductCard } from "@/components/product-card";

type ProductGridProps = {
  products: ProductWithVariants[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="glass rounded-[1.5rem] p-8 text-center">
        <p className="label-caps text-muted">No products</p>
        <p className="mt-2 text-foreground">Nothing matches this filter yet. Try another category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
