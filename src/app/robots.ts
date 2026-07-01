import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account", "/library", "/orders", "/checkout", "/cart"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
