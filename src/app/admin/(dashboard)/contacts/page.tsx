import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { StatusControl } from "@/components/admin/status-control";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const contacts = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description={`${contacts.length} messages from contact forms`} />

      {contacts.length === 0 ? (
        <EmptyState title="No messages yet" description="Messages submitted through your contact forms will appear here." />
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold">{c.name}</h3>
                    <span className="text-xs text-muted-foreground">· {formatDate(c.createdAt)}</span>
                  </div>
                  {c.subject && <p className="mt-0.5 text-sm font-medium text-gold-700 dark:text-gold">{c.subject}</p>}
                  <div className="mt-2 flex flex-wrap gap-4">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <Mail className="h-3 w-3" /> {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusControl endpoint={`/api/admin/contacts/${c.id}`} initial={c.status} />
                  <DeleteButton endpoint={`/api/admin/contacts/${c.id}`} iconOnly />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line rounded-lg bg-secondary/50 p-4 text-sm text-foreground/85">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
