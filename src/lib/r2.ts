import "server-only";
import { getCloudflareEnv } from "@/lib/cloudflare";

export type R2BucketName = "EBOOKS_BUCKET" | "ASSETS_BUCKET";

/** Streams an object out of a private R2 bucket. Returns null if missing. */
export async function readR2Object(bucket: R2BucketName, key: string) {
  const env = await getCloudflareEnv();
  if (!env) throw new Error("R2 is only available in the Cloudflare runtime.");
  const object = await env[bucket].get(key);
  if (!object) return null;
  return object;
}

export async function putR2Object(
  bucket: R2BucketName,
  key: string,
  body: ReadableStream | ArrayBuffer | Uint8Array,
  options?: { contentType?: string; sha256?: string },
) {
  const env = await getCloudflareEnv();
  if (!env) throw new Error("R2 is only available in the Cloudflare runtime.");
  // Cast: `body` is typed against the DOM ReadableStream, while R2Bucket#put
  // expects @cloudflare/workers-types' ReadableStream — identical at
  // runtime (both are the Workers-runtime stream), just declared twice.
  await env[bucket].put(key, body as never, {
    httpMetadata: options?.contentType ? { contentType: options.contentType } : undefined,
    sha256: options?.sha256,
  });
}

export async function deleteR2Object(bucket: R2BucketName, key: string) {
  const env = await getCloudflareEnv();
  if (!env) throw new Error("R2 is only available in the Cloudflare runtime.");
  await env[bucket].delete(key);
}

export function assetPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_ASSETS_URL ?? "";
  return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}
