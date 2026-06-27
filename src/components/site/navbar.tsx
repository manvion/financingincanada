"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Mail, MapPin, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      // Hysteresis: collapse once past 64px, only re-expand near the very top (<8px).
      // This prevents the header from flip-flopping (rattling) around a single threshold.
      setScrolled((prev) => (prev ? y > 8 : y > 64));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Utility bar */}
      <div
        className={cn(
          "hidden border-b border-white/10 bg-navy-950 text-white/70 transition-all duration-300 lg:block",
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="container-wide flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              Serving Canada-wide
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gold" />
              Mon–Sun 8AM–5PM PST
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 font-medium text-white transition-colors hover:text-gold">
              <Mail className="h-3.5 w-3.5 text-gold" /> {SITE.email}
            </a>
            <Link href="/contact" className="text-white/50 transition-colors hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "w-full border-b transition-all duration-300",
          scrolled
            ? "border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75"
            : "border-transparent bg-background"
        )}
      >
        <div className="container-wide flex h-18 items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors",
                    active ? "text-navy dark:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active && <span className="absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-gold" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <ThemeToggle />
            <Button asChild variant="gold" size="sm">
              <Link href="/apply">Get Started</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border/60 text-foreground"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-b border-border bg-background lg:hidden">
          <nav className="container-wide flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wide text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="gold" className="mt-3 w-full">
              <Link href="/apply">Get Started</Link>
            </Button>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <Mail className="h-4 w-4 text-gold" /> {SITE.email}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
