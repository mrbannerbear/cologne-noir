"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Scroll to the top of the page on every route change. Framer Motion
   handles the rest of the motion — this is instant, native scroll. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}