import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { createPendingOrder } from "@/server/order-service";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

const bodySchema = z.object({
  items: z.array(z.object({ bookId: z.string().min(1), unitPriceCents: z.number().int().positive() })).min(1).max(50),
  couponCode: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const ip = clientIp(request.headers);
  const { allowed } = await rateLimit(`checkout:${ip}`, 20, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Never trust client-supplied prices — re-price every item from the
  // catalog server-side before creating the order. Also refuse to sell
  // anything with zero uploaded files: a customer paying for a book that
  // can't actually be downloaded is exactly the kind of bug that costs
  // trust and triggers refunds/chargebacks.
  const prisma = await getPrisma();
  const bookIds = parsed.data.items.map((i) => i.bookId);
  const books = await prisma.book.findMany({
    where: { id: { in: bookIds }, status: "PUBLISHED" },
    include: { _count: { select: { files: true } } },
  });
  const sellableBooks = books.filter((b) => b._count.files > 0);
  const priceById = new Map(sellableBooks.map((b) => [b.id, b.priceCents]));

  const items = parsed.data.items
    .filter((i) => priceById.has(i.bookId))
    .map((i) => ({ bookId: i.bookId, unitPriceCents: priceById.get(i.bookId)! }));

  if (items.length === 0) {
    const hasUndeliverable = books.length > sellableBooks.length;
    return NextResponse.json(
      { error: hasUndeliverable ? "One or more items have no downloadable file yet and can't be purchased." : "No valid items in cart" },
      { status: 400 },
    );
  }

  const order = await createPendingOrder({
    userId: session.user.id,
    items,
    couponCode: parsed.data.couponCode,
    ipAddress: ip,
  });

  return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
}
