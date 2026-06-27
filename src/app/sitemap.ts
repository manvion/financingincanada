import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { INDUSTRIES } from "@/lib/industries";
import { SERVICES } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/services",
    "/industries",
    "/equipment",
    "/vendors",
    "/blog",
    "/about",
    "/contact",
    "/apply",
    "/privacy",
    "/terms",
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...INDUSTRIES.map((i) => `/industries/${i.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [listings, blogs] = await Promise.all([
      prisma.listing.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.blog.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);

    dynamicRoutes = [
      ...listings.map((l) => ({
        url: `${base}/equipment/${l.slug}`,
        lastModified: l.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...blogs.map((b) => ({
        url: `${base}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    // Database unavailable at build time — return static routes only.
  }

  return [...staticRoutes, ...dynamicRoutes];
}
