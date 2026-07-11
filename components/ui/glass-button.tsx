"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "ghost";
};

export function GlassButton({ className, variant = "primary", children, ...props }: GlassButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "glass inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-5 py-3 text-sm font-medium text-foreground transition-colors",
        variant === "primary" && "hover:glass-hover active:glass-press",
        variant === "ghost" && "bg-transparent hover:bg-white/5",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
