// /ads.txt served by an Edge route handler (function), NOT a static public
// file. On Cloudflare Pages (next-on-pages) the generated _routes.json can
// drop static files past its 100-rule exclude limit, routing /ads.txt to the
// function which then rendered the app HTML instead of the file (owner:
// "ads.txt error, menampilkan HTML"). A function route is always served.
export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("google.com, pub-6371903555702163, DIRECT, f08c47fec0942fa0\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
