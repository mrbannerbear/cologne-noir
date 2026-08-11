export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 xl:grid-cols-4 xl:gap-12"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          <div className="aspect-[4/5] border border-border bg-background-warm" />
          <div className="space-y-2">
            <div className="h-2 w-1/3 bg-border/60" />
            <div className="h-3 w-2/3 bg-border/60" />
            <div className="h-2 w-1/4 bg-border/60" />
          </div>
        </div>
      ))}
    </div>
  );
}