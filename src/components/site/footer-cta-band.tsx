"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterCtaBand() {
  const pathname = usePathname();
  // The homepage has its own lead-capture CTA, so skip the band there to avoid
  // two stacked calls-to-action.
  if (pathname === "/") return null;

  return (
    <div className="border-b border-white/10">
      <div className="container-wide flex flex-col items-center justify-between gap-6 py-12 text-center md:flex-row md:text-left">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Ready to finance your next piece of equipment?
          </h2>
          <p className="mt-2 text-white/60">
            Apply in under five minutes and get a decision within 24 hours.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link href="/apply">Get Started <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
