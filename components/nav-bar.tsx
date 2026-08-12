"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { MenuToggle } from "@/components/menu-toggle";

const links = [
  { href: "/products", label: "Catalog" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion(); 
  const drawerRef = useRef<HTMLDivElement>(null);

  const drawerTransition = prefersReducedMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("menu-open");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPopState() {
      setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);

    const previouslyFocused = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="relative z-50 border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-360 items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          
          {/* Left Column: Nav Links (Desktop) */}
          <nav className="hidden flex-1 items-center gap-6 lg:flex justify-start">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "label-caps editorial-link text-xs transition-colors",
                  pathname.startsWith(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center Column: Monogram Brand Logo (Desktop & Mobile) */}
          <div className="flex flex-1 justify-center">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
              <div className="font-display text-3xl tracking-widest font-normal select-none flex items-baseline">
                <Image
                  src={"/logo-clear1.png"}
                  height={69}
                  width={140}
                  alt="logo"
                  loading="eager"
                  className="h-auto w-24 md:w-30 lg:w-35"
                />
              </div>
            </Link>
          </div>

          {/* Right Column: Utilities (Desktop) */}
          <div className="hidden flex-1 items-center justify-end gap-6 lg:flex">
            <Link
              href="/products"
              className="label-caps text-xs text-muted hover:text-foreground transition-colors editorial-link"
            >
              Search
            </Link>
            <span className="h-3 w-px bg-border" />
            <span className="label-caps text-[0.65rem] text-muted select-none">
              BD · verified
            </span>
          </div>

          {/* Mobile & Tablet Menu Toggle — hamburger morphs to cross */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:bg-background-warm lg:hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            onClick={() => setOpen((val) => !val)}
          >
            <MenuToggle open={open} />
          </button>
        </div>
      </header>

      {/* Full-height right drawer + dim backdrop — siblings of the header so
          the toggle (z-50) stays above the panel and stays clickable. */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="menu-backdrop"
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.15 } : { duration: 0.3, ease: "easeOut" }}
            onClick={() => setOpen(false)}
          />
        )}
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            tabIndex={-1}
            className="fixed inset-y-0 right-0 z-40 w-[60%] min-w-60 overflow-y-auto border-l border-border bg-background outline-none will-change-transform lg:hidden"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={drawerTransition}
          >
            <nav className="flex min-h-full flex-col px-6 pb-8 pt-28">
              <p className="label-caps text-[10px] text-muted">Navigation</p>
              <div className="mt-4 flex flex-col">
                {links.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 border-b border-border py-5 transition-colors",
                      pathname.startsWith(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
                    )}
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="label-caps text-[9px] text-muted">0{index + 1}</span>
                      <span className="font-display text-3xl font-light italic tracking-tight">{link.label}</span>
                    </span>
                    <span className="text-muted transition-colors group-hover:text-foreground" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-6 pt-12">
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                  <span className="label-caps text-[0.65rem] text-muted">
                    Instagram: @cologne.noir
                  </span>
                  <span className="label-caps text-[0.65rem] text-muted">
                    COD Bangladesh
                  </span>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}