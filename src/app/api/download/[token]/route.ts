import { NextResponse } from "next/server";

export const runtime = "edge";

// Downloads are disabled — every book is free to read and listen to online but
// not downloadable (owner). Any old download link now returns a friendly note.
export async function GET() {
  return NextResponse.json(
    {
      error: "downloads_disabled",
      message: "Downloads are turned off. Every book is free to read and listen to online.",
    },
    { status: 410 }
  );
}
