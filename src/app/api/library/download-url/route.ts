import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { issueDownloadUrl, EntitlementError } from "@/server/library-service";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await getCurrentSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { allowed } = await rateLimit(`download-url:${session.user.id}`, 20, 60);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const url = new URL(request.url);
  const bookId = url.searchParams.get("bookId");
  const languageId = url.searchParams.get("languageId");
  const format = url.searchParams.get("format") as "PDF" | "EPUB" | null;

  if (!bookId || !languageId || (format !== "PDF" && format !== "EPUB")) {
    return NextResponse.json({ error: "bookId, languageId and a valid format are required" }, { status: 400 });
  }

  try {
    const result = await issueDownloadUrl({ userId: session.user.id, bookId, languageId, format });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof EntitlementError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
