"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function DeleteButton({
  endpoint,
  label = "Delete",
  confirmText = "Are you sure you want to delete this? This cannot be undone.",
  redirectTo,
  iconOnly = false,
  className,
}: {
  endpoint: string;
  label?: string;
  confirmText?: string;
  redirectTo?: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  async function onDelete() {
    if (!window.confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Delete failed");
      toast({ variant: "success", title: "Deleted" });
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast({ variant: "destructive", title: "Delete failed", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
        iconOnly ? "h-9 w-9 justify-center" : "px-3 py-2",
        className
      )}
      aria-label={label}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {!iconOnly && label}
    </button>
  );
}
