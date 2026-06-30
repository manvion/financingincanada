import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, Clock, Handshake, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/animations";
import { LeadForm } from "@/components/forms/lead-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vendor & Dealer Financing",
  description:
    "Partner with Financing in Canada to offer your customers fast, flexible equipment financing at the point of sale — close more deals and get paid quickly.",
  path: "/vendors",
});

const BENEFITS = [
  { icon: TrendingUp, title: "Close More Sales", body: "Give buyers an instant financing option at the point of sale and turn browsers into signed deals." },
  { icon: Clock, title: "Fast Turnaround", body: "Your customers receive credit decisions within 24 hours, so deals don't stall waiting on a bank." },
  { icon: Banknote, title: "Get Paid Quickly", body: "We pay you directly and promptly once the deal funds — no waiting on your customer's cash flow." },
  { icon: Handshake, title: "Dedicated Support", body: "A dedicated vendor specialist handles paperwork and keeps every deal moving to funding." },
];

export default function VendorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Vendors & Dealers"
        title="Sell More Equipment with Financing at the Point of Sale"
        description="Offer your customers fast, flexible financing and close more deals. We handle the paperwork — you keep selling and get paid quickly."
        breadcrumb={[{ label: "Vendors" }]}
        image="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why Partner With Us"
            title="A Financing Partner That Helps You Sell"
            description="We make it easy to offer financing your customers can actually qualify for — with a 91% approval rate behind you."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i}>
                <div className="flex h-full flex-col rounded-lg border bg-card p-7 shadow-card">
                  <span className="flex h-10 items-center text-gold-700 dark:text-gold">
                    <b.icon className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 font-display text-base font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-section py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeading
              align="left"
              eyebrow="Become a Vendor Partner"
              title="Let's Grow Your Sales Together"
              description="Tell us about your business and a vendor specialist will reach out to set up your partner program — there's no cost to join."
            />
            <ul className="mt-8 space-y-4">
              {[
                "No cost to become a partner",
                "Dedicated vendor support line",
                "Marketing materials & financing calculators",
                "Same-day quotes for your customers",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <ArrowRight className="h-4 w-4 text-gold" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-7 shadow-card sm:p-8">
            <h3 className="font-display text-xl font-semibold">Vendor Partner Inquiry</h3>
            <p className="mt-1 text-sm text-muted-foreground">Join our vendor network — we&rsquo;ll be in touch shortly.</p>
            <LeadForm source="CONTACT_PAGE" className="mt-6" compact defaultEquipment="Vendor partnership inquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
