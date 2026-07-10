"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const links = [
  { href: "/products", label: "Catalog" },
  { href: "/about", label: "About Us" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-360xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Left Column: Nav Links (Desktop) */}
        <nav className="hidden flex-1 items-center gap-6 md:flex justify-start">
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
        <div className="flex md:flex-1 justify-start md:justify-center">
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <div className="font-display text-3xl tracking-widest font-normal select-none flex items-baseline">
              {/* C<span className="italic text-muted font-normal text-2xl -ml-0.5">N</span> */}
              <Image src={"/logo.jpg"} height={16} width={16} alt="logo" />
            </div>
            <span className="label-caps text-[0.6rem] text-muted tracking-[0.25em] font-medium border-l border-border pl-3 transition-colors group-hover:text-foreground">
              Cologne Noir
            </span>
          </Link>
        </div>

        {/* Right Column: Utilities (Desktop) */}
        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          <Link
            href="/products"
            className="label-caps text-xs text-muted hover:text-foreground transition-colors editorial-link"
          >
            Search
          </Link>
          <span className="h-3 w-px bg-border" />
          <span className="label-caps text-[0.65rem] text-muted select-none">
            Chittagong
          </span>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="label-caps text-xs text-foreground px-3 py-1.5 border border-border hover:bg-background-warm md:hidden transition-colors"
          onClick={() => setOpen((val) => !val)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Nav Drawer (Classy height animation) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background-warm md:hidden"
          >
            <nav className="flex flex-col px-4 py-6 gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "font-display text-2xl italic tracking-tight p-2 transition-colors",
                    pathname.startsWith(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center px-2">
                <span className="label-caps text-[0.65rem] text-muted">
                  Instagram: @cologne.noir
                </span>
                <span className="label-caps text-[0.65rem] text-muted">
                  COD Bangladesh
                </span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
