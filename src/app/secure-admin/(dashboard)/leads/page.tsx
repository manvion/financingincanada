import { Download, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { StatusControl } from "@/components/admin/status-control";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { requireSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const sourceLabel: Record<string, string> = {
  HOMEPAGE: "Homepage",
  LISTING: "Listing",
  APPLICATION: "Application",
  CONTACT_PAGE: "Contact",
};

export default async function AdminLeadsPage() {
  await requireSuperAdmin();
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { title: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Leads"
        description={`${leads.length} financing inquiries`}
        action={
          <Button asChild variant="outline">
            <a href="/api/admin/leads/export"><Download className="h-4 w-4" /> Export CSV</a>
          </Button>
        }
      />

      {leads.length === 0 ? (
        <EmptyState title="No leads yet" description="Financing inquiries from your website will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Equipment</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-top transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      {lead.company && <p className="text-xs text-muted-foreground">{lead.company}</p>}
                      <div className="mt-1 flex flex-col gap-0.5">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </a>
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.equipmentNeeded ?? lead.listing?.title ?? "—"}
                      {lead.message && <p className="mt-1 max-w-xs text-xs text-muted-foreground/80 line-clamp-2">{lead.message}</p>}
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary">{sourceLabel[lead.source]}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3"><StatusControl endpoint={`/api/admin/leads/${lead.id}`} initial={lead.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <DeleteButton endpoint={`/api/admin/leads/${lead.id}`} iconOnly />
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
