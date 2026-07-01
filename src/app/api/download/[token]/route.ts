import { NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-token";
import { getPrisma } from "@/lib/prisma";
import { readR2Object } from "@/lib/r2";
import { logDownload, userOwnsBook } from "@/server/library-service";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

interface Props {
  params: Promise<{ token: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { token } = await params;
  const ip = clientIp(request.headers);

  const { allowed } = await rateLimit(`download:${ip}`, 60, 3600);
  if (!allowed) return NextResponse.json({ error: "Too many download attempts" }, { status: 429 });

  const payload = await verifyDownloadToken(token);
  if (!payload) return NextResponse.json({ error: "This download link is invalid or has expired." }, { status: 410 });

  const prisma = await getPrisma();
  const record = await prisma.downloadToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "This download link is invalid, expired, or already used." }, { status: 410 });
  }

  // Defense in depth: re-verify purchase + entitlement server-side even
  // though the signed token already encodes a snapshot of them.
  const owns = await userOwnsBook(payload.userId, payload.bookId);
  if (!owns) return NextResponse.json({ error: "Purchase verification failed." }, { status: 403 });

  const file = await prisma.bookFile.findUnique({
    where: { bookId_languageId_format: { bookId: payload.bookId, languageId: payload.languageId, format: payload.format } },
  });
  if (!file) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const object = await readR2Object("EBOOKS_BUCKET", file.storageKey);
  if (!object) return NextResponse.json({ error: "File is temporarily unavailable." }, { status: 404 });

  await prisma.downloadToken.update({ where: { token }, data: { usedAt: new Date(), ipAddress: ip } });
  await logDownload({
    userId: payload.userId,
    bookId: payload.bookId,
    languageId: payload.languageId,
    format: payload.format,
    ipAddress: ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  });

  const contentType = payload.format === "PDF" ? "application/pdf" : "application/epub+zip";
  return new Response(object.body as unknown as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="axto-dev-${payload.bookId}-${payload.languageId}.${payload.format.toLowerCase()}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
