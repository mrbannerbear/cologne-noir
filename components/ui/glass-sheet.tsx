"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type GlassSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function GlassSheet({ open, onClose, title, children }: GlassSheetProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close order form"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                onClose();
              }
            }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className={cn(
              "glass fixed z-50 max-h-[90vh] overflow-y-auto",
              "inset-x-0 bottom-0 rounded-t-[2rem] border-b-0 p-5 pb-8",
              "md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem] md:border-b",
            )}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/25 md:hidden" />
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="label-caps text-muted">Order</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs uppercase tracking-[0.05em] text-muted hover:border-white/20 hover:text-foreground"
              >
                Close
              </button>
            </div>
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
