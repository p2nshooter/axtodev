import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { createCryptoQuote } from "@/lib/crypto-payment";
import { CRYPTO_ASSETS, type CryptoAsset } from "@/lib/constants";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

const VALID_ASSETS = new Set(CRYPTO_ASSETS.map((a) => a.asset));

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`crypto-quote:${clientIp(request.headers)}`, 10, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { orderId, asset } = (await request.json().catch(() => ({}))) as { orderId?: string; asset?: string };
  if (!orderId || !asset || !VALID_ASSETS.has(asset as CryptoAsset)) {
    return NextResponse.json({ error: "orderId and a valid asset are required" }, { status: 400 });
  }

  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not payable" }, { status: 409 });

  try {
    const payment = await createCryptoQuote(orderId, asset as CryptoAsset);
    return NextResponse.json({
      paymentId: payment.id,
      asset: payment.cryptoAsset,
      address: payment.cryptoAddress,
      amount: payment.cryptoAmount,
      rateUsd: payment.cryptoRateUsd,
      expiresAt: payment.quoteExpiresAt,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Could not create a crypto quote";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
