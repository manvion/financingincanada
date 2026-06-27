"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  name: string;
  company?: string | null;
  role?: string | null;
  quote: string;
  rating: number;
};

export function AnimatedTestimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState(1);
  const count = items.length;

  const go = React.useCallback(
    (next: number) => {
      setDir(next > index || (index === count - 1 && next === 0) ? 1 : -1);
      setIndex((next + count) % count);
    },
    [index, count]
  );

  React.useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => go(index + 1), 6500);
    return () => clearInterval(t);
  }, [index, count, go]);

  if (count === 0) return null;
  const t = items[index];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card sm:p-12">
        <Quote className="h-10 w-10 text-gold/30" />
        <div className="relative mt-4 min-h-[180px] sm:min-h-[150px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback>
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}
                    {t.company ? `, ${t.company}` : ""}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-between border-t pt-6">
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-gold" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next testimonial"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
