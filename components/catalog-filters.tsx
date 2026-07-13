"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import type { Gender } from "@prisma/client";
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
  const query = searchParams.get("q") || "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        placeholder="Search brand or perfume..."
        className="w-full bg-transparent border border-border rounded-[2px] px-4 py-2 text-sm text-foreground outline-none focus:border-ink transition-all duration-300 placeholder:text-muted/50"
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
    router.push(query ? `/products?${query}` : "/products");
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
            className={cn(
              "rounded-[2px] border px-4 py-2 text-xs label-caps transition-all duration-300",
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
      className="inline-flex items-center justify-center border border-ink bg-ink text-white px-5 py-2.5 text-xs label-caps hover:bg-white hover:text-ink transition-colors duration-300"
    >
      Shop All
      <span aria-hidden="true" className="ml-1.5">→</span>
    </Link>
  );
}
