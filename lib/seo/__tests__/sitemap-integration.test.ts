import { describe, it, expect } from "vitest";
import {
  generateSitemapUrls,
  generateSitemapXML,
  generateRobotsTxt,
} from "../sitemap";

describe("Sitemap Integration", () => {
  it("should generate a complete sitemap with all expected pages", () => {
    const urls = generateSitemapUrls();

    // Should have homepage
    const homepageUrl = urls.find((u) => u.priority === 1.0);
    expect(homepageUrl).toBeDefined();

    // Should have quiz page
    expect(urls.some((u) => u.url.includes("/quiz"))).toBe(true);

    // Should have character pages
    const characterPages = urls.filter((u) => u.url.includes("/characters/"));
    expect(characterPages.length).toBeGreaterThan(0);

    // Should have quiz result pages
    const resultPages = urls.filter((u) => u.url.includes("/quiz/results/"));
    expect(resultPages.length).toBeGreaterThan(0);

    // Character and result pages should match
    expect(characterPages.length).toBe(resultPages.length);

    console.log(`Generated ${urls.length} URLs for sitemap`);
    console.log(`Character pages: ${characterPages.length}`);
    console.log(`Result pages: ${resultPages.length}`);
  });

  it("should generate valid XML that can be parsed", () => {
    const urls = generateSitemapUrls();
    const xml = generateSitemapXML(urls);

    // Basic XML validation
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    );
    expect(xml).toContain("</urlset>");

    // Should contain actual URLs
    expect(xml).toContain("<loc>");
    expect(xml).toContain("</loc>");

    // Should contain metadata
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain("<changefreq>");
    expect(xml).toContain("<priority>");

    console.log(`Generated XML with ${xml.length} characters`);
  });

  it("should generate robots.txt with sitemap reference", () => {
    const robotsTxt = generateRobotsTxt();

    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(robotsTxt).toContain("Sitemap:");
    expect(robotsTxt).toContain("/sitemap.xml");
    expect(robotsTxt).toContain("Disallow: /api/");
    expect(robotsTxt).toContain("Disallow: /_next/");

    console.log(`Generated robots.txt with ${robotsTxt.length} characters`);
  });

  it("should include all character slugs in sitemap", () => {
    const urls = generateSitemapUrls();

    // Extract character slugs from URLs
    const characterSlugs = urls
      .filter((u) => u.url.includes("/characters/"))
      .map((u) => u.url.split("/characters/")[1]);

    const resultSlugs = urls
      .filter((u) => u.url.includes("/quiz/results/"))
      .map((u) => u.url.split("/quiz/results/")[1]);

    // Should have same slugs for both character and result pages
    expect(characterSlugs.sort()).toEqual(resultSlugs.sort());

    // Should have expected characters (based on data)
    expect(characterSlugs).toContain("jarvan");
    expect(characterSlugs).toContain("valeon");
    expect(characterSlugs).toContain("leticia");

    console.log(`Character slugs: ${characterSlugs.join(", ")}`);
  });
});
