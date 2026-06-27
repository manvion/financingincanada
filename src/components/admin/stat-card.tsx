import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "navy" | "gold" | "emerald" | "blue";
}) {
  const accents = {
    navy: "bg-navy text-gold",
    gold: "bg-gold/12 text-gold-700 dark:text-gold",
    emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/12 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-card transition-shadow hover:shadow-premium">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold/60 to-transparent" />
      <div className="flex items-center justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-lg", accents[accent])}>
          <Icon className="h-5 w-5" />
        </span>
        {hint && (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
      <p className="mt-5 font-display text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
