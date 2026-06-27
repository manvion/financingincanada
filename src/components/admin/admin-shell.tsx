"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

const TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/admin", title: "Dashboard Overview" },
  { match: (p) => p.startsWith("/admin/listings"), title: "Equipment Listings" },
  { match: (p) => p.startsWith("/admin/blog"), title: "Blog Posts" },
  { match: (p) => p.startsWith("/admin/leads"), title: "Leads" },
  { match: (p) => p.startsWith("/admin/contacts"), title: "Contact Messages" },
  { match: (p) => p.startsWith("/admin/settings"), title: "Settings" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; role: string };
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const title = TITLES.find((t) => t.match(pathname))?.title ?? "Admin";

  return (
    <div className="min-h-screen bg-secondary/40">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <Topbar title={title} user={user} onMenu={() => setOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
