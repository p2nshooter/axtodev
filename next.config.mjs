/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.axto.dev" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

// Enables `wrangler pages dev` / Cloudflare bindings inside `next dev`.
// Safe no-op in environments where the package isn't installed (e.g. CI lint-only steps).
if (process.env.NODE_ENV === "development") {
  try {
    const { setupDevPlatform } = await import("@cloudflare/next-on-pages/next-dev");
    await setupDevPlatform();
  } catch {
    // @cloudflare/next-on-pages not installed yet — ignore during initial setup.
  }
}
