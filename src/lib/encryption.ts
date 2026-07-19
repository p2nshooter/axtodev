import "server-only";

// AES-256-GCM via Web Crypto (works identically on the Workers runtime and
// local Node dev — no node:crypto dependency). Used to encrypt third-party
// API credentials (Resend, NOWPayments, PayPal, crypto wallet addresses)
// at rest in SiteSetting so nothing sensitive is hardcoded in source or
// stored in plaintext. The master key itself (APP_ENCRYPTION_KEY) must
// stay in environment/secrets — encrypting it with itself would be
// circular — but every other credential lives encrypted in the database
// and is admin-editable at runtime without a redeploy.

function getMasterKeyMaterial(): string {
  const key = process.env.APP_ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error(
      "APP_ENCRYPTION_KEY is not configured (needs to be >=32 chars). Generate one with: openssl rand -base64 32",
    );
  }
  return key;
}

async function getKey(): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(getMasterKeyMaterial()).slice(0, 32);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

/** Encrypts a secret value. Output is a single opaque base64 string safe to store in a text column. */
export async function encryptSecret(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return toBase64(combined);
}

export async function decryptSecret(encoded: string): Promise<string> {
  const key = await getKey();
  const combined = fromBase64(encoded);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

/** True if this exact value is already ciphertext produced by encryptSecret (best-effort check via decrypt attempt). */
export async function looksEncrypted(value: string): Promise<boolean> {
  try {
    await decryptSecret(value);
    return true;
  } catch {
    return false;
  }
}
