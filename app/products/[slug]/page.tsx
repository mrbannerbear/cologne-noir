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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <span aria-hidden="true">←</span>
        Back to catalog
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <section className="glass overflow-hidden rounded-[1.5rem] p-4 sm:p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]">
            {coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt={`${product.brand} ${product.name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="glass rounded-full px-3 py-1 label-caps text-foreground">
                    {genderLabel(product.gender)}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 label-caps text-muted">
                    {product.actualBottleMl}ml bottle
                  </span>
                </div>
                <div>
                  <p className="label-caps text-muted">{product.brand}</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    {product.name}
                  </h1>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-4">
            {product.description ? (
              <p className="text-base leading-8 text-muted">{product.description}</p>
            ) : null}
            <NotesPyramid
              topNotes={product.topNotes}
              middleNotes={product.middleNotes}
              baseNotes={product.baseNotes}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <section className="glass rounded-[1.5rem] p-5 sm:p-6">
            <p className="label-caps text-muted">{product.brand}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{product.name}</h1>
            <p className="mt-3 text-sm text-muted">
              From {formatBdt(product.priceFloor)}
              {product.priceCeiling > product.priceFloor ? ` to ${formatBdt(product.priceCeiling)}` : ""}
            </p>
          </section>

          <ProductPurchase product={product} />
        </aside>
      </div>

      {related.length ? (
        <section className="mt-8 glass rounded-[1.5rem] p-5 sm:p-6">
          <p className="label-caps text-muted">More to explore</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.slug}`}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition hover:border-white/18 hover:bg-white/8"
              >
                <p className="label-caps text-muted">{item.brand}</p>
                <p className="mt-2 text-lg font-medium text-foreground">{item.name}</p>
                <p className="mt-1 text-sm text-muted">From {formatBdt(item.priceFloor)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
