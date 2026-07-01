import "server-only";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function getCurrentSession() {
  const auth = await getAuth();
  const hdrs = await headers();
  return auth.api.getSession({ headers: hdrs });
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const role = (user as unknown as { role?: string }).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "EDITOR" && role !== "SUPPORT") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
