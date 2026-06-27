import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { NextResponse } from "next/server";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const guard = await guardAdmin({ superOnly: true });
  if (guard.error) return guard.error;

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const headers = ["Name", "Company", "Email", "Phone", "Equipment", "Message", "Status", "Source", "Date"];
  const rows = leads.map((l) =>
    [
      l.name,
      l.company ?? "",
      l.email,
      l.phone ?? "",
      l.equipmentNeeded ?? "",
      l.message ?? "",
      l.status,
      l.source,
      l.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
