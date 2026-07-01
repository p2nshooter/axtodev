import "server-only";
import { getCloudflareEnv } from "@/lib/cloudflare";

const memoryStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Fixed-window rate limiter. Uses Cloudflare KV in production (shared
 * across edge locations) and an in-memory Map during local dev. Applied to
 * login, registration, password reset, search, payment, download, and
 * admin API routes per the spec's rate-limiting requirement.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const env = await getCloudflareEnv();
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucketKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`;

  if (env?.CACHE) {
    const current = Number((await env.CACHE.get(bucketKey)) ?? "0");
    const next = current + 1;
    await env.CACHE.put(bucketKey, String(next), { expirationTtl: windowSeconds + 5 });
    const resetAt = (Math.floor(now / windowMs) + 1) * windowMs;
    return { allowed: next <= limit, remaining: Math.max(0, limit - next), resetAt };
  }

  const entry = memoryStore.get(bucketKey);
  const resetAt = (Math.floor(now / windowMs) + 1) * windowMs;
  if (!entry) {
    memoryStore.set(bucketKey, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }
  entry.count += 1;
  return { allowed: entry.count <= limit, remaining: Math.max(0, limit - entry.count), resetAt };
}

export function clientIp(headers: Headers): string {
  return headers.get("cf-connecting-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
