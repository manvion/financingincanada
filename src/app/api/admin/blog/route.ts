import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { blogSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;

  const json = await req.json().catch(() => null);
  const parsed = blogSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  let slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.blog.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const publishedAt =
    data.status === "PUBLISHED"
      ? new Date()
      : data.status === "SCHEDULED" && data.publishedAt
      ? new Date(data.publishedAt)
      : null;

  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category,
      tags: data.tags,
      status: data.status,
      featured: data.featured,
      readMinutes: data.readMinutes,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      authorId: guard.user.id,
      publishedAt,
    },
  });

  return NextResponse.json({ ok: true, id: blog.id, slug: blog.slug }, { status: 201 });
}
