import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({ status: z.enum(["NEW", "CONTACTED", "ARCHIVED"]) });

export async function PATCH(req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 422 });

  await prisma.lead.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;
  const { id } = await params;
  await prisma.lead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
