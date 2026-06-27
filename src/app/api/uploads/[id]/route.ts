import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// Serves an image stored in the database. Cached aggressively since uploads
// are immutable (a new image gets a new id).
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const upload = await prisma.upload.findUnique({ where: { id } });
  if (!upload) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(upload.data), {
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
