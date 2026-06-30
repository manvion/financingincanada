import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, Compass, Eye, Handshake, ShieldCheck, Target, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/animations";
import { AnimatedCounter } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Financing in Canada helps businesses across every province secure fast, flexible equipment financing with bank-grade rigor and specialist speed.",
  path: "/about",
});

const VALUES = [
  { icon: Handshake, title: "Partnership", description: "We succeed when you do. Every approval is structured around your long-term growth, not a one-time transaction." },
  { icon: ShieldCheck, title: "Integrity", description: "Transparent terms, no hidden fees, and honest guidance — even when it means recommending you wait." },
  { icon: Award, title: "Excellence", description: "Bank-grade underwriting paired with concierge service from a dedicated specialist who knows your file." },
  { icon: Users, title: "Accessibility", description: "From sole proprietors to national fleets, we make financing approachable for businesses of every size." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Financing in Canada"
        title="Helping Canadian Businesses Finance Their Growth"
        description="We're a specialist equipment financing partner built for the way modern Canadian businesses actually operate — fast, flexible, and relationship-first."
        breadcrumb={[{ label: "About" }]}
        image="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Intro + image */}
      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border shadow-premium">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Financing in Canada team partnering with a business client"
                  width={720}
                  height={620}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
              </div>
              {/* Floating stat badge */}
              <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border bg-card p-5 shadow-premium sm:block">
                <p className="font-display text-3xl font-bold text-gold">
                  <AnimatedCounter value={91} suffix="%" />
                </p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">Applications Approved</p>
              </div>
              <div className="absolute -left-3 -top-3 -z-10 h-24 w-24 rounded-2xl border-2 border-gold/30" />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <span className="eyebrow"><span className="h-px w-6 bg-gold" />Who We Are</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A financing partner that moves at the speed of business
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Traditional lenders weren't built for the realities of acquiring equipment — long
              waits, rigid terms, and bankers who've never set foot on a job site. Financing in
              Canada was founded to change that.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We combine a national network of lenders with specialists who understand your
              industry, so you get competitive rates, flexible structures, and approvals in as
              little as 24 hours — all without sacrificing the rigor you'd expect from an
              institution.
            </p>
            <Button asChild variant="gold" className="mt-7">
              <Link href="/apply">Start Your Application</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-navy-gradient py-16 text-white">
        <div className="container-wide grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-bold text-gold">
                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-white/65">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Why */}
      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", body: "To empower Canadian businesses to grow by making equipment financing fast, fair, and refreshingly simple." },
            { icon: Eye, title: "Our Vision", body: "To be the most trusted equipment financing partner in Canada — the first call businesses make when it's time to invest." },
            { icon: Compass, title: "Why Financing in Canada", body: "Specialist expertise, a national lender network, and a dedicated human who stays with you from application to funding." },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i}>
              <div className="card-premium group flex h-full flex-col rounded-2xl border bg-card p-8 shadow-card">
                <span className="flex h-10 items-center text-gold-700 transition-transform duration-300 group-hover:scale-110 dark:text-gold">
                  <card.icon className="h-8 w-8" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-section py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading eyebrow="Our Values" title="What We Stand For" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i}>
                <div className="card-premium group flex h-full flex-col rounded-2xl border bg-card p-7 shadow-card">
                  <span className="flex h-10 items-center text-gold-700 transition-transform duration-300 group-hover:scale-110 dark:text-gold">
                    <v.icon className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl bg-navy-gradient px-8 py-14 text-center text-white lg:px-16">
            <div className="absolute inset-0 bg-radial-gold" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Let's finance your growth
              </h2>
              <p className="mt-4 text-white/70">
                Talk to a dedicated specialist today and discover what your business qualifies for.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg"><Link href="/apply">Apply Now</Link></Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
