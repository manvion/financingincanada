"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES, PRICE_RANGES } from "@/lib/constants";

type Category = { slug: string; name: string };

export function EquipmentFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = React.useState(searchParams.get("q") ?? "");

  const update = React.useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v && v !== "any") params.set(k, v);
        else params.delete(k);
      });
      params.delete("page");
      router.push(`/equipment?${params.toString()}`);
    },
    [router, searchParams]
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    update({ q: q || undefined });
  };

  const priceValue = (() => {
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    if (!min && !max) return "any";
    return `${min ?? 0}-${max ?? 99999999}`;
  })();

  const hasFilters =
    searchParams.get("category") ||
    searchParams.get("province") ||
    searchParams.get("condition") ||
    searchParams.get("min") ||
    searchParams.get("q");

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <form onSubmit={onSearch} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search equipment, make, or model…"
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
          <Select
            value={searchParams.get("category") ?? "any"}
            onValueChange={(v) => update({ category: v })}
          >
            <SelectTrigger className="lg:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("province") ?? "any"}
            onValueChange={(v) => update({ province: v })}
          >
            <SelectTrigger className="lg:w-40"><SelectValue placeholder="Province" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Provinces</SelectItem>
              {PROVINCES.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priceValue}
            onValueChange={(v) => {
              if (v === "any") return update({ min: undefined, max: undefined });
              const [min, max] = v.split("-");
              update({ min, max });
            }}
          >
            <SelectTrigger className="lg:w-44"><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("condition") ?? "any"}
            onValueChange={(v) => update({ condition: v })}
          >
            <SelectTrigger className="lg:w-32"><SelectValue placeholder="Condition" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">New &amp; Used</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="USED">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" variant="default" className="lg:px-5">
          <SlidersHorizontal className="h-4 w-4" /> Apply
        </Button>
      </form>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push("/equipment");
          }}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
        >
          <X className="h-3.5 w-3.5" /> Clear all filters
        </button>
      )}
    </div>
  );
}
