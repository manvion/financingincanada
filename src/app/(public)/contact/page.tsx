import type { Metadata } from "next";
import { BadgeCheck, Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { getSettings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE, LOCATIONS, SERVICE_AREA } from "@/lib/constants";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get a free, no-obligation equipment financing quote. Email us or send a message and a specialist will respond within one business day. Serving businesses across Canada.",
  path: "/contact",
});

export const dynamic = "force-dynamic";

const TRUST = [
  { icon: BadgeCheck, text: "Reply within one business day" },
  { icon: ShieldCheck, text: "No obligation · no hard credit pull" },
  { icon: Clock, text: "Decisions in as little as 24 hours" },
];

export default async function ContactPage() {
  const settings = await getSettings();
  const email = settings?.email ?? SITE.email;
  const hours = (settings?.businessHours as { weekdays?: string; saturday?: string; sunday?: string } | null) ?? {
    weekdays: "8:00 AM – 5:00 PM PST",
    saturday: "8:00 AM – 5:00 PM PST",
    sunday: "8:00 AM – 5:00 PM PST",
  };

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's Finance Your Growth"
        description="Have a question or want a tailored quote? Send a message and a financing specialist will get back to you within one business day."
        breadcrumb={[{ label: "Contact" }]}
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-16 lg:py-24">
        <div className="container-wide grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left: reassurance + contact info */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div>
              <h2 className="font-display text-2xl font-semibold">The fastest way to a quote</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                The form is the quickest route to a personalized financing quote. Tell us what you
                need and a dedicated specialist will reach out — usually within one business day.
              </p>
              <ul className="mt-6 space-y-3">
                {TRUST.map((t) => (
                  <li key={t.text} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold/12 text-gold-700 dark:text-gold">
                      <t.icon className="h-4 w-4" />
                    </span>
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card transition-colors hover:border-gold/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy text-gold">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Email Us</p>
                <p className="font-semibold text-foreground">{email}</p>
              </div>
            </a>

            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gold" />
                <h3 className="font-display text-base font-semibold">Areas We Serve</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{SERVICE_AREA.note}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Canada-wide", ...LOCATIONS].map((loc) => (
                  <span key={loc} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold" />
                <h3 className="font-display text-base font-semibold">Business Hours</h3>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Mon – Fri</dt><dd className="font-medium">{hours.weekdays}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Saturday</dt><dd className="font-medium">{hours.saturday}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Sunday</dt><dd className="font-medium">{hours.sunday}</dd></div>
              </dl>
            </div>
          </div>

          {/* Right: prominent form */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-premium ring-1 ring-gold/10">
            <div className="relative bg-navy-gradient px-7 py-8 text-white sm:px-9">
              <span className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Free Quote</span>
              </span>
              <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Send Us a Message</h2>
              <p className="mt-2 max-w-md text-sm text-white/70">
                Fill out the form below and we&rsquo;ll be in touch shortly. It only takes a minute.
              </p>
            </div>
            <div className="p-7 sm:p-9">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
