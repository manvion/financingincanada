"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, AtSign, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/animations";
import { HERO, STATS } from "@/lib/constants";

const HERO_IMG =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* Full-bleed photograph with an institutional navy wash */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMG}
          alt="Heavy equipment financed across Canada"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/92 to-navy-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
      </div>

      <div className="container-wide">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl py-20 sm:py-24 lg:py-32"
        >
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold sm:w-10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-xs sm:tracking-[0.22em]">
              Equipment Financing · Canada-Wide
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-[2rem] font-semibold leading-[1.12] tracking-tight text-balance sm:mt-6 sm:text-5xl lg:text-[3.5rem]"
          >
            {HERO.headline}
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
            {HERO.subheadline}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild variant="gold" size="lg">
              <Link href="/apply">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">
                <AtSign className="h-4 w-4" /> Contact Us
              </Link>
            </Button>
          </motion.div>

          <motion.p variants={item} className="mt-8 flex items-start gap-2 text-sm text-white/55">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Preferred access to Canada&rsquo;s leading banks, lenders &amp; financial institutions
          </motion.p>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-white/10 bg-navy-950/60 backdrop-blur-sm">
        <div className="container-wide grid grid-cols-2 divide-x divide-y divide-white/10 lg:grid-cols-4 lg:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-7 text-center sm:py-8">
              <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-white/55 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
