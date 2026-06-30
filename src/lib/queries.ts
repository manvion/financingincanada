import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// Serialize Prisma Decimal -> number for client-safe payloads.
function num(d: Prisma.Decimal | null | undefined): number | null {
  return d == null ? null : Number(d);
}

export type SerializedListing = Awaited<ReturnType<typeof getListingBySlug>>;

export async function getFeaturedListings(limit = 6) {
  const listings = await prisma.listing.findMany({
    where: { status: "PUBLISHED", featured: true },
    include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return listings.map((l) => ({
    ...l,
    price: num(l.price)!,
    monthlyPayment: num(l.monthlyPayment),
  }));
}

export async function getLatestListings(limit = 6) {
  const listings = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return listings.map((l) => ({ ...l, price: num(l.price)!, monthlyPayment: num(l.monthlyPayment) }));
}

type ListingFilters = {
  category?: string;
  province?: string;
  condition?: "NEW" | "USED";
  min?: number;
  max?: number;
  q?: string;
  page?: number;
  perPage?: number;
};

export async function getListings(filters: ListingFilters) {
  const { category, province, condition, min, max, q, page = 1, perPage = 9 } = filters;

  const where: Prisma.ListingWhereInput = { status: { in: ["PUBLISHED", "SOLD"] } };
  if (category) where.category = { slug: category };
  if (province) where.province = province as Prisma.ListingWhereInput["province"];
  if (condition) where.condition = condition;
  if (min != null || max != null) {
    where.price = {};
    if (min != null) where.price.gte = min;
    if (max != null) where.price.lte = max;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { make: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
      // Available (PUBLISHED) first, then SOLD; enum order puts PUBLISHED before SOLD.
      orderBy: [{ status: "asc" }, { featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return {
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    listings: rows.map((l) => ({ ...l, price: num(l.price)!, monthlyPayment: num(l.monthlyPayment) })),
  };
}

export async function getListingBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });
  if (!listing || (listing.status !== "PUBLISHED" && listing.status !== "SOLD")) return null;

  // best-effort view increment
  prisma.listing
    .update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
    .catch(() => {});

  return {
    ...listing,
    price: num(listing.price)!,
    monthlyPayment: num(listing.monthlyPayment),
    specifications: (listing.specifications as { label: string; value: string }[] | null) ?? [],
  };
}

export async function getRelatedListings(categoryId: string, excludeId: string, limit = 3) {
  const rows = await prisma.listing.findMany({
    where: { status: "PUBLISHED", categoryId, id: { not: excludeId } },
    include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return rows.map((l) => ({ ...l, price: num(l.price)!, monthlyPayment: num(l.monthlyPayment) }));
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { listings: { where: { status: "PUBLISHED" } } } } },
  });
}

export async function getFeaturedTestimonials(limit = 6) {
  return prisma.testimonial.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

// ── Blog ──────────────────────────────────────────────────────

export async function getPublishedBlogs(filters: { category?: string; q?: string; page?: number; perPage?: number } = {}) {
  const { category, q, page = 1, perPage = 9 } = filters;
  const where: Prisma.BlogWhereInput = { status: "PUBLISHED" };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }
  const [total, blogs] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);
  return { total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)), blogs };
}

export async function getFeaturedBlog() {
  return prisma.blog.findFirst({
    where: { status: "PUBLISHED", featured: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLatestBlogs(limit = 3) {
  return prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });
  if (!blog || blog.status !== "PUBLISHED") return null;
  prisma.blog.update({ where: { id: blog.id }, data: { views: { increment: 1 } } }).catch(() => {});
  return blog;
}

export async function getRelatedBlogs(category: string, excludeId: string, limit = 3) {
  return prisma.blog.findMany({
    where: { status: "PUBLISHED", category, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getSettings() {
  return prisma.settings.findUnique({ where: { id: "singleton" } });
}
