import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guardAdmin } from "@/lib/api-auth";

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

// Images are stored in Postgres (see the Upload model) and served from
// /api/uploads/[id]. This keeps the app deployable on Vercel's read-only
// serverless filesystem without S3, Cloudinary, or Blob storage.
export async function POST(req: Request) {
  const guard = await guardAdmin();
  if (guard.error) return guard.error;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 6 MB)" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const upload = await prisma.upload.create({
    data: {
      mimeType: file.type,
      size: bytes.length,
      alt: file.name,
      data: bytes,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, url: `/api/uploads/${upload.id}` }, { status: 201 });
}
