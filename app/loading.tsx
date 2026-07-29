export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-360xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center space-y-4">
        <span className="mx-auto inline-block h-2.5 w-2.5 bg-foreground/20" />
        <p className="label-caps text-xs text-muted/50">Loading</p>
        <div className="flex justify-center gap-1">
          <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse" />
          <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse [animation-delay:0.15s]" />
          <span className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-pulse [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  );
}
