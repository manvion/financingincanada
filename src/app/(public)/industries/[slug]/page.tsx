import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { HighlightsStrip } from "@/components/site/highlights-strip";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { DynamicIcon } from "@/components/site/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getIndustry, INDUSTRIES } from "@/lib/industries";
import { WHY_CHOOSE_US, HOW_IT_WORKS, FAQS } from "@/lib/constants";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return buildMetadata({ title: "Industry Not Found", noIndex: true });
  return buildMetadata({
    title: industry.headline,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    image: industry.image,
  });
}

export default async function IndustryDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${industry.name} Financing`}
        title={industry.headline}
        description={industry.summary}
        breadcrumb={[{ label: "Industries", href: "/industries" }, { label: industry.name }]}
        image={industry.image}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/apply">Get Started <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href={`/equipment?category=${industry.categorySlug}`}>Browse {industry.name} Equipment</Link>
          </Button>
        </div>
      </PageHero>

      <HighlightsStrip />

      {/* Overview + equipment list */}
      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Overview</span>
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {industry.name} financing, done right
            </h2>
            {industry.intro.map((p, i) => (
              <p key={i} className="mt-5 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold"><Link href="/apply">Apply Now</Link></Button>
              <Button asChild variant="outline"><Link href="/contact">Talk to a Specialist</Link></Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7 shadow-card sm:p-8">
            <h3 className="flex items-center gap-3 font-display text-xl font-semibold">
              <span className="flex h-10 w-10 items-center justify-center text-gold-700 dark:text-gold">
                <DynamicIcon name={industry.icon} className="h-6 w-6" />
              </span>
              {industry.name} Equipment We Finance
            </h3>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {industry.equipment.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t pt-5 text-sm text-muted-foreground">
              Don&rsquo;t see your equipment? We finance nearly anything in the sector —{" "}
              <Link href="/contact" className="font-medium text-gold hover:underline">just ask</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y bg-section py-20 lg:py-28">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Why Financing in Canada"
            title="Access to Canada's Leading Lenders"
            description="We shop our national network of banks, financial institutions, and private lenders to secure the right structure for your business."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.slice(0, 6).map((item, i) => (
              <Reveal key={item.title} delay={i} className="h-full">
                <div className="flex h-full gap-4 rounded-lg border bg-card p-6 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center text-gold-700 dark:text-gold">
                    <DynamicIcon name={item.icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
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
      <section className="bg-section py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={`${industry.name} Financing Questions`}
            description="Common questions about financing equipment in your industry. Still unsure? Our specialists are happy to help."
            className="lg:sticky lg:top-24 lg:self-start"
          />
          <FaqAccordion items={FAQS} />
        </div>
      </section>
    </>
  );
}
