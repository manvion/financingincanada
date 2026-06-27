import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalListings, publishedListings, totalLeads, newLeads, totalBlogs, monthlyLeads, totalContacts, totalViews] =
    await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "PUBLISHED" } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.blog.count(),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.contactSubmission.count(),
      prisma.listing.aggregate({ _sum: { views: true } }),
    ]);

  return {
    totalListings,
    publishedListings,
    totalLeads,
    newLeads,
    totalBlogs,
    monthlyLeads,
    totalContacts,
    totalViews: totalViews._sum.views ?? 0,
  };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getLeadsByMonth() {
  const now = new Date();
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({ key: `${start.getFullYear()}-${start.getMonth()}`, label: MONTHS[start.getMonth()], start, end });
  }

  const [leads, contacts] = await Promise.all([
    prisma.lead.findMany({
      where: { createdAt: { gte: months[0].start } },
      select: { createdAt: true },
    }),
    prisma.contactSubmission.findMany({
      where: { createdAt: { gte: months[0].start } },
      select: { createdAt: true },
    }),
  ]);

  return months.map((m) => ({
    month: m.label,
    leads: leads.filter((l) => l.createdAt >= m.start && l.createdAt < m.end).length,
    contacts: contacts.filter((c) => c.createdAt >= m.start && c.createdAt < m.end).length,
  }));
}

export async function getTopListingsByViews(limit = 5) {
  const rows = await prisma.listing.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: limit,
    select: { id: true, title: true, views: true, slug: true },
  });
  return rows;
}

export async function getRecentLeads(limit = 6) {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, name: true, company: true, equipmentNeeded: true, status: true, createdAt: true, source: true },
  });
}

export async function getLeadSourceBreakdown() {
  const grouped = await prisma.lead.groupBy({ by: ["source"], _count: { _all: true } });
  return grouped.map((g) => ({ source: g.source, count: g._count._all }));
}
