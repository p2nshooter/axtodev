import "server-only";
import { getSetting } from "@/server/settings-service";
import { getAppUrl } from "@/lib/site-url";

const API_BASE = "https://api.nowpayments.io/v1";

async function getApiKey(): Promise<string> {
  const key = await getSetting("NOWPAYMENTS_API_KEY");
  if (!key) throw new Error("NOWPayments is not configured (set NOWPAYMENTS_API_KEY in /admin/settings).");
  return key;
}

interface NowPaymentsInvoice {
  id: string;
  invoice_url: string;
  order_id: string;
  price_amount: string;
  price_currency: string;
}

/**
 * Creates a hosted NOWPayments invoice — the customer is redirected to
 * NOWPayments' own checkout page (asset picker, address, QR, live rate),
 * and NOWPayments confirms the on-chain payment for us via IPN webhook
 * (see /api/webhooks/nowpayments), unlike the manual wallet flow in
 * src/lib/crypto-payment.ts which requires admin confirmation.
 */
export async function createNowPaymentsInvoice(params: {
  orderId: string;
  orderNumber: string;
  amountCents: number;
}): Promise<NowPaymentsInvoice> {
  const apiKey = await getApiKey();
  const appUrl = getAppUrl();

  const res = await fetch(`${API_BASE}/invoice`, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      price_amount: (params.amountCents / 100).toFixed(2),
      price_currency: "usd",
      order_id: params.orderId,
      order_description: `AXTO.dev order ${params.orderNumber}`,
      ipn_callback_url: `${appUrl}/api/webhooks/nowpayments`,
      success_url: `${appUrl}/checkout/success?order=${params.orderNumber}`,
      cancel_url: `${appUrl}/checkout/pay/${params.orderId}`,
    }),
  });

  if (!res.ok) {
    throw new Error(`NOWPayments invoice creation failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<NowPaymentsInvoice>;
}

/** NOWPayments statuses that mean the payment is fully settled. */
const PAID_STATUSES = new Set(["finished", "confirmed"]);
/** Terminal failure statuses — safe to mark the payment FAILED. */
const FAILED_STATUSES = new Set(["failed", "expired", "refunded"]);

export function isNowPaymentsPaidStatus(status: string): boolean {
  return PAID_STATUSES.has(status);
}
export function isNowPaymentsFailedStatus(status: string): boolean {
  return FAILED_STATUSES.has(status);
}

/**
 * Verifies the `x-nowpayments-sig` IPN header: HMAC-SHA512 over the
 * request body with keys sorted alphabetically, using the IPN secret.
 * Never trust an incoming IPN without this (spec: verify webhooks using
 * provider signatures).
 */
export async function verifyNowPaymentsIpn(rawBody: string, signatureHeader: string | null): Promise<boolean> {
  if (!signatureHeader) return false;
  const secret = await getSetting("NOWPAYMENTS_IPN_SECRET");
  if (!secret) return false;

  let sorted: string;
  try {
    const parsed = JSON.parse(rawBody) as Record<string, unknown>;
    sorted = JSON.stringify(sortKeysDeep(parsed));
  } catch {
    return false;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(sorted));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex === signatureHeader;
}

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, sortKeysDeep(v)]),
    );
  }
  return value;
}
