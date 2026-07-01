import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://axto.dev";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account", "/library", "/orders", "/checkout", "/cart"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
