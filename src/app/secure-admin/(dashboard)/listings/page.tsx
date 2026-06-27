import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, PROVINCE_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant = {
  PUBLISHED: "success",
  DRAFT: "secondary",
  UNPUBLISHED: "warning",
  SOLD: "destructive",
} as const;

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { order: "asc" }, take: 1 }, _count: { select: { leads: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Equipment Listings"
        description={`${listings.length} total listings`}
        action={
          <Button asChild variant="gold">
            <Link href="/secure-admin/listings/new"><Plus className="h-4 w-4" /> New Listing</Link>
          </Button>
        }
      />

      {listings.length === 0 ? (
        <EmptyState title="No listings yet" description="Create your first equipment listing to get started." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Equipment</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Leads</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          {l.images[0] && (
                            <Image src={l.images[0].url} alt={l.title} fill sizes="64px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{l.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {l.condition === "NEW" ? "New" : "Used"}{l.featured ? " · Featured" : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{l.category.name}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(Number(l.price))}</td>
                    <td className="px-4 py-3 text-muted-foreground">{PROVINCE_LABELS[l.province]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l._count.leads}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/equipment/${l.slug}`}
                          target="_blank"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
                          title="View live"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/secure-admin/listings/${l.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-secondary"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton endpoint={`/api/admin/listings/${l.id}`} iconOnly />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
