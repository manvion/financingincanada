"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const item = {
    hidden: { opacity: 0, y: 22 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.1 } }),
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <motion.span variants={item} custom={0} className={cn("eyebrow", align === "center" && "justify-center")}>
          <motion.span
            className="h-px w-6 bg-gold"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
            style={{ originX: 0 }}
          />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={item}
        custom={1}
        className={cn(
          "mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={item}
          custom={2}
          className={cn("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-muted-foreground")}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
