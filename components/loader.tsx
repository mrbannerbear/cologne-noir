export function Loader() {
  return (
    <div className="mx-auto flex w-full max-w-360xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-6">
        <span className="text-[10px] label-caps text-muted tracking-[0.3em]">
          Loading
        </span>
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 animate-pulse" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 animate-pulse [animation-delay:0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/20 animate-pulse [animation-delay:0.3s]" />
        </div>
      </div>
    </div>
  );
}
