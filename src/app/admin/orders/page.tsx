import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrisma } from "@/lib/prisma";
import { formatUsd, formatDate } from "@/lib/utils";
import { confirmCryptoPaymentAction } from "@/server/admin-actions";

export const metadata = { title: "Admin · Orders & Payments" };

const STATUS_VARIANT: Record<string, "gold" | "secondary" | "outline" | "destructive"> = {
  PAID: "gold",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
  CANCELLED: "outline",
};

export default async function AdminOrdersPage() {
  const prisma = await getPrisma();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true, payments: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold">Orders & Payments</h1>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-sm">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.user.email} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={STATUS_VARIANT[order.status] ?? "outline"}>{order.status}</Badge>
                <span className="font-semibold">{formatUsd(order.totalCents)}</span>
              </div>
            </div>

            {order.payments.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span>
                      {payment.provider} — <Badge variant="outline">{payment.status}</Badge>
                      {payment.cryptoAmount && (
                        <span className="ml-2 text-muted-foreground">
                          {payment.cryptoAmount} {payment.cryptoAsset} to {payment.cryptoAddress?.slice(0, 8)}…
                        </span>
                      )}
                    </span>
                    {payment.status === "PENDING" && payment.provider !== "PAYPAL" && (
                      <form action={confirmCryptoPaymentAction} className="flex items-center gap-2">
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <Input name="txHash" placeholder="on-chain tx hash" className="h-8 w-48 text-xs" required />
                        <Button type="submit" size="sm" variant="gold">
                          Confirm paid
                        </Button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
