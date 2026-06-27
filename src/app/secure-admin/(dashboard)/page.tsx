import Link from "next/link";
import { Eye, MailQuestion, Newspaper, Package, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { LeadsAreaChart, ViewsBarChart } from "@/components/admin/charts";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getLeadsByMonth,
  getTopListingsByViews,
  getRecentLeads,
} from "@/lib/admin-queries";
import { formatRelative } from "@/lib/utils";
import { requireSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const statusVariant = { NEW: "success", CONTACTED: "gold", ARCHIVED: "secondary" } as const;

export default async function AdminOverviewPage() {
  await requireSuperAdmin();
  const [stats, leadsByMonth, topListings, recentLeads] = await Promise.all([
    getDashboardStats(),
    getLeadsByMonth(),
    getTopListingsByViews(5),
    getRecentLeads(6),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Here&rsquo;s what&rsquo;s happening across your platform.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Listings" value={stats.totalListings} hint={`${stats.publishedListings} published`} icon={Package} accent="navy" />
        <StatCard label="Total Leads" value={stats.totalLeads} hint={`${stats.newLeads} new`} icon={Users} accent="gold" />
        <StatCard label="Blog Posts" value={stats.totalBlogs} icon={Newspaper} accent="blue" />
        <StatCard label="Inquiries This Month" value={stats.monthlyLeads} hint="Leads" icon={TrendingUp} accent="emerald" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Leads & Contacts</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <div className="mt-6">
            <LeadsAreaChart data={leadsByMonth} />
          </div>
        </div>

        <div className="grid gap-5">
          <StatCard label="Total Listing Views" value={stats.totalViews.toLocaleString("en-CA")} icon={Eye} accent="navy" />
          <StatCard label="Contact Messages" value={stats.totalContacts} icon={MailQuestion} accent="gold" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top listings */}
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold">Top Listings by Views</h3>
          <p className="text-sm text-muted-foreground">Most viewed published equipment</p>
          <div className="mt-6">
            {topListings.length ? (
              <ViewsBarChart data={topListings} />
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">No listing data yet.</p>
            )}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Recent Leads</h3>
              <p className="text-sm text-muted-foreground">Latest financing inquiries</p>
            </div>
            <Link href="/secure-admin/leads" className="text-sm font-medium text-gold hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y">
            {recentLeads.length === 0 && (
              <li className="py-8 text-center text-sm text-muted-foreground">No leads yet.</li>
            )}
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.company ? `${lead.company} · ` : ""}
                    {lead.equipmentNeeded ?? "General inquiry"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelative(lead.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
