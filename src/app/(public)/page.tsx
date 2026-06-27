import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { LenderMarquee } from "@/components/home/lender-marquee";
import { SectionHeading } from "@/components/site/section-heading";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { DynamicIcon } from "@/components/site/icon";
import { Reveal } from "@/components/animations";
import { LeadForm } from "@/components/forms/lead-form";
import { Button } from "@/components/ui/button";
import { WHY_CHOOSE_US, HOW_IT_WORKS, FAQS } from "@/lib/constants";

const GALLERY = [
  { label: "Construction", src: "photo-1581094794329-c8112a89af12" },
  { label: "Transportation", src: "photo-1601584115197-04ecc0da31d7" },
  { label: "Manufacturing", src: "photo-1565043666747-69f6646db940" },
  { label: "Agriculture", src: "photo-1530267981375-f0de937f5f13" },
  { label: "Technology", src: "photo-1558494949-ef010cbdcc31" },
  { label: "Hospitality", src: "photo-1556910103-1c02745aae4d" },
];
const galleryImg = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=75`;

export default function HomePage() {
  return (
    <>
      <Hero />

      <LenderMarquee />

      {/* ── Equipment gallery (social proof) ─────────────── */}
      <section className="py-20 lg:py-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Coast to Coast"
            title="Equipment We Help Finance"
            description="From a single machine to an entire fleet — we fund the equipment Canadian businesses run on, in every province and sector."
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {GALLERY.map((g, i) => (
              <Reveal key={g.label} delay={i % 6}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border shadow-card">
                  <Image
                    src={galleryImg(g.src)}
                    alt={`${g.label} equipment financing`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold uppercase tracking-wide text-white">
                    {g.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why Financing in Canada"
            title="The Financing Partner Canadian Businesses Trust"
            description="Bank-grade rigor with the speed, approval rates, and flexibility of a dedicated equipment finance specialist."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map((item, i) => (
              <Reveal key={item.title} delay={i} className="h-full">
                <div className="card-premium group flex h-full gap-4 rounded-lg border bg-card p-6 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gold/12 text-gold-700 dark:text-gold transition-transform duration-300 group-hover:scale-110">
                    <DynamicIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="border-y border-t-gold bg-section py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="A Simple Process"
            title="Apply in Minutes. Funded in Days."
            description="From application to approval, our streamlined process gets your equipment working for you — fast."
          />
          <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block" />
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.step} delay={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-background font-display text-xl font-semibold text-gold">
                    {step.step}
                  </span>
                  <span className="mt-5 flex h-11 w-11 items-center justify-center rounded-md bg-card text-navy shadow-card dark:text-white">
                    <DynamicIcon name={step.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="gold" size="lg">
              <Link href="/apply">Start Your Application <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="border-y border-t-gold bg-section py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="Frequently Asked Questions"
            title="Answers Before You Apply"
            description="Everything you need to know about financing equipment with us. Still have questions? Our specialists are a phone call away."
            className="lg:sticky lg:top-24 lg:self-start"
          />
          <Reveal>
            <FaqAccordion items={FAQS} />
          </Reveal>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* ── Contact / CTA ────────────────────────────────── */}
      <section id="contact" className="bg-navy-gradient py-20 text-white lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Get Started</span>
            </div>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Get your free, no-obligation quote
            </h2>
            <p className="mt-4 max-w-md text-white/70">
              Tell us what you need and a dedicated financing specialist will reach out — usually
              within one business day. No hard credit pull to get started.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Credit decision within 24 hours",
                "100% financing — no down payment required",
                "Flexible terms from 12 to 84 months",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white p-6 shadow-premium dark:bg-card sm:p-8">
            <h3 className="font-display text-xl font-semibold text-foreground">Get a Free Quote</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Apply in under five minutes — no obligation.
            </p>
            <LeadForm source="HOMEPAGE" className="mt-6" compact />
          </div>
        </div>
      </section>
    </>
  );
}
