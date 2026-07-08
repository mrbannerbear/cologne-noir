"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
];

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground">
            Cologne Noir
          </span>
          <span className="hidden text-xs uppercase tracking-[0.32em] text-muted sm:inline">
            @cologne.noir
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                pathname.startsWith(link.href)
                  ? "glass border-white/20 text-foreground"
                  : "border-white/10 text-muted hover:border-white/18 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.05em] text-foreground md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/8 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[1rem] border border-white/10 px-4 py-3 text-sm text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
