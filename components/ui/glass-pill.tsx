"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassPillProps = {
  children: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function GlassPill({ children, selected, disabled, onClick, className }: GlassPillProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.05em] transition-colors",
        selected
          ? "glass border-white/25 text-foreground"
          : "border-white/10 bg-white/5 text-muted hover:border-white/18 hover:bg-white/8",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
