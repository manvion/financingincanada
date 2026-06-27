"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Users,
  MailQuestion,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV_GROUPS: {
  label: string;
  superOnly?: boolean;
  items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[];
}[] = [
  {
    label: "Overview",
    superOnly: true,
    items: [{ href: "/secure-admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/secure-admin/listings", label: "Equipment Listings", icon: Package },
      { href: "/secure-admin/blog", label: "Blog Posts", icon: Newspaper },
    ],
  },
  {
    label: "Inbox",
    superOnly: true,
    items: [
      { href: "/secure-admin/leads", label: "Leads", icon: Users },
      { href: "/secure-admin/contacts", label: "Contact Messages", icon: MailQuestion },
    ],
  },
  {
    label: "System",
    superOnly: true,
    items: [{ href: "/secure-admin/settings", label: "Settings", icon: Settings }],
  },
];

export function Sidebar({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: string;
}) {
  const pathname = usePathname();
  const isSuper = role === "SUPER_ADMIN";
  const groups = NAV_GROUPS.filter((g) => isSuper || !g.superOnly);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-navy-950 text-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <Logo variant="light" href="/secure-admin" />
          <button onClick={onClose} className="text-white/50 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-white/[0.07] text-white" : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />}
                      <item.icon className={cn("h-4.5 w-4.5", active ? "text-gold" : "text-white/40 group-hover:text-white/70")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink className="h-4 w-4" /> View live site
          </Link>
        </div>
      </aside>
    </>
  );
}
