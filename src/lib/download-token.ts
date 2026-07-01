import "server-only";

// Uses the Web Crypto API (globalThis.crypto) rather than node:crypto so
// this works unmodified on the Cloudflare Workers runtime (no
// nodejs_compat dependency) as well as in local Node dev.

interface TokenPayload {
  userId: string;
  bookId: string;
  languageId: string;
  format: "PDF" | "EPUB";
  exp: number; // unix seconds
}

function getSecret(): string {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) throw new Error("DOWNLOAD_TOKEN_SECRET is not configured.");
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(payload: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

/** Creates a signed, expiring download token (spec: "Signed download
 *  URLs" + "Expiring download links"). The nonce keeps two tokens for the
 *  same payload from being identical, which the download_token unique
 *  index / one-time-use check relies on. */
export async function createDownloadToken(payload: Omit<TokenPayload, "exp">, ttlSeconds: number): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const nonce = base64UrlEncode(crypto.getRandomValues(new Uint8Array(8)));
  const body: TokenPayload & { nonce: string } = { ...payload, exp, nonce };
  const encoded = base64UrlEncode(new TextEncoder().encode(JSON.stringify(body)));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifyDownloadToken(token: string): Promise<(TokenPayload & { nonce: string }) | null> {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const key = await getHmacKey();
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecode(signature) as BufferSource,
    new TextEncoder().encode(encoded),
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encoded))) as TokenPayload & {
      nonce: string;
    };
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
