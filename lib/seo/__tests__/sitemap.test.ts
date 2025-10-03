import { describe, it, expect, beforeEach } from "vitest";
import {
  generateSitemapUrls,
  generateSitemapXML,
  generateRobotsTxt,
  validateSitemapUrls,
  getSitemapStats,
  DEFAULT_SITEMAP_CONFIG,
} from "../sitemap";
import { SitemapMonitor } from "../sitemap-monitor";
import type { SitemapUrl, SitemapConfig } from "../sitemap";

describe("Sitemap Generation", () => {
  const testConfig: SitemapConfig = {
    baseUrl: "https://test.com",
    defaultChangeFreq: "weekly",
    defaultPriority: 0.5,
  };

  describe("generateSitemapUrls", () => {
    it("should generate URLs for all page types", () => {
      const urls = generateSitemapUrls(testConfig);

      expect(urls.length).toBeGreaterThan(0);

      // Should include homepage
      const homepage = urls.find((u) => u.url === testConfig.baseUrl);
      expect(homepage).toBeDefined();
      expect(homepage?.priority).toBe(1.0);

      // Should include quiz page
      const quizPage = urls.find((u) => u.url === `${testConfig.baseUrl}/quiz`);
      expect(quizPage).toBeDefined();
      expect(quizPage?.priority).toBe(0.9);

      // Should include character pages
      const characterPages = urls.filter((u) => u.url.includes("/characters/"));
      expect(characterPages.length).toBeGreaterThan(0);

      // Should include quiz result pages
      const resultPages = urls.filter((u) => u.url.includes("/quiz/results/"));
      expect(resultPages.length).toBeGreaterThan(0);

      // Character and result pages should have same count
      expect(characterPages.length).toBe(resultPages.length);
    });

    it("should use default config when none provided", () => {
      const urls = generateSitemapUrls();

      expect(urls.length).toBeGreaterThan(0);
      expect(urls[0].url).toContain(DEFAULT_SITEMAP_CONFIG.baseUrl);
    });

    it("should set appropriate priorities", () => {
      const urls = generateSitemapUrls(testConfig);

      const homepage = urls.find((u) => u.url === testConfig.baseUrl);
      const quizPage = urls.find((u) => u.url === `${testConfig.baseUrl}/quiz`);
      const characterPage = urls.find((u) => u.url.includes("/characters/"));
      const resultPage = urls.find((u) => u.url.includes("/quiz/results/"));

      expect(homepage?.priority).toBe(1.0);
      expect(quizPage?.priority).toBe(0.9);
      expect(characterPage?.priority).toBe(0.8);
      expect(resultPage?.priority).toBe(0.7);
    });
  });

  describe("generateSitemapXML", () => {
    it("should generate valid XML structure", () => {
      const testUrls: SitemapUrl[] = [
        {
          url: "https://test.com",
          lastModified: new Date("2024-01-01"),
          changeFrequency: "daily",
          priority: 1.0,
        },
        {
          url: "https://test.com/quiz",
          lastModified: new Date("2024-01-02"),
          changeFrequency: "weekly",
          priority: 0.9,
        },
      ];

      const xml = generateSitemapXML(testUrls);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      );
      expect(xml).toContain("<loc>https://test.com</loc>");
      expect(xml).toContain("<loc>https://test.com/quiz</loc>");
      expect(xml).toContain("<lastmod>2024-01-01T00:00:00.000Z</lastmod>");
      expect(xml).toContain("<changefreq>daily</changefreq>");
      expect(xml).toContain("<priority>1.0</priority>");
      expect(xml).toContain("</urlset>");
    });

    it("should handle URLs with minimal data", () => {
      const testUrls: SitemapUrl[] = [{ url: "https://test.com" }];

      const xml = generateSitemapXML(testUrls);

      expect(xml).toContain("<loc>https://test.com</loc>");
      expect(xml).not.toContain("<lastmod>");
      expect(xml).not.toContain("<changefreq>");
      expect(xml).not.toContain("<priority>");
    });
  });

  describe("generateRobotsTxt", () => {
    it("should generate valid robots.txt content", () => {
      const robotsTxt = generateRobotsTxt(testConfig);

      expect(robotsTxt).toContain("User-agent: *");
      expect(robotsTxt).toContain("Allow: /");
      expect(robotsTxt).toContain(`Sitemap: ${testConfig.baseUrl}/sitemap.xml`);
      expect(robotsTxt).toContain("Crawl-delay: 1");
      expect(robotsTxt).toContain("Disallow: /api/");
      expect(robotsTxt).toContain("Disallow: /_next/");
    });

    it("should use default config when none provided", () => {
      const robotsTxt = generateRobotsTxt();

      expect(robotsTxt).toContain(
        `Sitemap: ${DEFAULT_SITEMAP_CONFIG.baseUrl}/sitemap.xml`
      );
    });
  });

  describe("validateSitemapUrls", () => {
    it("should validate correct URLs", () => {
      const testUrls: SitemapUrl[] = [
        { url: "https://test.com", priority: 1.0 },
        { url: "https://test.com/quiz", priority: 0.9 },
      ];

      const { valid, invalid } = validateSitemapUrls(testUrls);

      expect(valid).toHaveLength(2);
      expect(invalid).toHaveLength(0);
    });

    it("should identify invalid URLs", () => {
      const testUrls: SitemapUrl[] = [
        { url: "https://test.com", priority: 1.0 },
        { url: "invalid-url", priority: 0.9 },
        { url: "https://test.com/valid", priority: 1.5 }, // Invalid priority
      ];

      const { valid, invalid } = validateSitemapUrls(testUrls);

      expect(valid).toHaveLength(1);
      expect(invalid).toHaveLength(2);
    });

    it("should validate priority ranges", () => {
      const testUrls: SitemapUrl[] = [
        { url: "https://test.com", priority: -0.1 }, // Invalid
        { url: "https://test.com/valid", priority: 0.5 }, // Valid
        { url: "https://test.com/invalid", priority: 1.1 }, // Invalid
      ];

      const { valid, invalid } = validateSitemapUrls(testUrls);

      expect(valid).toHaveLength(1);
      expect(invalid).toHaveLength(2);
    });
  });

  describe("getSitemapStats", () => {
    it("should calculate correct statistics", () => {
      const testUrls: SitemapUrl[] = [
        { url: "https://test.com", priority: 1.0, changeFrequency: "daily" },
        {
          url: "https://test.com/high",
          priority: 0.8,
          changeFrequency: "weekly",
        },
        {
          url: "https://test.com/medium",
          priority: 0.6,
          changeFrequency: "weekly",
        },
        {
          url: "https://test.com/low",
          priority: 0.3,
          changeFrequency: "monthly",
        },
      ];

      const stats = getSitemapStats(testUrls);

      expect(stats.totalUrls).toBe(4);
      expect(stats.byPriority.high).toBe(2); // >= 0.8
      expect(stats.byPriority.medium).toBe(1); // >= 0.5 && < 0.8
      expect(stats.byPriority.low).toBe(1); // < 0.5
      expect(stats.byChangeFreq.daily).toBe(1);
      expect(stats.byChangeFreq.weekly).toBe(2);
      expect(stats.byChangeFreq.monthly).toBe(1);
    });
  });
});

describe("SitemapMonitor", () => {
  let monitor: SitemapMonitor;

  beforeEach(() => {
    monitor = new SitemapMonitor();
  });

  describe("detectChanges", () => {
    it("should initialize without changes", () => {
      const changes = monitor.detectChanges();
      expect(changes).toHaveLength(0);
    });

    it("should provide health status", () => {
      const health = monitor.getHealthStatus();

      expect(health.totalUrls).toBeGreaterThan(0);
      expect(health.characterCount).toBeGreaterThan(0);
      expect(health.isHealthy).toBe(true);
      expect(health.lastUpdate).toBeInstanceOf(Date);
      expect(health.stats).toBeDefined();
    });
  });

  describe("validateUrls", () => {
    it("should validate URLs correctly", async () => {
      const { valid, invalid } = await monitor.validateUrls("https://test.com");

      expect(valid.length).toBeGreaterThan(0);
      expect(invalid.length).toBe(0);

      // All URLs should be valid
      for (const url of valid) {
        expect(() => new URL(url)).not.toThrow();
      }
    });
  });
});
