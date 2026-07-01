import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";

function buildAuth(prisma: PrismaClient) {
  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL,
    database: prismaAdapter(prisma, { provider: "sqlite" }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // flip on once sendVerificationEmail is confirmed working in production
      minPasswordLength: 10,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your AXTO.dev password",
          html: `<p>Click to reset your password: <a href="${url}">${url}</a></p>`,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your AXTO.dev email",
          html: `<p>Click to verify your email: <a href="${url}">${url}</a></p>`,
        });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refresh once per day
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "CUSTOMER", input: false },
        deletedAt: { type: "date", required: false, input: false },
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 20,
    },
  });
}

let cachedAuth: ReturnType<typeof buildAuth> | undefined;

/**
 * Builds the Better Auth instance bound to the current request's Prisma
 * client (see getPrisma — on Cloudflare this is a fresh D1-backed client
 * per request, so we don't memoize it there; locally the client itself is
 * already a singleton so memoizing the auth instance is safe/fast).
 */
export async function getAuth() {
  const isD1 = Boolean(process.env.CF_PAGES);
  if (!isD1 && cachedAuth) return cachedAuth;

  const prisma = await getPrisma();
  const instance = buildAuth(prisma);

  if (!isD1) cachedAuth = instance;
  return instance;
}

export type Auth = Awaited<ReturnType<typeof getAuth>>;
