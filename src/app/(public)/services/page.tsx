import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { HighlightsStrip } from "@/components/site/highlights-strip";
import { DynamicIcon } from "@/components/site/icon";
import { Stagger, StaggerItem } from "@/components/animations";
import { buildMetadata } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = buildMetadata({
  title: "Financing Services",
  description:
    "Equipment leasing, sale-leaseback, used and private-sale financing, auction pre-approvals, cross-border financing, and small business loans across Canada.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Offer"
        title="Financing Services Built for Business"
        description="From leasing to sale-leasebacks, we structure the right solution for the way your business actually operates."
        breadcrumb={[{ label: "Services" }]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
      />

      <HighlightsStrip />

      {/* Services */}
      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Our Services"
            title="Six Ways We Help You Acquire Equipment"
            description="Every solution is structured around your cash flow and explained clearly by a dedicated specialist. Select a service to learn more."
          />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <StaggerItem key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border bg-card p-7 shadow-card transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-premium"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-700 ring-1 ring-gold/15 transition-all duration-300 group-hover:scale-105 group-hover:bg-gold/20 dark:text-gold">
                    <DynamicIcon name={service.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
