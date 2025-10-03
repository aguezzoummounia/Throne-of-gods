import { NextResponse } from "next/server";
import {
  generateSitemapUrls,
  generateSitemapXML,
  validateSitemapUrls,
} from "@/lib/seo/sitemap";

export async function GET() {
  try {
    // Generate sitemap URLs
    const urls = generateSitemapUrls();

    // Validate URLs
    const { valid, invalid } = validateSitemapUrls(urls);

    // Log any invalid URLs in development
    if (invalid.length > 0 && process.env.NODE_ENV === "development") {
      console.warn("Invalid sitemap URLs found:", invalid);
    }

    // Generate XML content
    const sitemapXML = generateSitemapXML(valid);

    // Return XML response with appropriate headers
    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return a minimal sitemap on error
    const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_SITE_URL || "https://throneofgods.com"}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackXML, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300", // Shorter cache on error
      },
    });
  }
}
