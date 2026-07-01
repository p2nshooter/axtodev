import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCurrentSession } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";
import { formatUsd, formatDate } from "@/lib/utils";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Order History" };

const STATUS_VARIANT: Record<string, "gold" | "secondary" | "destructive" | "outline"> = {
  PAID: "gold",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
  CANCELLED: "outline",
};

export default async function OrdersPage() {
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  const prisma = await getPrisma();
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { book: { include: { translations: { where: { language: { code: "en" } } } } } } } },
  });

  return (
    <div className="container py-12">
      <h1 className="font-serif text-3xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">You have no orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[order.status] ?? "outline"}>{order.status}</Badge>
                  <span className="font-semibold">{formatUsd(order.totalCents)}</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {order.items.map((item) => (
                  <li key={item.id}>{item.book.translations[0]?.title ?? item.bookId}</li>
                ))}
              </ul>
              {order.status === "PENDING" && (
                <Link href={`/checkout/pay/${order.id}`} className="mt-3 inline-block text-sm text-accent hover:underline">
                  Complete payment →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
