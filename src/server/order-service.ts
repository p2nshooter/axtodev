import "server-only";
import { getPrisma } from "@/lib/prisma";
import { sendEmail, purchaseReceiptEmail } from "@/lib/resend";
import { formatUsd, generateOrderNumber } from "@/lib/utils";

export interface CartLine {
  bookId: string;
  unitPriceCents: number;
}

export async function createPendingOrder(params: {
  userId: string;
  items: CartLine[];
  couponCode?: string;
  ipAddress?: string;
  country?: string;
}) {
  const prisma = await getPrisma();
  const subtotalCents = params.items.reduce((sum, i) => sum + i.unitPriceCents, 0);

  let discountCents = 0;
  let couponId: string | undefined;

  if (params.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: params.couponCode } });
    const now = new Date();
    const isValid =
      coupon &&
      coupon.active &&
      subtotalCents >= coupon.minSubtotalCents &&
      (!coupon.startsAt || coupon.startsAt <= now) &&
      (!coupon.expiresAt || coupon.expiresAt >= now) &&
      (!coupon.maxRedemptions || coupon.redemptions < coupon.maxRedemptions);

    if (isValid && coupon) {
      couponId = coupon.id;
      discountCents =
        coupon.type === "PERCENTAGE" ? Math.round((subtotalCents * coupon.value) / 100) : coupon.value;
      discountCents = Math.min(discountCents, subtotalCents);
    }
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: params.userId,
      status: "PENDING",
      subtotalCents,
      discountCents,
      totalCents: subtotalCents - discountCents,
      couponId,
      ipAddress: params.ipAddress,
      country: params.country,
      items: {
        create: params.items.map((item) => ({
          bookId: item.bookId,
          unitPriceCents: item.unitPriceCents,
          quantity: 1,
        })),
      },
    },
    include: { items: { include: { book: { include: { translations: { where: { language: { code: "en" } } } } } } } },
  });

  return order;
}

/**
 * Single source of truth for "an order became paid" — called from both the
 * PayPal capture/webhook path and crypto payment confirmation. Idempotent:
 * safe to call more than once for the same order (e.g. webhook retries).
 */
export async function markOrderPaid(orderId: string, meta: { source: "paypal" | "crypto"; paymentId: string }) {
  const prisma = await getPrisma();

  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      user: true,
      items: { include: { book: { include: { translations: { where: { language: { code: "en" } } } } } } },
      coupon: true,
    },
  });

  if (order.status === "PAID") return order; // idempotent

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID", paidAt: new Date() },
    });

    if (order.couponId) {
      await tx.coupon.update({ where: { id: order.couponId }, data: { redemptions: { increment: 1 } } });
    }

    await tx.auditLog.create({
      data: {
        userId: order.userId,
        action: "order.paid",
        entity: "Order",
        entityId: order.id,
        metadata: JSON.stringify(meta),
      },
    });

    return result;
  });

  await sendEmail({
    to: order.user.email,
    subject: `Your AXTO.dev order ${order.orderNumber} is confirmed`,
    html: purchaseReceiptEmail({
      customerName: order.user.name,
      orderNumber: order.orderNumber,
      totalFormatted: formatUsd(order.totalCents),
      items: order.items.map((item) => ({
        title: item.book.translations[0]?.title ?? "AXTO.dev e-book",
        priceFormatted: formatUsd(item.unitPriceCents),
      })),
      libraryUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/library`,
    }),
  });

  await prisma.notification.create({
    data: {
      userId: order.userId,
      type: "order.paid",
      title: "Order confirmed",
      body: `Order ${order.orderNumber} is paid — your books are ready in your library.`,
    },
  });

  return updated;
}

export async function getOrderWithPayments(orderId: string) {
  const prisma = await getPrisma();
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { book: { include: { translations: { include: { language: true } } } } } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });
}
