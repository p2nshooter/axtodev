import "server-only";
import { getPrisma } from "@/lib/prisma";
import { encryptSecret, decryptSecret } from "@/lib/encryption";

// Every credential an admin can rotate at runtime without a redeploy.
// Values are stored AES-256-GCM encrypted in SiteSetting (see
// src/lib/encryption.ts) — never in source, never in plaintext at rest.
export const SETTING_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "NOWPAYMENTS_API_KEY",
  "NOWPAYMENTS_IPN_SECRET",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
  "CRYPTO_ADDRESS_BTC",
  "CRYPTO_ADDRESS_ETH",
  "CRYPTO_ADDRESS_BNB",
  "CRYPTO_ADDRESS_SOL",
  "CRYPTO_ADDRESS_USDT_TRC20",
  "CRYPTO_ADDRESS_DOGE",
  "NVIDIA_API_KEY_PRIMARY",
  "NVIDIA_API_KEY_SPEAKER_DETECTION",
  "NVIDIA_API_KEY_VISION",
  "NVIDIA_API_KEY_EXTRA",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

const SETTING_LABELS: Record<SettingKey, string> = {
  RESEND_API_KEY: "Resend API Key",
  RESEND_FROM_EMAIL: "Resend From Address",
  NOWPAYMENTS_API_KEY: "NOWPayments API Key",
  NOWPAYMENTS_IPN_SECRET: "NOWPayments IPN Secret",
  PAYPAL_CLIENT_ID: "PayPal Client ID",
  PAYPAL_CLIENT_SECRET: "PayPal Client Secret",
  PAYPAL_WEBHOOK_ID: "PayPal Webhook ID",
  CRYPTO_ADDRESS_BTC: "BTC Receiving Address",
  CRYPTO_ADDRESS_ETH: "ETH Receiving Address",
  CRYPTO_ADDRESS_BNB: "BNB Receiving Address",
  CRYPTO_ADDRESS_SOL: "SOL Receiving Address",
  CRYPTO_ADDRESS_USDT_TRC20: "USDT (TRC20) Receiving Address",
  CRYPTO_ADDRESS_DOGE: "DOGE Receiving Address",
  NVIDIA_API_KEY_PRIMARY: "NVIDIA API Key (Primary)",
  NVIDIA_API_KEY_SPEAKER_DETECTION: "NVIDIA API Key (Maxine Active Speaker Detection)",
  NVIDIA_API_KEY_VISION: "NVIDIA API Key (Nemotron-Nano VL Image/Video)",
  NVIDIA_API_KEY_EXTRA: "NVIDIA API Key (Additional)",
};

export function settingLabel(key: SettingKey): string {
  return SETTING_LABELS[key];
}

const settingCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 30_000;

/**
 * Reads a runtime-configurable credential: DB (encrypted) first, then the
 * matching environment variable as a bootstrap/fallback so the app keeps
 * working before an admin has set anything via /admin/settings.
 */
export async function getSetting(key: SettingKey): Promise<string | undefined> {
  const cached = settingCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value || undefined;

  const prisma = await getPrisma();
  const row = await prisma.siteSetting.findUnique({ where: { key: `secret:${key}` } });

  let value: string | undefined;
  if (row) {
    try {
      value = await decryptSecret(row.value);
    } catch {
      value = undefined; // corrupted/foreign-key-rotated ciphertext — fail closed, not into plaintext
    }
  }
  value ??= process.env[key];

  settingCache.set(key, { value: value ?? "", expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function getSettings(keys: SettingKey[]): Promise<Record<string, string | undefined>> {
  const entries = await Promise.all(keys.map(async (k) => [k, await getSetting(k)] as const));
  return Object.fromEntries(entries);
}

/** Admin-only write path — see requireAdmin() call in the calling server action. */
export async function setSetting(key: SettingKey, value: string, actorUserId: string): Promise<void> {
  const prisma = await getPrisma();
  const encrypted = await encryptSecret(value);

  await prisma.siteSetting.upsert({
    where: { key: `secret:${key}` },
    create: { key: `secret:${key}`, value: encrypted },
    update: { value: encrypted },
  });

  settingCache.delete(key);

  await prisma.auditLog.create({
    data: {
      userId: actorUserId,
      action: "settings.update",
      entity: "SiteSetting",
      entityId: key,
      // Never log the value itself — only which key changed.
      metadata: JSON.stringify({ key }),
    },
  });
}

/** For the admin UI: which keys are configured (DB or env), without ever exposing the value. */
export async function getSettingsStatus(): Promise<Array<{ key: SettingKey; label: string; configured: boolean; source: "database" | "environment" | "unset" }>> {
  const prisma = await getPrisma();
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: SETTING_KEYS.map((k) => `secret:${k}`) } },
  });
  const dbKeys = new Set(rows.map((r) => r.key.replace(/^secret:/, "")));

  return SETTING_KEYS.map((key) => {
    if (dbKeys.has(key)) return { key, label: settingLabel(key), configured: true, source: "database" as const };
    if (process.env[key]) return { key, label: settingLabel(key), configured: true, source: "environment" as const };
    return { key, label: settingLabel(key), configured: false, source: "unset" as const };
  });
}
