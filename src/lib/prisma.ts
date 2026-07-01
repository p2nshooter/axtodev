import { PrismaClient } from "@prisma/client";
import { getCloudflareEnv } from "@/lib/cloudflare";

// Cloudflare Workers/Pages create a fresh module scope per request in some
// runtimes, so we memoize on `globalThis` the same way the Next.js docs
// recommend for serverless Prisma usage, keyed separately for the D1-backed
// client vs. the local dev client.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Returns a PrismaClient bound to the current request's D1 database on
 * Cloudflare, or a plain local client (SQLite file via DATABASE_URL) during
 * `next dev` / tests. Always await this — do not import a top-level
 * singleton, since the D1 binding is only available inside a request.
 */
export async function getPrisma(): Promise<PrismaClient> {
  const env = await getCloudflareEnv();

  if (env?.DB) {
    const { PrismaD1 } = await import("@prisma/adapter-d1");
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
