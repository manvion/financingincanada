import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/admin/listing-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, categories] = await Promise.all([
    prisma.listing.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!listing) notFound();

  const initial = {
    title: listing.title,
    slug: listing.slug,
    description: listing.description,
    categoryId: listing.categoryId,
    price: Number(listing.price),
    monthlyPayment: listing.monthlyPayment ? Number(listing.monthlyPayment) : undefined,
    condition: listing.condition,
    province: listing.province,
    city: listing.city ?? "",
    year: listing.year ?? undefined,
    make: listing.make ?? "",
    model: listing.model ?? "",
    status: listing.status,
    featured: listing.featured,
    metaTitle: listing.metaTitle ?? "",
    metaDescription: listing.metaDescription ?? "",
    specifications: (listing.specifications as { label: string; value: string }[] | null) ?? [{ label: "", value: "" }],
    images: listing.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })),
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/secure-admin/listings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>
        <DeleteButton endpoint={`/api/admin/listings/${listing.id}`} redirectTo="/secure-admin/listings" label="Delete listing" />
      </div>
      <h2 className="mb-6 font-display text-xl font-bold">Edit Listing</h2>
      <ListingForm categories={categories} initial={initial} listingId={listing.id} />
    </div>
  );
}
