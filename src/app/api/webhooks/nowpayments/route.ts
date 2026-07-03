import { NextResponse } from "next/server";
import { verifyNowPaymentsIpn, isNowPaymentsPaidStatus, isNowPaymentsFailedStatus } from "@/lib/nowpayments";
import { getPrisma } from "@/lib/prisma";
import { markOrderPaid } from "@/server/order-service";

export const runtime = "edge";

// NOWPayments IPN — confirms crypto payments automatically (unlike the
// manual wallet-address flow, which needs an admin to verify on-chain).
// Signature is verified before anything in the body is trusted.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-nowpayments-sig");

  const verified = await verifyNowPaymentsIpn(rawBody, signature).catch(() => false);
  if (!verified) {
    return NextResponse.json({ error: "Invalid IPN signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as { order_id?: string; payment_status?: string; payment_id?: string | number };
  if (!event.order_id || !event.payment_status) {
    return NextResponse.json({ ok: true, note: "Missing order_id/payment_status" });
  }

  const prisma = await getPrisma();
  const payment = await prisma.payment.findFirst({
    where: { orderId: event.order_id, provider: "NOWPAYMENTS" },
    orderBy: { createdAt: "desc" },
  });
  if (!payment) return NextResponse.json({ ok: true, note: "No matching payment" });

  if (isNowPaymentsPaidStatus(event.payment_status)) {
    if (payment.status !== "CONFIRMED") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CONFIRMED",
          providerRef: event.payment_id ? String(event.payment_id) : payment.providerRef,
          confirmedAt: new Date(),
          rawPayload: rawBody,
        },
      });
    }
    await markOrderPaid(payment.orderId, { source: "crypto", paymentId: payment.id });
  } else if (isNowPaymentsFailedStatus(event.payment_status)) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", rawPayload: rawBody },
    });
  } else {
    // Intermediate states (waiting/confirming/sending) — record but don't act.
    await prisma.payment.update({ where: { id: payment.id }, data: { rawPayload: rawBody } });
  }

  return NextResponse.json({ ok: true });
}
