import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader, EmptyState } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Pagination } from "@/components/site/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

const statusVariant = { PUBLISHED: "success", DRAFT: "secondary", SCHEDULED: "warning" } as const;

type SearchParams = Promise<{ page?: string }>;

export default async function AdminBlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  const [total, blogs] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        description={`${total} total posts`}
        action={
          <Button asChild variant="gold">
            <Link href="/secure-admin/blog/new"><Plus className="h-4 w-4" /> New Post</Link>
          </Button>
        }
      />

      {blogs.length === 0 ? (
        <EmptyState title="No posts yet" description="Write your first blog post to publish insights." />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {blogs.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{b.title}</p>
                      {b.featured && <span className="text-xs text-gold">Featured</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.views}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(b.publishedAt ?? b.createdAt)}</td>
                    <td className="px-4 py-3"><Badge variant={statusVariant[b.status]}>{b.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/blog/${b.slug}`} target="_blank" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary" title="View live">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link href={`/secure-admin/blog/${b.id}/edit`} className="flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-secondary" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteButton endpoint={`/api/admin/blog/${b.id}`} iconOnly />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/secure-admin/blog" />
    </div>
  );
}
