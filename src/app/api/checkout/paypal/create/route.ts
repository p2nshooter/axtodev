import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getAppUrl } from "@/lib/site-url";

export const runtime = "edge";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`paypal-create:${clientIp(request.headers)}`, 15, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { orderId } = (await request.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not payable" }, { status: 409 });

  const paypalOrder = await createPayPalOrder(order.id, order.totalCents, order.currency);

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "PAYPAL",
      status: "PENDING",
      amountCents: order.totalCents,
      providerRef: paypalOrder.id,
      idempotencyKey: `paypal_${order.id}_${crypto.randomUUID()}`,
    },
  });

  const approveLink = (paypalOrder as unknown as { links?: Array<{ rel: string; href: string }> }).links?.find(
    (l) => l.rel === "approve",
  );
  const appUrl = getAppUrl();
  const approveUrl =
    approveLink?.href ??
    `${appUrl}/checkout/pay/${order.id}/paypal/return?token=${paypalOrder.id}`;

  return NextResponse.json({ approveUrl, paypalOrderId: paypalOrder.id });
}
