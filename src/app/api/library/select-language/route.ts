import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { grantLanguageEntitlement, EntitlementError } from "@/server/library-service";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`select-language:${session.user.id}`, 30, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as { bookId?: string; languageId?: string } | null;
  if (!body?.bookId || !body?.languageId) {
    return NextResponse.json({ error: "bookId and languageId are required" }, { status: 400 });
  }

  try {
    await grantLanguageEntitlement(session.user.id, body.bookId, body.languageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EntitlementError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
