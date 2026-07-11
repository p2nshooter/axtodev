import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account", "/library", "/orders", "/checkout", "/cart"] },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "AdsBot-Google", allow: "/" },
      { userAgent: "Mediapartners-Google", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
