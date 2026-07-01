import { NextResponse } from "next/server";
import { verifyPayPalWebhookSignature } from "@/lib/paypal";
import { getPrisma } from "@/lib/prisma";
import { markOrderPaid } from "@/server/order-service";

export const runtime = "edge";

// PayPal webhook — a second, provider-signed confirmation path independent
// of the browser redirect capture in paypal/return, so a payment still
// gets confirmed even if the customer closes the tab after paying.
export async function POST(request: Request) {
  const rawBody = await request.text();

  let verified = false;
  try {
    verified = await verifyPayPalWebhookSignature({ headers: request.headers, body: rawBody });
  } catch (error) {
    console.error("PayPal webhook verification error", error);
  }

  if (!verified) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as {
    event_type: string;
    resource: { id: string; status?: string; supplementary_data?: { related_ids?: { order_id?: string } }; custom_id?: string };
  };

  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED" && event.event_type !== "CHECKOUT.ORDER.APPROVED") {
    return NextResponse.json({ ok: true, ignored: event.event_type });
  }

  const paypalOrderId = event.resource.supplementary_data?.related_ids?.order_id ?? event.resource.id;

  const prisma = await getPrisma();
  const payment = await prisma.payment.findFirst({ where: { provider: "PAYPAL", providerRef: paypalOrderId } });
  if (!payment) return NextResponse.json({ ok: true, note: "No matching payment" });

  if (payment.status !== "CONFIRMED") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "CONFIRMED", confirmedAt: new Date(), rawPayload: rawBody },
    });
  }

  await markOrderPaid(payment.orderId, { source: "paypal", paymentId: payment.id });

  return NextResponse.json({ ok: true });
}
