import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass || host === "smtp.example.com") {
    return null; // Not configured — caller will log instead of throwing.
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendMail({ to, subject, html, replyTo }: MailPayload): Promise<boolean> {
  const t = getTransporter();
  const from = process.env.EMAIL_FROM ?? "Financing in Canada <noreply@financingincanada.com>";

  if (!t) {
    console.warn(`[email] SMTP not configured — skipping send to ${to} ("${subject}").`);
    return false;
  }

  try {
    await t.sendMail({ from, to, subject, html, replyTo });
    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}

// ── Templates ────────────────────────────────────────────────

const BRAND = "#0b1f3a";
const GOLD = "#bf9d5e";

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;color:#0a1a3c">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:${BRAND};border-radius:12px 12px 0 0;padding:24px 32px">
      <span style="color:#fff;font-size:20px;font-weight:700">Financing in Canada</span>
      <span style="display:block;color:${GOLD};font-size:12px;margin-top:4px;letter-spacing:.5px">${title}</span>
    </div>
    <div style="background:#fff;border-radius:0 0 12px 12px;padding:32px;box-shadow:0 8px 30px rgba(10,26,60,.08)">
      ${body}
    </div>
    <p style="text-align:center;color:#8a93a6;font-size:12px;margin-top:20px">
      © ${new Date().getFullYear()} Financing in Canada · Helping Canadian Businesses Finance Their Growth
    </p>
  </div></body></html>`;
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;font-size:13px;width:160px;vertical-align:top">${label}</td>
    <td style="padding:8px 0;color:#0a1a3c;font-size:14px;font-weight:500">${value}</td>
  </tr>`;
}

const SOURCE_LABELS: Record<string, string> = {
  HOMEPAGE: "Homepage form",
  LISTING: "Equipment listing inquiry",
  APPLICATION: "Financing application",
  CONTACT_PAGE: "Contact / vendor form",
};

export function leadNotificationEmail(data: {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  equipmentNeeded?: string | null;
  message?: string | null;
  source: string;
  amount?: number | null;
  listing?: {
    title: string;
    url?: string | null;
    price?: string | number | null;
    monthlyPayment?: string | number | null;
    condition?: string | null;
    location?: string | null;
    category?: string | null;
  } | null;
}): { subject: string; html: string } {
  const sourceLabel = SOURCE_LABELS[data.source] ?? data.source;
  const money = (v: string | number | null | undefined) =>
    v == null || v === ""
      ? null
      : new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(Number(v));

  // A highlighted block describing the exact listing the lead inquired about.
  const listingBlock = data.listing
    ? `
    <div style="margin:0 0 22px;border:1px solid #e7d199;border-radius:10px;background:#faf6ec;padding:16px 18px">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:${BRAND}">Equipment Inquired About</p>
      <p style="margin:0;font-size:16px;font-weight:700;color:${BRAND}">${data.listing.title}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:8px">
        ${row("Category", data.listing.category)}
        ${row("Price", money(data.listing.price))}
        ${data.listing.monthlyPayment ? row("Listed monthly", money(data.listing.monthlyPayment)) : ""}
        ${row("Condition", data.listing.condition)}
        ${row("Location", data.listing.location)}
      </table>
      ${
        data.listing.url
          ? `<a href="${data.listing.url}" style="display:inline-block;margin-top:12px;color:${BRAND};font-weight:600;font-size:13px">View listing →</a>`
          : ""
      }
    </div>`
    : "";

  const body = `
    <h2 style="margin:0 0 8px;font-size:18px">New Financing Inquiry</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 20px">A new lead just came through the website via the <strong>${sourceLabel}</strong>.</p>
    ${listingBlock}
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", data.name)}
      ${row("Company", data.company)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Equipment / Interest", data.equipmentNeeded || data.listing?.title)}
      ${data.amount ? row("Amount needed", money(data.amount)) : ""}
      ${row("Source", sourceLabel)}
      ${data.message ? row("Message", data.message.replace(/\n/g, "<br/>")) : ""}
    </table>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/leads" style="display:inline-block;margin-top:24px;background:${GOLD};color:#0a1a3c;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:14px">View in Dashboard →</a>
  `;
  const subject = data.listing
    ? `New Inquiry: ${data.listing.title}`
    : "New Financing Inquiry";
  return { subject, html: shell("New Lead", body) };
}

export function leadAutoReplyEmail(name: string): { subject: string; html: string } {
  const body = `
    <h2 style="margin:0 0 12px;font-size:18px">Thank you, ${name.split(" ")[0]}!</h2>
    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
      Thank you for contacting <strong>Financing in Canada</strong>. We've received your request and
      one of our financing specialists will reach out shortly — often within one business day.
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
      In the meantime, feel free to browse our latest equipment listings or learn more about how our
      financing process works.
    </p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/equipment" style="display:inline-block;margin-top:8px;background:${BRAND};color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;font-size:14px">Browse Equipment →</a>
  `;
  return {
    subject: "We received your request — Financing in Canada",
    html: shell("Auto-reply", body),
  };
}

export function contactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}): { subject: string; html: string } {
  const body = `
    <h2 style="margin:0 0 8px;font-size:18px">New Contact Message</h2>
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Subject", data.subject)}
      ${row("Message", data.message.replace(/\n/g, "<br/>"))}
    </table>
  `;
  return { subject: "New Contact Message — Financing in Canada", html: shell("New Message", body) };
}
