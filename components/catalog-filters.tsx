"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Gender } from "@prisma/client";
import { GlassPill } from "@/components/ui/glass-pill";

const filters: Array<{ value: "ALL" | Gender; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
];

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
      {filters.map((filter) => (
        <GlassPill
          key={filter.value}
          selected={active === filter.value}
          onClick={() => setFilter(filter.value)}
        >
          {filter.label}
        </GlassPill>
      ))}
    </div>
  );
}

export function ShopAllLink() {
  return (
    <Link href="/products" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground">
      Shop all
      <span aria-hidden="true">→</span>
    </Link>
  );
}
