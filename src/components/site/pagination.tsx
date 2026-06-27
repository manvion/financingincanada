import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  query = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items: (number | "…")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (prev && p - prev > 1) items.push("…");
    items.push(p);
    prev = p;
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <PageLink href={href(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </PageLink>
      {items.map((item, i) =>
        item === "…" ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <PageLink key={item} href={href(item)} active={item === page}>
            {item}
          </PageLink>
        )
      )}
      <PageLink href={href(page + 1)} disabled={page >= totalPages} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...props
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const className = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
    active
      ? "border-gold bg-gold text-navy"
      : "border-border bg-card text-foreground hover:bg-secondary",
    disabled && "pointer-events-none opacity-40"
  );
  if (disabled) return <span className={className} {...props}>{children}</span>;
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
