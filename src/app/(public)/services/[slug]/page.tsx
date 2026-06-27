import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { HighlightsStrip } from "@/components/site/highlights-strip";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { DynamicIcon } from "@/components/site/icon";
import { Reveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getService, SERVICES } from "@/lib/services";
import { HOW_IT_WORKS, FAQS } from "@/lib/constants";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return buildMetadata({ title: "Service Not Found", noIndex: true });
  return buildMetadata({
    title: service.headline,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Sibling services for cross-navigation
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Financing Service"
        title={service.headline}
        description={service.summary}
        breadcrumb={[{ label: "Services", href: "/services" }, { label: service.shortTitle }]}
        image={service.image}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/apply">Get Started <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/contact">Talk to a Specialist</Link>
          </Button>
        </div>
      </PageHero>

      <HighlightsStrip />

      {/* Overview + best-for */}
      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Overview</span>
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              What is {service.title.toLowerCase()}?
            </h2>
            {service.intro.map((p, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">{p}</p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold"><Link href="/apply">Apply Now</Link></Button>
              <Button asChild variant="outline"><Link href="/contact">Get a Quote</Link></Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7 shadow-card sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-gold">
                <DynamicIcon name={service.icon} className="h-5 w-5" />
              </span>
              Best for
            </h3>
            <ul className="mt-6 space-y-3">
              {service.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t pt-5 text-sm text-muted-foreground">
              Not sure if this is the right fit?{" "}
              <Link href="/contact" className="font-medium text-gold hover:underline">Ask a specialist</Link> — we&rsquo;ll
              recommend the best structure for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* Features / what's included */}
      <section className="border-y bg-section py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Key Benefits"
            title={`Why choose ${service.title.toLowerCase()}`}
            description="The advantages that make this one of the most popular ways Canadian businesses acquire equipment."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <Reveal key={f.title} delay={i}>
                <div className="flex h-full gap-4 rounded-lg border bg-card p-6 shadow-card">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold/12 text-gold-700 dark:text-gold">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading eyebrow="A Simple Process" title="Apply in Minutes. Funded in Days." />
          <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-border lg:block" />
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.step} delay={i} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-background font-display text-xl font-semibold text-gold">
                    {step.step}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y bg-section py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Financing Questions"
            description="Common questions about financing equipment with us. Still unsure? Our specialists are happy to help."
            className="lg:sticky lg:top-24 lg:self-start"
          />
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      {/* Other services */}
      <section className="border-t bg-section py-16">
        <div className="container-wide">
          <h2 className="font-display text-xl font-bold">Explore other services</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center justify-between gap-3 rounded-lg border bg-card p-5 shadow-card transition-colors hover:border-gold/40"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/12 text-gold-700 dark:text-gold">
                    <DynamicIcon name={s.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm font-semibold">{s.shortTitle}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
