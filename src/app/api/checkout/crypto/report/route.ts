import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

// Customer-reported transaction hash. This never auto-confirms the
// payment — spec: "Never trust client-side payment responses". It only
// flags the payment for an admin to verify on a block explorer and
// confirm via /admin/orders (see confirmCryptoPayment in
// src/lib/crypto-payment.ts).
export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`crypto-report:${clientIp(request.headers)}`, 10, 300);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { paymentId, txHash } = (await request.json().catch(() => ({}))) as {
    paymentId?: string;
    txHash?: string;
  };
  if (!paymentId || !txHash || txHash.length < 8) {
    return NextResponse.json({ error: "paymentId and a txHash are required" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { order: true } });
  if (!payment || payment.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: { rawPayload: JSON.stringify({ reportedTxHash: txHash, reportedAt: new Date().toISOString() }) },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "payment.crypto.reported",
      entity: "Payment",
      entityId: paymentId,
      metadata: JSON.stringify({ txHash }),
    },
  });

  return NextResponse.json({ ok: true });
}
