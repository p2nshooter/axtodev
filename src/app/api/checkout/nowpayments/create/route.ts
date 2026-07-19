import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { createNowPaymentsInvoice } from "@/lib/nowpayments";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`nowpayments-create:${clientIp(request.headers)}`, 15, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { orderId } = (await request.json().catch(() => ({}))) as { orderId?: string };
  if (!orderId) return NextResponse.json({ error: "orderId is required" }, { status: 400 });

  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "PENDING") return NextResponse.json({ error: "Order is not payable" }, { status: 409 });

  try {
    const invoice = await createNowPaymentsInvoice({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amountCents: order.totalCents,
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "NOWPAYMENTS",
        status: "PENDING",
        amountCents: order.totalCents,
        providerRef: String(invoice.id),
        idempotencyKey: `nowpayments_${order.id}_${invoice.id}`,
      },
    });

    return NextResponse.json({ invoiceUrl: invoice.invoice_url });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Could not start NOWPayments checkout";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
