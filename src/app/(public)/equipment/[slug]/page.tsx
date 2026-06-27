import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, Calendar, MapPin, Tag, Wrench } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ImageGallery } from "@/components/site/image-gallery";
import { ListingCard } from "@/components/site/listing-card";
import { LeaseCalculator } from "@/components/site/lease-calculator";
import { LeadForm } from "@/components/forms/lead-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, PROVINCE_LABELS } from "@/lib/utils";
import { getListingBySlug, getRelatedListings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const revalidate = 300; // ISR — CDN-cached, regenerated every 5 min

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return buildMetadata({ title: "Equipment Not Found", noIndex: true });
  return buildMetadata({
    title: listing.metaTitle || listing.title,
    description: listing.metaDescription || listing.description.slice(0, 155),
    path: `/equipment/${listing.slug}`,
    image: listing.images[0]?.url,
    type: "article",
  });
}

export default async function ListingDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const related = await getRelatedListings(listing.categoryId, listing.id, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images.map((i) => i.url),
    category: listing.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: listing.price,
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/equipment/${listing.slug}`,
    },
  };

  return (
    <>
      <PageHero
        eyebrow={listing.category.name}
        title={listing.title}
        description={`${listing.condition === "NEW" ? "New" : "Used"} · ${
          listing.city ? `${listing.city}, ` : ""
        }${PROVINCE_LABELS[listing.province]}`}
      />

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <Link
            href="/equipment"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all equipment
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <ImageGallery images={listing.images} title={listing.title} />

              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold">Description</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/85">
                  {listing.description}
                </p>
              </div>

              {listing.specifications.length > 0 && (
                <div className="mt-10">
                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                    <Wrench className="h-5 w-5 text-gold" /> Specifications
                  </h2>
                  <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
                    {listing.specifications.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 bg-card px-5 py-4">
                        <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                        <dd className="text-sm font-semibold text-foreground">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <Meta icon={Tag} label="Condition" value={listing.condition === "NEW" ? "New" : "Used"} />
                <Meta icon={MapPin} label="Location" value={`${listing.city ? listing.city + ", " : ""}${listing.province}`} />
                {listing.year && <Meta icon={Calendar} label="Year" value={String(listing.year)} />}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border bg-card p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <Badge variant={listing.condition === "NEW" ? "new" : "used"}>
                    {listing.condition === "NEW" ? "New" : "Used"}
                  </Badge>
                  {listing.featured && <Badge variant="gold">Featured</Badge>}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Purchase price</p>
                <p className="font-display text-4xl font-bold text-foreground">
                  {formatCurrency(listing.price)}
                </p>
                {listing.monthlyPayment ? (
                  <div className="mt-3 rounded-xl bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Estimated monthly payment</p>
                    <p className="font-display text-2xl font-bold text-gold-700 dark:text-gold">
                      {formatCurrency(listing.monthlyPayment)}
                      <span className="text-base font-medium text-muted-foreground">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      *Estimate based on 60-month term, OAC. Final terms vary.
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/[0.06] px-3 py-2.5 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  <span className="text-foreground/90">
                    Located in {listing.city ? `${listing.city}, ` : ""}
                    {PROVINCE_LABELS[listing.province]} — <span className="font-semibold">financing available Canada-wide</span>
                  </span>
                </div>

                <Separator className="my-6" />

                <h3 className="font-display text-lg font-bold">Inquire About This Equipment</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get a personalized financing quote — no obligation.
                </p>
                <LeadForm
                  source="LISTING"
                  listingId={listing.id}
                  defaultEquipment={listing.title}
                  compact
                  className="mt-5"
                />
              </div>
            </aside>
          </div>

          {/* Payment calculator — pre-filled with this listing's price */}
          <div className="mt-16 border-t pt-12">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Lease &amp; Finance Calculator</span>
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Estimate Payments on This Equipment</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Pre-filled with this listing&rsquo;s price of {formatCurrency(listing.price)}. Switch between
              financing and leasing, then adjust the term and rate to model your payment.
            </p>
            <LeaseCalculator className="mt-8" defaultAmount={listing.price} />
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-2xl font-bold">Similar Equipment</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <ListingCard key={r.id} listing={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Script id="product-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <Icon className="h-5 w-5 text-gold" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
