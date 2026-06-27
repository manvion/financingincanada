import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { DynamicIcon } from "@/components/site/icon";
import { Stagger, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { INDUSTRIES } from "@/lib/industries";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Equipment financing for construction, transportation, manufacturing, agriculture, medical, aviation, technology, hospitality, oil & mining, and forestry businesses across Canada.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries We Serve"
        title="Financing for Every Sector in Canada"
        description="We finance new and used equipment across the industries that build, move, and feed the country — from a single asset to an entire fleet."
        breadcrumb={[{ label: "Industries" }]}
        image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Sector Expertise"
            title="A Specialist for Your Industry"
            description="Our financing specialists understand the equipment, cycles, and economics of the sectors we serve."
          />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry) => (
              <StaggerItem key={industry.name}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-premium"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent" />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-md bg-navy/80 text-gold backdrop-blur-sm">
                      <DynamicIcon name={industry.icon} className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground">{industry.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {industry.summary}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                      Explore financing <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t bg-section py-16">
        <div className="container-wide flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold">Don&rsquo;t see your industry?</h2>
            <p className="mt-2 text-muted-foreground">We finance equipment across nearly every sector. Let&rsquo;s talk.</p>
          </div>
          <Button asChild variant="gold" size="lg"><Link href="/contact">Contact a Specialist</Link></Button>
        </div>
      </section>
    </>
  );
}
