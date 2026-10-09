"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Gender } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";


const filters: Array<{ value: "ALL" | Gender; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
];

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(() => searchParams.get("q") || "");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (value === (searchParams.get("q") || "")) return;

    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/products?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(id);
  }, [value, searchParams, router]);

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search brand or perfume..."
        className="w-full bg-transparent border border-border rounded-[2px] px-4 py-2 text-sm text-foreground outline-none focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-colors duration-300 placeholder:text-muted/50"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-[10px] label-caps text-muted opacity-50">Search</span>
      </div>
    </div>
  );
}

export function GenderFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = (searchParams.get("gender")?.toUpperCase() as Gender | null) ?? "ALL";

  function setFilter(value: "ALL" | Gender) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("gender");
    } else {
      params.set("gender", value);
    }
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products", { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isSelected = active === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => setFilter(filter.value)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-[2px] border px-4 py-2 text-xs label-caps transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
              isSelected
                ? "border-ink bg-ink text-white font-medium"
                : "border-border bg-transparent text-muted hover:border-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

export function ShopAllLink() {
  return (
    <Link
      href="/products"
      className={buttonVariants({ variant: "primary" })}
    >
      Shop All
      <span aria-hidden="true" className="ml-1.5">→</span>
    </Link>
  );
}
