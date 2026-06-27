import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) notFound();

  const initial = {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    content: blog.content,
    coverImage: blog.coverImage ?? "",
    category: blog.category,
    tags: blog.tags,
    status: blog.status,
    featured: blog.featured,
    readMinutes: blog.readMinutes,
    metaTitle: blog.metaTitle ?? "",
    metaDescription: blog.metaDescription ?? "",
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString().slice(0, 16) : "",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
        <DeleteButton endpoint={`/api/admin/blog/${blog.id}`} redirectTo="/admin/blog" label="Delete post" />
      </div>
      <h2 className="mb-6 font-display text-xl font-bold">Edit Post</h2>
      <BlogForm initial={initial} blogId={blog.id} />
    </div>
  );
}
