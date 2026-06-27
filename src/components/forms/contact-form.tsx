"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function ContactForm({ className }: { className?: string }) {
  const { toast } = useToast();
  const [done, setDone] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setDone(true);
      reset();
      toast({ variant: "success", title: "Message sent", description: "We'll get back to you soon." });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not send message",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  if (done) {
    return (
      <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-900 dark:bg-emerald-950/40", className)}>
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 font-display text-xl font-bold">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out. Our team will respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)} noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("website")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Full Name <span className="text-gold">*</span></Label>
          <Input placeholder="Jane Smith" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Email <span className="text-gold">*</span></Label>
          <Input type="email" placeholder="jane@company.ca" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input type="tel" placeholder="(416) 555-0100" {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input placeholder="How can we help?" {...register("subject")} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Message <span className="text-gold">*</span></Label>
        <Textarea rows={5} placeholder="Write your message…" {...register("message")} />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <Button type="submit" variant="gold" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
