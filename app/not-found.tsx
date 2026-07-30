import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="w-full border border-border bg-background-warm p-6 sm:p-12 text-center space-y-8">
        <div className="space-y-4">
          <span className="mx-auto inline-block h-2.5 w-2.5 bg-foreground/60" />
          <p className="label-caps text-xs text-muted">404 — Page not found</p>
          <h1 className="font-display text-4xl font-light text-foreground leading-tight">
            This page doesn&apos;t exist.
          </h1>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted font-sans">
            The fragrance you&apos;re looking for may have been discontinued, or the link may be
            incorrect. Browse the full catalog below.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-ink bg-ink text-white px-5 py-3 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300"
          >
            Full Catalog
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-border px-5 py-3 text-xs label-caps text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
