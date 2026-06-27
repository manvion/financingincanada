import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendMail, contactNotificationEmail, leadAutoReplyEmail } from "@/lib/email";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true });

  const submission = await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    },
  });

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  const notifyTo = settings?.notifyEmail || process.env.ADMIN_EMAIL || "info@financingincanada.com";

  // Notify info@ and send the submitter a thank-you.
  const adminMail = contactNotificationEmail(data);
  const replyMail = leadAutoReplyEmail(data.name);
  void Promise.allSettled([
    sendMail({ to: notifyTo, subject: adminMail.subject, html: adminMail.html, replyTo: data.email }),
    sendMail({ to: data.email, subject: replyMail.subject, html: replyMail.html }),
  ]);

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}
