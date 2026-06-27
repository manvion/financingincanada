"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BLOG_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [q, setQ] = React.useState(searchParams.get("q") ?? "");

  const setCategory = (category?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory()}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !activeCategory ? "border-gold bg-gold text-navy" : "border-border hover:bg-secondary"
          )}
        >
          All
        </button>
        {BLOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat ? "border-gold bg-gold text-navy" : "border-border hover:bg-secondary"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <form onSubmit={onSearch} className="relative w-full lg:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="pl-10" />
      </form>
    </div>
  );
}
