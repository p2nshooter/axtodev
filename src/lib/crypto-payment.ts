import "server-only";
import { getPrisma } from "@/lib/prisma";
import { CRYPTO_ASSETS, CRYPTO_QUOTE_TTL_SECONDS, type CryptoAsset } from "@/lib/constants";
import { isValidWalletAddress } from "@/lib/wallet-address";
import { markOrderPaid } from "@/server/order-service";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

/** Returns only the crypto assets that have a configured, format-valid
 *  receiving address — anything misconfigured is hidden rather than risked. */
export function getEnabledCryptoAssets() {
  return CRYPTO_ASSETS.filter((def) => {
    const address = process.env[def.envVar];
    return Boolean(address) && isValidWalletAddress(def.asset, address!);
  });
}

export function getWalletAddress(asset: CryptoAsset): string | undefined {
  const def = CRYPTO_ASSETS.find((a) => a.asset === asset);
  if (!def) return undefined;
  const address = process.env[def.envVar];
  if (!address || !isValidWalletAddress(asset, address)) return undefined;
  return address;
}

interface LivePrice {
  usd: number;
  fetchedAt: Date;
}

const priceCache = new Map<string, { value: LivePrice; expiresAt: number }>();
const PRICE_CACHE_TTL_MS = 30_000;

/** Live USD price for a coin, from CoinGecko's public simple-price endpoint,
 *  with a short in-memory cache to stay well under rate limits. */
export async function getLiveCryptoPrice(asset: CryptoAsset): Promise<LivePrice> {
  const def = CRYPTO_ASSETS.find((a) => a.asset === asset);
  if (!def) throw new Error(`Unsupported crypto asset: ${asset}`);

  const cached = priceCache.get(asset);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const url = `${COINGECKO_BASE}/simple/price?ids=${def.coingeckoId}&vs_currencies=usd`;
  const headers: Record<string, string> = {};
  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = process.env.COINGECKO_API_KEY;
  }

  const res = await fetch(url, { headers, next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`CoinGecko price lookup failed for ${asset}: ${res.status}`);
  }
  const data = (await res.json()) as Record<string, { usd: number }>;
  const usd = data[def.coingeckoId]?.usd;
  if (!usd || usd <= 0) {
    throw new Error(`CoinGecko returned no price for ${asset}`);
  }

  const value: LivePrice = { usd, fetchedAt: new Date() };
  priceCache.set(asset, { value, expiresAt: Date.now() + PRICE_CACHE_TTL_MS });
  return value;
}

function decimalsForAsset(asset: CryptoAsset): number {
  switch (asset) {
    case "BTC":
      return 8;
    case "ETH":
    case "BNB":
      return 6;
    case "SOL":
      return 6;
    case "USDT_TRC20":
      return 2;
    case "DOGE":
      return 2;
    default:
      return 8;
  }
}

const providerForAsset: Record<CryptoAsset, string> = {
  BTC: "CRYPTO_BTC",
  ETH: "CRYPTO_ETH",
  BNB: "CRYPTO_BNB",
  SOL: "CRYPTO_SOL",
  USDT_TRC20: "CRYPTO_USDT_TRC20",
  DOGE: "CRYPTO_DOGE",
};

/**
 * Creates a Payment row quoting the order total in the chosen crypto asset
 * at the current live rate. The quote (amount + rate) is locked for
 * CRYPTO_QUOTE_TTL_SECONDS so price movement between quote and payment
 * doesn't over/undercharge the customer.
 */
export async function createCryptoQuote(orderId: string, asset: CryptoAsset) {
  const address = getWalletAddress(asset);
  if (!address) {
    throw new Error(`${asset} is not available for payment right now.`);
  }

  const prisma = await getPrisma();
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const { usd } = await getLiveCryptoPrice(asset);

  const amountUsd = order.totalCents / 100;
  const amount = amountUsd / usd;
  const decimals = decimalsForAsset(asset);
  const amountFixed = amount.toFixed(decimals);

  const expiresAt = new Date(Date.now() + CRYPTO_QUOTE_TTL_SECONDS * 1000);

  const payment = await prisma.payment.create({
    data: {
      orderId,
      provider: providerForAsset[asset],
      status: "PENDING",
      amountCents: order.totalCents,
      cryptoAsset: asset,
      cryptoAddress: address,
      cryptoAmount: amountFixed,
      cryptoRateUsd: usd.toFixed(2),
      quoteExpiresAt: expiresAt,
      idempotencyKey: `crypto_${orderId}_${crypto.randomUUID()}`,
    },
  });

  return payment;
}

/**
 * Admin- or webhook-triggered confirmation of a crypto payment. Verifies
 * the quote hasn't expired, then grants access via the same order-paid
 * path PayPal uses.
 */
export async function confirmCryptoPayment(paymentId: string, txHash: string, confirmedBy?: string) {
  const prisma = await getPrisma();
  const payment = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId } });

  if (payment.status === "CONFIRMED") return payment;
  if (payment.quoteExpiresAt && payment.quoteExpiresAt < new Date()) {
    await prisma.payment.update({ where: { id: paymentId }, data: { status: "EXPIRED" } });
    throw new Error("This crypto quote has expired. Ask the customer to start a new payment.");
  }

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "CONFIRMED",
      providerRef: txHash,
      confirmedAt: new Date(),
      rawPayload: JSON.stringify({ txHash, confirmedBy, confirmedAt: new Date().toISOString() }),
    },
  });

  await markOrderPaid(payment.orderId, { source: "crypto", paymentId });
  return updated;
}
