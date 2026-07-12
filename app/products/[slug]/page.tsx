import Link from "next/link";
import { notFound } from "next/navigation";
import { NotesPyramid } from "@/components/notes-pyramid";
import { ProductPurchase } from "@/components/product-purchase";
import { formatBdt } from "@/lib/format";
import { genderLabel, getActiveProducts, getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProductBySlug(slug),
    getActiveProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const related = relatedProducts.filter((item) => item.slug !== slug).slice(0, 3);
  const coverImage = product.images[0];

  return (
    <div className="mx-auto w-full max-w-360xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs label-caps text-muted hover:text-foreground transition-colors editorial-link"
        >
          <span aria-hidden="true">←</span>
          Back to catalog
        </Link>
      </div>

      {/* Split-Screen Product Frame */}
      <section className="grid overflow-hidden border border-border lg:grid-cols-2">
        
        {/* Left Half: Photographic Visual */}
        <div className="relative aspect-[4/5] bg-background-warm border-b border-border lg:border-b-0 lg:border-r">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={`${product.brand} ${product.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col justify-between p-8 bg-background-warm">
              <div className="flex items-start justify-between gap-3">
                <span className="border border-border bg-background px-3 py-1 text-[10px] label-caps text-muted">
                  {genderLabel(product.gender)}
                </span>
                <span className="text-[10px] font-mono text-muted">
                  {product.actualBottleMl}ml bottle
                </span>
              </div>
              <div className="space-y-2">
                <p className="label-caps text-xs text-muted">{product.brand}</p>
                <h1 className="font-display text-4xl sm:text-5xl font-light leading-none text-foreground">
                  {product.name}
                </h1>
              </div>
              <span className="label-caps text-[9px] text-muted font-mono">Cologne Noir</span>
            </div>
          )}
        </div>

        {/* Right Half: Details & Form Intake */}
        <div className="flex flex-col justify-between bg-background-warm p-6 sm:p-10 lg:p-12 gap-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline gap-2 border-b border-border/80 pb-4">
              <div>
                <p className="label-caps text-[10px] text-muted">{product.brand}</p>
                <h1 className="font-display text-3xl font-light text-foreground mt-1">{product.name}</h1>
              </div>
              <span className="text-xs font-mono text-muted">
                {product.actualBottleMl}ml full bottle
              </span>
            </div>
            
            {product.description ? (
              <p className="text-xs leading-relaxed text-muted font-sans pt-2">{product.description}</p>
            ) : null}

            {/* Note Pyramid (divider rules) */}
            <NotesPyramid
              topNotes={product.topNotes}
              middleNotes={product.middleNotes}
              baseNotes={product.baseNotes}
            />
          </div>

          {/* Interactive Variant Selection and Form */}
          <div className="pt-4">
            <ProductPurchase product={product} />
          </div>

        </div>
      </section>

      {/* More to explore Section */}
      {related.length ? (
        <section className="border border-border bg-background p-6 sm:p-10 space-y-6">
          <div>
            <p className="label-caps text-xs text-muted">Curated options</p>
            <h2 className="font-display text-2xl font-light text-foreground mt-1">Related Fragrances</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="border border-border/85 bg-background-warm p-6 hover:border-foreground transition-all duration-300 space-y-3"
              >
                <div className="space-y-1">
                  <p className="label-caps text-[9px] text-muted">{item.brand}</p>
                  <h3 className="font-display text-lg font-light text-foreground">{item.name}</h3>
                </div>
                <p className="font-mono text-xs text-muted">
                  From {formatBdt(item.priceFloor)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

    </div>
  );
}
