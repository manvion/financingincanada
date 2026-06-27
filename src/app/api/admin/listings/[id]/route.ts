import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { listingSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = listingSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  const current = await prisma.listing.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug: string | undefined;
  if (data.slug) {
    slug = slugify(data.slug);
    const dupe = await prisma.listing.findFirst({ where: { slug, NOT: { id } } });
    if (dupe) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const publishedAt =
    data.status === "PUBLISHED" && !current.publishedAt ? new Date() : undefined;

  // Replace images if provided.
  if (data.images) {
    await prisma.listingImage.deleteMany({ where: { listingId: id } });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      description: data.description,
      specifications: data.specifications,
      price: data.price,
      monthlyPayment: data.monthlyPayment,
      condition: data.condition,
      province: data.province,
      city: data.city === "" ? null : data.city,
      year: data.year,
      make: data.make === "" ? null : data.make,
      model: data.model === "" ? null : data.model,
      status: data.status,
      featured: data.featured,
      metaTitle: data.metaTitle === "" ? null : data.metaTitle,
      metaDescription: data.metaDescription === "" ? null : data.metaDescription,
      ...(publishedAt ? { publishedAt } : {}),
      ...(data.images
        ? { images: { create: data.images.map((img, i) => ({ url: img.url, alt: img.alt ?? data.title ?? "", order: i })) } }
        : {}),
    },
  });

  return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
