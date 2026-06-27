"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { settingsSchema, type SettingsInput } from "@/lib/validations";

export function SettingsForm({ initial, canEdit }: { initial: Partial<SettingsInput>; canEdit: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: initial.companyName ?? "Financing in Canada",
      tagline: initial.tagline ?? "",
      phone: initial.phone ?? "",
      email: initial.email ?? "",
      address: initial.address ?? "",
      city: initial.city ?? "",
      province: initial.province ?? "",
      postalCode: initial.postalCode ?? "",
      facebookUrl: initial.facebookUrl ?? "",
      linkedinUrl: initial.linkedinUrl ?? "",
      twitterUrl: initial.twitterUrl ?? "",
      instagramUrl: initial.instagramUrl ?? "",
      smtpHost: initial.smtpHost ?? "",
      smtpPort: initial.smtpPort ?? undefined,
      smtpSecure: initial.smtpSecure ?? false,
      smtpUser: initial.smtpUser ?? "",
      smtpFrom: initial.smtpFrom ?? "",
      notifyEmail: initial.notifyEmail ?? "",
    },
  });

  async function onSubmit(values: SettingsInput) {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      toast({ variant: "success", title: "Settings saved" });
      router.refresh();
    } catch (err) {
      toast({ variant: "destructive", title: "Save failed", description: err instanceof Error ? err.message : "" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="email">Email / SMTP</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Section>
            <Grid>
              <F label="Company Name" error={errors.companyName?.message}><Input {...register("companyName")} disabled={!canEdit} /></F>
              <F label="Tagline"><Input {...register("tagline")} disabled={!canEdit} /></F>
              <F label="Phone"><Input {...register("phone")} disabled={!canEdit} /></F>
              <F label="Email" error={errors.email?.message}><Input {...register("email")} disabled={!canEdit} /></F>
              <F label="Address"><Input {...register("address")} disabled={!canEdit} /></F>
              <F label="City"><Input {...register("city")} disabled={!canEdit} /></F>
              <F label="Province"><Input {...register("province")} disabled={!canEdit} /></F>
              <F label="Postal Code"><Input {...register("postalCode")} disabled={!canEdit} /></F>
            </Grid>
          </Section>
        </TabsContent>

        <TabsContent value="social">
          <Section>
            <Grid>
              <F label="LinkedIn URL" error={errors.linkedinUrl?.message}><Input {...register("linkedinUrl")} disabled={!canEdit} placeholder="https://linkedin.com/company/…" /></F>
              <F label="Facebook URL" error={errors.facebookUrl?.message}><Input {...register("facebookUrl")} disabled={!canEdit} /></F>
              <F label="Twitter / X URL" error={errors.twitterUrl?.message}><Input {...register("twitterUrl")} disabled={!canEdit} /></F>
              <F label="Instagram URL" error={errors.instagramUrl?.message}><Input {...register("instagramUrl")} disabled={!canEdit} /></F>
            </Grid>
          </Section>
        </TabsContent>

        <TabsContent value="email">
          <Section>
            <p className="mb-4 rounded-lg bg-secondary/60 p-3 text-xs text-muted-foreground">
              SMTP credentials configured here are stored for reference. For security, the live mail
              transport uses environment variables (<code>SMTP_*</code>) at runtime.
            </p>
            <Grid>
              <F label="Notification Email" error={errors.notifyEmail?.message}><Input {...register("notifyEmail")} disabled={!canEdit} placeholder="admin@financingincanada.com" /></F>
              <F label="From Address"><Input {...register("smtpFrom")} disabled={!canEdit} placeholder="noreply@financingincanada.com" /></F>
              <F label="SMTP Host"><Input {...register("smtpHost")} disabled={!canEdit} /></F>
              <F label="SMTP Port"><Input type="number" {...register("smtpPort")} disabled={!canEdit} /></F>
              <F label="SMTP User"><Input {...register("smtpUser")} disabled={!canEdit} /></F>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Use TLS/SSL</p>
                  <p className="text-xs text-muted-foreground">Secure connection</p>
                </div>
                <Switch checked={watch("smtpSecure")} onCheckedChange={(v) => setValue("smtpSecure", v)} disabled={!canEdit} />
              </div>
            </Grid>
          </Section>
        </TabsContent>
      </Tabs>

      {canEdit ? (
        <div className="mt-6">
          <Button type="submit" variant="gold" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save Settings"}
          </Button>
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          Only Super Admins can modify settings.
        </p>
      )}
    </form>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-card p-6 shadow-card">{children}</div>;
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function F({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
