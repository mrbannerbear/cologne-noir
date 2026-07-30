"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground antialiased">
        <div className="mx-auto w-full max-w-md px-4 py-12 text-center space-y-8">
          <div className="space-y-4">
            <span className="mx-auto inline-block h-2.5 w-2.5 bg-foreground/60" />
            <p className="label-caps text-xs text-muted">Critical error</p>
            <h1 className="font-display text-3xl font-light text-foreground leading-tight">
              The storefront needs a moment.
            </h1>
            <p className="text-xs leading-relaxed text-muted font-sans">
              A serious issue was encountered. Please try reloading.
            </p>
            {error.digest ? (
              <p className="font-mono text-[10px] text-muted/50">Ref: {error.digest}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center border border-ink bg-ink text-white px-5 py-3 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300 cursor-pointer"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
