import { NextResponse } from "next/server";

export const runtime = "edge";

// Downloads are intentionally disabled across axto.dev — every book is free to
// READ and LISTEN to online, but not downloadable (owner: "matikan download
// e-book, semua gratis dibaca/didengar, tidak bisa di-download"). This single
// choke point turns off the whole download flow regardless of the caller.
export async function GET() {
  return NextResponse.json(
    {
      error: "downloads_disabled",
      message: "Every book is free to read and listen to online — downloads are turned off.",
    },
    { status: 410 }
  );
}
