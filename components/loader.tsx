export function Loader() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-4" role="status" aria-live="polite">
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
