import type { D1Database, KVNamespace, R2Bucket } from "@cloudflare/workers-types";

// `@cloudflare/next-on-pages` declares a global, empty `CloudflareEnv`
// interface for consumers to augment via declaration merging — this is
// that augmentation, giving `getRequestContext().env` our real binding
// types everywhere in the app.
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    EBOOKS_BUCKET: R2Bucket;
    ASSETS_BUCKET: R2Bucket;
    CACHE: KVNamespace;
  }
}

export type { CloudflareEnv };

/**
 * Resolves Cloudflare Pages bindings (D1 / R2 / KV) at request time.
 * On Cloudflare, `@cloudflare/next-on-pages` exposes them via
 * `getRequestContext().env`; locally (`next dev`) that import fails, so we
 * fall back to `undefined` and callers use local dev alternatives
 * (SQLite file, filesystem, in-memory cache — see src/lib/prisma.ts).
 */
export async function getCloudflareEnv(): Promise<CloudflareEnv | undefined> {
  try {
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    return getRequestContext().env;
  } catch {
    return undefined;
  }
}
