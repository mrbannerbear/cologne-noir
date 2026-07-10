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
          {/* Flat Dark desaturated Backdrop overlay */}
          <motion.button
            type="button"
            aria-label="Close order form"
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Warm-Cream Flat Editorial Sheet/Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            initial={{ y: "100%", opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-50 max-h-[90vh] overflow-y-auto bg-background-warm border-t border-border",
              "inset-x-0 bottom-0 rounded-t-[1rem] p-5 pb-8 shadow-2xl",
              "md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2px] md:border md:shadow-lg",
            )}
          >
            {/* Drag Handle Indicator */}
            <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-border md:hidden" />
            
            {/* Sheet Title Bar */}
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="label-caps text-[9px] text-muted">Intake Form</p>
                <h2 className="mt-1 font-display text-xl font-light text-foreground">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-[2px] border border-border bg-background px-3 py-1.5 text-[10px] label-caps text-muted hover:border-foreground hover:text-foreground transition-all duration-300"
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
