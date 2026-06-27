import type { Metadata } from "next";
import { BadgeCheck, Clock, Lock, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { LeadForm } from "@/components/forms/lead-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Apply for Financing",
  description:
    "Apply online for equipment financing in minutes. Fast approvals, competitive rates, and a dedicated specialist for your business.",
  path: "/apply",
});

const PERKS = [
  { icon: Clock, title: "5-minute application", body: "A short form is all it takes to get started — no lengthy paperwork upfront." },
  { icon: BadgeCheck, title: "Decisions in 24 hours", body: "Our specialists review quickly and present competitive options fast." },
  { icon: Lock, title: "No hard credit pull", body: "Getting a quote won't affect your credit score. Apply with confidence." },
  { icon: ShieldCheck, title: "Bank-grade security", body: "Your information is encrypted and never shared without your consent." },
];

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Equipment Financing Application"
        title="Apply for Financing in Minutes"
        description="Tell us about your business and what you need. A dedicated specialist will reach out with tailored options — usually within one business day."
        breadcrumb={[{ label: "Apply" }]}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="space-y-5 lg:sticky lg:top-24">
            {PERKS.map((perk) => (
              <div key={perk.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-700 dark:text-gold">
                  <perk.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold">{perk.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{perk.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border bg-card p-7 shadow-premium lg:p-9">
            <h2 className="font-display text-2xl font-bold">Financing Application</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              All fields with <span className="text-gold">*</span> are required.
            </p>
            <LeadForm source="APPLICATION" className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
