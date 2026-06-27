"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

const TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === "/secure-admin", title: "Dashboard Overview" },
  { match: (p) => p.startsWith("/secure-admin/listings"), title: "Equipment Listings" },
  { match: (p) => p.startsWith("/secure-admin/blog"), title: "Blog Posts" },
  { match: (p) => p.startsWith("/secure-admin/leads"), title: "Leads" },
  { match: (p) => p.startsWith("/secure-admin/contacts"), title: "Contact Messages" },
  { match: (p) => p.startsWith("/secure-admin/settings"), title: "Settings" },
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
      <Sidebar open={open} onClose={() => setOpen(false)} role={user.role} />
      <div className="lg:pl-64">
        <Topbar title={title} user={user} onMenu={() => setOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
