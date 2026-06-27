import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { blogSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = blogSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  const current = await prisma.blog.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug: string | undefined;
  if (data.slug) {
    slug = slugify(data.slug);
    const dupe = await prisma.blog.findFirst({ where: { slug, NOT: { id } } });
    if (dupe) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  let publishedAt: Date | null | undefined;
  if (data.status === "PUBLISHED" && !current.publishedAt) publishedAt = new Date();
  else if (data.status === "SCHEDULED" && data.publishedAt) publishedAt = new Date(data.publishedAt);
  else if (data.status === "DRAFT") publishedAt = null;

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt === "" ? null : data.excerpt,
      content: data.content,
      coverImage: data.coverImage === "" ? null : data.coverImage,
      category: data.category,
      tags: data.tags,
      status: data.status,
      featured: data.featured,
      readMinutes: data.readMinutes,
      metaTitle: data.metaTitle === "" ? null : data.metaTitle,
      metaDescription: data.metaDescription === "" ? null : data.metaDescription,
      ...(publishedAt !== undefined ? { publishedAt } : {}),
    },
  });

  return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
