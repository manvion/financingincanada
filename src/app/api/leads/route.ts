import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendMail, leadNotificationEmail, leadAutoReplyEmail } from "@/lib/email";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot: silently accept bots without persisting.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  let listingInfo:
    | {
        title: string;
        url: string;
        price: number;
        monthlyPayment: number | null;
        condition: string;
        location: string;
        category: string;
      }
    | null = null;
  if (data.listingId) {
    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      select: {
        title: true,
        slug: true,
        price: true,
        monthlyPayment: true,
        condition: true,
        city: true,
        province: true,
        category: { select: { name: true } },
      },
    });
    if (listing) {
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      listingInfo = {
        title: listing.title,
        url: `${base}/equipment/${listing.slug}`,
        price: Number(listing.price),
        monthlyPayment: listing.monthlyPayment ? Number(listing.monthlyPayment) : null,
        condition: listing.condition === "NEW" ? "New" : "Used",
        location: [listing.city, listing.province].filter(Boolean).join(", "),
        category: listing.category.name,
      };
    }
  }

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      equipmentNeeded: data.equipmentNeeded || null,
      message: data.message || null,
      amount: data.amount ?? null,
      source: data.source,
      listingId: data.listingId || null,
    },
  });

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const notifyTo = settings?.notifyEmail || process.env.ADMIN_EMAIL || "info@financingincanada.com";

  // Notify info@ and send the submitter a thank-you. Fire-and-forget (don't block on SMTP).
  const adminMail = leadNotificationEmail({ ...data, listing: listingInfo });
  const replyMail = leadAutoReplyEmail(data.name);
  void Promise.allSettled([
    sendMail({ to: notifyTo, subject: adminMail.subject, html: adminMail.html, replyTo: data.email }),
    sendMail({ to: data.email, subject: replyMail.subject, html: replyMail.html }),
  ]);

  return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
}
