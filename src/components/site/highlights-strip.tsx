import { CheckCircle2 } from "lucide-react";

const HIGHLIGHTS = [
  "100% financing with no down payment",
  "Terms from 12 to 84 months",
  "Decisions within 24 hours",
  "New, used & private-sale equipment",
];

export function HighlightsStrip() {
  return (
    <section className="border-b bg-section">
      <div className="container-wide grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {HIGHLIGHTS.map((h) => (
          <div
            key={h}
            className="flex items-start gap-3 py-5 text-sm font-medium leading-snug sm:px-6 sm:first:pl-0 lg:last:pr-0"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span>{h}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
