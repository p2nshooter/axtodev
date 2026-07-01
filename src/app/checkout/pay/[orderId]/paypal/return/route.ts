import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { markOrderPaid } from "@/server/order-service";

export const runtime = "edge";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { orderId } = await params;
  const url = new URL(request.url);
  const paypalOrderId = url.searchParams.get("token");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? url.origin;

  const session = await getCurrentSession();
  if (!session?.user || !paypalOrderId) {
    return NextResponse.redirect(`${appUrl}/checkout/pay/${orderId}?error=paypal_return`);
  }

  const prisma = await getPrisma();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.redirect(`${appUrl}/orders?error=not_found`);
  }

  if (order.status === "PAID") {
    return NextResponse.redirect(`${appUrl}/checkout/success?order=${order.orderNumber}`);
  }

  try {
    const capture = await capturePayPalOrder(paypalOrderId);
    const captureStatus = capture.purchase_units[0]?.payments?.captures?.[0]?.status;

    if (capture.status !== "COMPLETED" && captureStatus !== "COMPLETED") {
      return NextResponse.redirect(`${appUrl}/checkout/pay/${orderId}?error=paypal_not_completed`);
    }

    const payment = await prisma.payment.findFirst({ where: { orderId, provider: "PAYPAL", providerRef: paypalOrderId } });
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "CONFIRMED", confirmedAt: new Date(), rawPayload: JSON.stringify(capture) },
      });
      await markOrderPaid(orderId, { source: "paypal", paymentId: payment.id });
    }

    return NextResponse.redirect(`${appUrl}/checkout/success?order=${order.orderNumber}`);
  } catch (error) {
    console.error("PayPal capture failed", error);
    return NextResponse.redirect(`${appUrl}/checkout/pay/${orderId}?error=paypal_capture_failed`);
  }
}
