"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { leadSchema, type LeadInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

type Source = "HOMEPAGE" | "LISTING" | "APPLICATION" | "CONTACT_PAGE";

export function LeadForm({
  source = "HOMEPAGE",
  listingId,
  className,
  compact = false,
  defaultEquipment,
}: {
  source?: Source;
  listingId?: string;
  className?: string;
  compact?: boolean;
  defaultEquipment?: string;
}) {
  const { toast } = useToast();
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source, listingId, equipmentNeeded: defaultEquipment ?? "" },
  });

  async function onSubmit(values: LeadInput) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setDone(true);
      reset();
      toast({
        variant: "success",
        title: "Request received",
        description: "A financing specialist will reach out shortly.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  if (done) {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-900 dark:bg-emerald-950/40", className)}>
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 font-display text-xl font-bold text-foreground">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We've received your request. One of our financing specialists will reach out within one
          business day.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)} noValidate>
      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("website")} />
      {/* Hidden context so the lead/email carries the source and listing */}
      <input type="hidden" {...register("source")} />
      <input type="hidden" {...register("listingId")} />

      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <Field label="Full Name" error={errors.name?.message} required>
          <Input placeholder="Jane Smith" {...register("name")} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <Input placeholder="Acme Construction Ltd." {...register("company")} />
        </Field>
        <Field label="Email" error={errors.email?.message} required>
          <Input type="email" placeholder="jane@company.ca" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input type="tel" placeholder="(416) 555-0100" {...register("phone")} />
        </Field>
      </div>

      <Field label="Equipment Needed" error={errors.equipmentNeeded?.message}>
        <Input placeholder="e.g. Excavator, CNC machine, delivery trucks" {...register("equipmentNeeded")} />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <Textarea
          rows={compact ? 3 : 4}
          placeholder="Tell us about your financing needs, budget, and timeline."
          {...register("message")}
        />
      </Field>

      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Request Financing"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No obligation. We'll never share your information.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-gold">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
