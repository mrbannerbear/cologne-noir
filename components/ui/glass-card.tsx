import { cn } from "@/lib/utils";

type GlassCardProps = React.ComponentProps<"div">;

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn("glass overflow-hidden rounded-[1.25rem]", className)}
      {...props}
    />
  );
}
