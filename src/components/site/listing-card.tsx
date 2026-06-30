import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, PROVINCE_LABELS } from "@/lib/utils";

export type ListingCardData = {
  id: string;
  slug: string;
  title: string;
  price: number | string;
  monthlyPayment: number | string | null;
  condition: "NEW" | "USED";
  province: string;
  city?: string | null;
  category: { name: string };
  images: { url: string; alt?: string | null }[];
  featured?: boolean;
  status?: string;
};

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const cover = listing.images[0]?.url ?? "/placeholder.jpg";
  const sold = listing.status === "SOLD";
  return (
    <Link
      href={`/equipment/${listing.slug}`}
      className="card-premium group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={cover}
          alt={listing.images[0]?.alt ?? listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${sold ? "grayscale-[35%]" : ""}`}
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant={listing.condition === "NEW" ? "new" : "used"}>
            {listing.condition === "NEW" ? "New" : "Used"}
          </Badge>
          {listing.featured && !sold && <Badge variant="gold">Featured</Badge>}
        </div>
        {sold && (
          <>
            <div className="absolute inset-0 bg-navy-950/25" />
            <div className="absolute -right-12 top-5 rotate-45 bg-red-600 px-14 py-1.5 text-center text-sm font-bold uppercase tracking-widest text-white shadow-lg">
              Sold
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold">
          {listing.category.name}
        </span>
        <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {listing.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {listing.city ? `${listing.city}, ` : ""}
          {PROVINCE_LABELS[listing.province] ?? listing.province}
        </p>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-display text-xl font-bold text-foreground">
              {formatCurrency(listing.price)}
            </p>
            {listing.monthlyPayment ? (
              <p className="text-xs text-muted-foreground">
                or{" "}
                <span className="font-semibold text-gold-700 dark:text-gold">
                  {formatCurrency(listing.monthlyPayment)}/mo
                </span>
              </p>
            ) : null}
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-gold group-hover:text-navy">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
