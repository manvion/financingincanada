import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Logo } from "@/components/logo";
import { FooterCtaBand } from "@/components/site/footer-cta-band";
import { SITE } from "@/lib/constants";
import { getSettings } from "@/lib/queries";

const footerNav = {
  Services: [
    { href: "/services/equipment-leasing", label: "Equipment Leasing" },
    { href: "/services/sale-leaseback", label: "Sale & Leaseback" },
    { href: "/services/used-equipment-financing", label: "Used Equipment" },
    { href: "/services/pre-approvals", label: "Pre-Approvals" },
    { href: "/services/small-business-loans", label: "Small Business Loans" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/industries", label: "Industries" },
    { href: "/vendors", label: "Vendors" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Resources: [
    { href: "/apply", label: "Apply Now" },
    { href: "/equipment", label: "Equipment Listings" },
    { href: "/services", label: "Financing Services" },
    { href: "/blog", label: "Financing Guides" },
  ],
};

export async function Footer() {
  const settings = await getSettings().catch(() => null);
  const email = settings?.email || SITE.email;
  const socials = [
    { Icon: Linkedin, href: settings?.linkedinUrl },
    { Icon: Facebook, href: settings?.facebookUrl },
    { Icon: Instagram, href: settings?.instagramUrl },
    { Icon: Twitter, href: settings?.twitterUrl },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-950 text-white">
      <FooterCtaBand />

      <div className="container-wide py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {SITE.tagline}. Fast approvals, competitive rates, and flexible terms for businesses
              across every province and territory.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-gold hover:text-gold"
                    aria-label="Social link"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{heading}</h3>
              <ul className="mt-5 space-y-3">
                {links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2">
          <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white">
            <Mail className="h-4 w-4 text-gold" /> {email}
          </a>
          <span className="flex items-center gap-2.5 text-sm text-white/60 sm:justify-end">
            <MapPin className="h-4 w-4 text-gold" /> Proudly serving businesses Canada-wide
          </span>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/80">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/80">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
