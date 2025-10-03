import { NextResponse } from "next/server";
import { generateRobotsTxt } from "@/lib/seo/sitemap";

export async function GET() {
  try {
    // Generate robots.txt content
    const robotsTxt = generateRobotsTxt();

    // Return text response with appropriate headers
    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);

    // Return a minimal robots.txt on error
    const fallbackRobots = `User-agent: *
Allow: /

Sitemap: ${
      process.env.NEXT_PUBLIC_SITE_URL || "https://throneofgods.com"
    }/sitemap.xml
`;

    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600", // Shorter cache on error
      },
    });
  }
}
