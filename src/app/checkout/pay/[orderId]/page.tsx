import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
import { getOrderWithPayments } from "@/server/order-service";
import { getEnabledCryptoAssets } from "@/lib/crypto-payment";
import { formatUsd } from "@/lib/utils";
import { PayPalButton } from "@/components/checkout/paypal-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata = { title: "Complete your payment" };

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function PayOrderPage({ params }: Props) {
  const { orderId } = await params;
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  const order = await getOrderWithPayments(orderId);
  if (!order || order.userId !== session.user.id) notFound();

  if (order.status === "PAID") redirect("/checkout/success?order=" + order.orderNumber);

  const cryptoAssets = getEnabledCryptoAssets();

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold">Complete your payment</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Order <span className="font-mono">{order.orderNumber}</span>
      </p>

      <div className="mt-6 rounded-lg border border-border p-4">
        <ul className="space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.book.translations.find((t) => t.language.code === "en")?.title ?? item.bookId}</span>
              <span>{formatUsd(item.unitPriceCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatUsd(order.totalCents)}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pay with PayPal</CardTitle>
          </CardHeader>
          <CardContent>
            <PayPalButton orderId={order.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pay with Crypto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cryptoAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Crypto payment is temporarily unavailable.</p>
            ) : (
              cryptoAssets.map((asset) => (
                <Link
                  key={asset.asset}
                  href={`/checkout/pay/${order.id}/crypto/${asset.asset}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:border-gold-400/50"
                >
                  <span>{asset.name}</span>
                  <Badge variant="outline">{asset.symbol}</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
