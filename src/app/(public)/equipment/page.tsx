import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { EquipmentFilters } from "@/components/site/equipment-filters";
import { ListingCard } from "@/components/site/listing-card";
import { Pagination } from "@/components/site/pagination";
import { getCategories, getListings } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Equipment Listings",
  description:
    "Browse equipment available to finance across Canada — construction, transportation, manufacturing, medical, agricultural, and more.",
  path: "/equipment",
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function EquipmentPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = str(params.category);
  const province = str(params.province);
  const condition = str(params.condition) as "NEW" | "USED" | undefined;
  const q = str(params.q);
  const min = str(params.min) ? Number(str(params.min)) : undefined;
  const max = str(params.max) ? Number(str(params.max)) : undefined;
  const page = Math.max(1, Number(str(params.page) ?? "1") || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getListings({ category, province, condition, q, min, max, page, perPage: 9 }),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Equipment Marketplace"
        title="Find Equipment to Finance"
        description="Explore available equipment across every category and province. Apply on any listing and get a tailored financing quote."
        breadcrumb={[{ label: "Equipment" }]}
        image="https://images.unsplash.com/photo-1579412690850-bd41cd0af56e?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-12 lg:py-16">
        <div className="container-wide">
          <EquipmentFilters categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{result.total}</span>{" "}
              {result.total === 1 ? "result" : "results"}
              {category ? ` in ${categories.find((c) => c.slug === category)?.name ?? category}` : ""}
            </p>
          </div>

          {result.listings.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
              <PackageSearch className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-display text-xl font-semibold">No equipment found</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try adjusting your filters or search terms. New listings are added regularly.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {result.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath="/equipment"
                query={{ category, province, condition, q, min: min?.toString(), max: max?.toString() }}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
