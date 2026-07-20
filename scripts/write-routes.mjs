// Post-build: replace the next-on-pages generated _routes.json with a compact,
// deliberate one.
//
// Why: next-on-pages emits an exclude rule per static asset and Cloudflare
// Pages caps _routes.json at 100 rules. Past the cap, static files (ads.txt,
// prerendered pages) silently fall through to the Worker — which 404s them or
// burns CPU re-rendering, the direct cause of the live ads.txt 404 and the
// Error 1102s.
//
// This file inverts the strategy: ONLY the genuinely dynamic paths invoke the
// Worker; every other URL is served straight from the static assets (CDN).
import { writeFileSync } from "node:fs";

const routes = {
  version: 1,
  include: [
    "/api/*", // auth, translate, checkout APIs
    "/admin", // owner dashboard (DB-backed)
    "/admin/*",
    "/login", // owner sign-in (unlinked from public UI)
    "/account",
    "/account/*",
    "/orders",
    "/orders/*",
    "/library", // legacy signed-in library
    "/library/*",
    "/cart",
    "/checkout/*",
    "/_next/image*", // image optimizer
  ],
  exclude: ["/_next/static/*", "/ads.txt", "/robots.txt", "/sitemap.xml", "/manifest.webmanifest"],
};

const out = new URL("../.vercel/output/static/_routes.json", import.meta.url);
writeFileSync(out, JSON.stringify(routes, null, 2));
console.log("Wrote custom _routes.json:", JSON.stringify(routes));
