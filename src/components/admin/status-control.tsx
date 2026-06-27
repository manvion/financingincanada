"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Status = "NEW" | "CONTACTED" | "ARCHIVED";

export function StatusControl({
  endpoint,
  initial,
}: {
  endpoint: string;
  initial: Status;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = React.useState<Status>(initial);
  const [pending, setPending] = React.useState(false);

  async function update(next: Status) {
    const prev = status;
    setStatus(next);
    setPending(true);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch {
      setStatus(prev);
      toast({ variant: "destructive", title: "Could not update status" });
    } finally {
      setPending(false);
    }
  }

  return (
    <Select value={status} onValueChange={(v) => update(v as Status)} disabled={pending}>
      <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="NEW">New</SelectItem>
        <SelectItem value="CONTACTED">Contacted</SelectItem>
        <SelectItem value="ARCHIVED">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
}
