import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumb,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/55" />
        </div>
      )}
      {!image && <div className="absolute inset-0 -z-10 bg-navy-gradient" />}

      <div className="container-wide relative animate-fade-up py-14 sm:py-16 lg:py-20">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/55">
            <Link href="/" className="hover:text-white">Home</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? <Link href={b.href} className="hover:text-white">{b.label}</Link> : <span className="text-white/80">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{eyebrow}</span>
          </span>
        )}
        <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:mt-5 sm:text-lg">{description}</p>}
        {children}
      </div>
    </section>
  );
}
