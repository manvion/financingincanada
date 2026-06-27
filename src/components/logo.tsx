import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
  href = "/",
}: {
  className?: string;
  variant?: "dark" | "light";
  href?: string | null;
}) {
  const light = variant === "light";

  const inner = (
    <span className={cn("flex flex-col leading-none", className)}>
      {/* Wordmark */}
      <span
        className={cn(
          "whitespace-nowrap font-display text-[19px] font-semibold tracking-[0.01em] sm:text-[21px]",
          light ? "text-white" : "text-navy dark:text-white"
        )}
      >
        Financing
        <span className="px-[0.18em] align-[0.02em] text-[0.72em] font-normal italic text-gold">in</span>
        Canada
      </span>

      {/* Tagline lockup with hairline rules */}
      <span className="mt-[7px] flex items-center gap-2">
        <span className="h-px w-3.5 bg-gold/80" />
        <span
          className={cn(
            "text-[8.5px] font-semibold uppercase tracking-[0.34em]",
            light ? "text-white/55" : "text-muted-foreground"
          )}
        >
          Equipment Finance
        </span>
        <span className={cn("h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent", light ? "opacity-70" : "")} />
      </span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} aria-label="Financing in Canada — home" className="inline-flex">
      {inner}
    </Link>
  );
}
