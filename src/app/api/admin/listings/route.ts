import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { listingSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;

  const json = await req.json().catch(() => null);
  const parsed = listingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  let slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  // ensure uniqueness
  const existing = await prisma.listing.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const listing = await prisma.listing.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      specifications: data.specifications ?? [],
      price: data.price,
      monthlyPayment: data.monthlyPayment ?? null,
      condition: data.condition,
      province: data.province,
      city: data.city || null,
      year: data.year ?? null,
      make: data.make || null,
      model: data.model || null,
      status: data.status,
      featured: data.featured,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      categoryId: data.categoryId,
      authorId: guard.user.id,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      images: data.images?.length
        ? { create: data.images.map((img, i) => ({ url: img.url, alt: img.alt ?? data.title, order: i })) }
        : undefined,
    },
  });

  return NextResponse.json({ ok: true, id: listing.id, slug: listing.slug }, { status: 201 });
}
