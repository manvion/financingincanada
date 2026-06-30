import { LENDERS } from "@/lib/constants";

export function LenderMarquee() {
  // Duplicate the track so the loop is seamless.
  const track = [...LENDERS, ...LENDERS];

  return (
    <section className="border-b bg-background py-10">
      <div className="container-wide">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Preferred access to Canada&rsquo;s leading banks &amp; lenders
        </p>

        <div className="group relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused]">
            {track.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-navy/45 transition-colors hover:text-navy dark:text-white/40 dark:hover:text-white"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
