import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/session";
import { getOrderWithPayments } from "@/server/order-service";
import { CRYPTO_ASSETS, type CryptoAsset } from "@/lib/constants";
import { CryptoCheckout } from "@/components/checkout/crypto-checkout";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderId: string; asset: string }>;
}

export default async function CryptoPayPage({ params }: Props) {
  const { orderId, asset } = await params;
  const session = await getCurrentSession();
  if (!session?.user) redirect("/login");

  const assetDef = CRYPTO_ASSETS.find((a) => a.asset === asset);
  if (!assetDef) notFound();

  const order = await getOrderWithPayments(orderId);
  if (!order || order.userId !== session.user.id) notFound();
  if (order.status === "PAID") redirect(`/checkout/success?order=${order.orderNumber}`);

  return (
    <div className="container max-w-lg py-12">
      <CryptoCheckout orderId={order.id} orderNumber={order.orderNumber} asset={asset as CryptoAsset} assetName={assetDef.name} network={assetDef.network} />
    </div>
  );
}
