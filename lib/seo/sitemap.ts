import { quizData } from "../data";
import type { VillainKey } from "../types";

export interface SitemapUrl {
  url: string;
  lastModified?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export interface SitemapConfig {
  baseUrl: string;
  defaultChangeFreq: SitemapUrl["changeFrequency"];
  defaultPriority: number;
}

/**
 * Default sitemap configuration
 */
export const DEFAULT_SITEMAP_CONFIG: SitemapConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://throneofgods.com",
  defaultChangeFreq: "weekly",
  defaultPriority: 0.5,
};

/**
 * Generate sitemap URLs for all discoverable pages
 */
export function generateSitemapUrls(
  config: SitemapConfig = DEFAULT_SITEMAP_CONFIG
): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const now = new Date();

  // Homepage - highest priority, changes frequently
  urls.push({
    url: config.baseUrl,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // Quiz page - high priority for engagement
  urls.push({
    url: `${config.baseUrl}/quiz`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  });

  // Character profile pages - dynamic based on data
  const characterSlugs = Object.keys(quizData.villains) as VillainKey[];
  for (const slug of characterSlugs) {
    urls.push({
      url: `${config.baseUrl}/characters/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    // Quiz results pages (same as character pages but different context)
    urls.push({
      url: `${config.baseUrl}/quiz/results/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return urls;
}

/**
 * Generate XML sitemap content
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map((urlData) => {
      const { url, lastModified, changeFrequency, priority } = urlData;

      let urlElement = `  <url>\n    <loc>${url}</loc>`;

      if (lastModified) {
        urlElement += `\n    <lastmod>${lastModified.toISOString()}</lastmod>`;
      }

      if (changeFrequency) {
        urlElement += `\n    <changefreq>${changeFrequency}</changefreq>`;
      }

      if (priority !== undefined) {
        urlElement += `\n    <priority>${priority.toFixed(1)}</priority>`;
      }

      urlElement += "\n  </url>";
      return urlElement;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(
  config: SitemapConfig = DEFAULT_SITEMAP_CONFIG
): string {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${config.baseUrl}/sitemap.xml

# Optimize crawling
Crawl-delay: 1

# Block unnecessary paths
Disallow: /api/
Disallow: /_next/
Disallow: /favicon.ico
`;
}

/**
 * Get the last modified date for dynamic content
 * This can be enhanced to check actual file modification times or database timestamps
 */
export function getLastModifiedDate(): Date {
  // For now, return current date
  // In a real application, this could check:
  // - File modification times
  // - Database update timestamps
  // - Content management system last update
  return new Date();
}

/**
 * Validate sitemap URLs
 */
export function validateSitemapUrls(urls: SitemapUrl[]): {
  valid: SitemapUrl[];
  invalid: SitemapUrl[];
} {
  const valid: SitemapUrl[] = [];
  const invalid: SitemapUrl[] = [];

  for (const urlData of urls) {
    try {
      // Basic URL validation
      new URL(urlData.url);

      // Check priority range
      if (
        urlData.priority !== undefined &&
        (urlData.priority < 0 || urlData.priority > 1)
      ) {
        invalid.push(urlData);
        continue;
      }

      valid.push(urlData);
    } catch {
      invalid.push(urlData);
    }
  }

  return { valid, invalid };
}

/**
 * Get sitemap statistics
 */
export function getSitemapStats(urls: SitemapUrl[]) {
  const stats = {
    totalUrls: urls.length,
    byPriority: {
      high: urls.filter((u) => (u.priority || 0) >= 0.8).length,
      medium: urls.filter(
        (u) => (u.priority || 0) >= 0.5 && (u.priority || 0) < 0.8
      ).length,
      low: urls.filter((u) => (u.priority || 0) < 0.5).length,
    },
    byChangeFreq: {} as Record<string, number>,
  };

  // Count by change frequency
  for (const url of urls) {
    const freq = url.changeFrequency || "unknown";
    stats.byChangeFreq[freq] = (stats.byChangeFreq[freq] || 0) + 1;
  }

  return stats;
}
