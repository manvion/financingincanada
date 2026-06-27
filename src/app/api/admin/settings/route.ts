import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";
import { settingsSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;

  const json = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const d = parsed.data;

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {
      companyName: d.companyName,
      tagline: d.tagline,
      phone: d.phone,
      email: d.email || null,
      address: d.address,
      city: d.city,
      province: d.province,
      postalCode: d.postalCode,
      facebookUrl: d.facebookUrl || null,
      linkedinUrl: d.linkedinUrl || null,
      twitterUrl: d.twitterUrl || null,
      instagramUrl: d.instagramUrl || null,
      smtpHost: d.smtpHost,
      smtpPort: d.smtpPort,
      smtpSecure: d.smtpSecure,
      smtpUser: d.smtpUser,
      smtpFrom: d.smtpFrom,
      notifyEmail: d.notifyEmail || null,
    },
    create: {
      id: "singleton",
      companyName: d.companyName,
      tagline: d.tagline,
      phone: d.phone,
      email: d.email || null,
      notifyEmail: d.notifyEmail || null,
    },
  });

  // Refresh the public site (footer, contact page) so changes appear immediately.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, settings });
}
