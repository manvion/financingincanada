import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "@/components/admin/listing-form";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });

  return (
    <div>
      <Link href="/admin/listings" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>
      <h2 className="mb-6 font-display text-xl font-bold">New Equipment Listing</h2>
      <ListingForm categories={categories} />
    </div>
  );
}
