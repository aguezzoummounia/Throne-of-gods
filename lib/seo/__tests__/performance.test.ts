import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  OptimizedSEOGenerator,
  SEOPerformanceMonitor,
  SEOCache,
} from "../performance";
import { SEOConfig } from "../types";

describe("SEO Performance Optimization", () => {
  const mockConfig: SEOConfig = {
    title: "Test Page",
    description: "Test description for performance testing",
    keywords: ["test", "performance", "seo"],
    image: {
      url: "/test-image.jpg",
      width: 1200,
      height: 630,
      alt: "Test image",
    },
    url: "/test-page",
    type: "website",
  };

  beforeEach(() => {
    SEOCache.clear();
    SEOPerformanceMonitor.clearMetrics();
  });

  afterEach(() => {
    SEOCache.clear();
    SEOPerformanceMonitor.clearMetrics();
  });

  describe("SEOCache", () => {
    it("should store and retrieve cached data", () => {
      const testData = { test: "data" };
      const key = "test-key";

      SEOCache.set(key, testData);
      const retrieved = SEOCache.get(key);

      expect(retrieved).toEqual(testData);
    });

    it("should return null for non-existent keys", () => {
      const result = SEOCache.get("non-existent-key");
      expect(result).toBeNull();
    });

    it("should handle cache size limits", () => {
      // Fill cache beyond limit
      for (let i = 0; i < 150; i++) {
        SEOCache.set(`key-${i}`, `data-${i}`);
      }

      const stats = SEOCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });

    it("should clear all cache entries", () => {
      SEOCache.set("key1", "data1");
      SEOCache.set("key2", "data2");

      expect(SEOCache.getStats().size).toBe(2);

      SEOCache.clear();

      expect(SEOCache.getStats().size).toBe(0);
    });
  });

  describe("OptimizedSEOGenerator", () => {
    it("should generate metadata with caching", () => {
      const metadata1 = OptimizedSEOGenerator.generateMetadataWithCache(
        mockConfig,
        "test-key"
      );
      const metadata2 = OptimizedSEOGenerator.generateMetadataWithCache(
        mockConfig,
        "test-key"
      );

      expect(metadata1).toEqual(metadata2);
      expect(metadata1.title).toBe(mockConfig.title);
      expect(metadata1.description).toBe(mockConfig.description);
    });

    it("should generate JSON-LD with caching", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Site",
        url: "https://example.com",
      };

      const jsonld1 = OptimizedSEOGenerator.generateJSONLDWithCache(
        schema,
        "schema-key"
      );
      const jsonld2 = OptimizedSEOGenerator.generateJSONLDWithCache(
        schema,
        "schema-key"
      );

      expect(jsonld1).toBe(jsonld2);
      expect(jsonld1).toContain('"@type":"WebSite"');
    });

    it("should clear cache for specific keys", () => {
      SEOCache.set("key1", "data1");
      SEOCache.set("key2", "data2");

      OptimizedSEOGenerator.clearCache("key1");

      expect(SEOCache.get("key1")).toBeNull();
      expect(SEOCache.get("key2")).toBe("data2");
    });

    it("should clear all cache", () => {
      SEOCache.set("key1", "data1");
      SEOCache.set("key2", "data2");

      OptimizedSEOGenerator.clearCache();

      expect(SEOCache.get("key1")).toBeNull();
      expect(SEOCache.get("key2")).toBeNull();
    });
  });

  describe("SEOPerformanceMonitor", () => {
    it("should measure synchronous operations", () => {
      const result = SEOPerformanceMonitor.measure("test-operation", () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(result).toBe(499500); // Sum of 0 to 999

      const metrics = SEOPerformanceMonitor.getMetrics();
      expect(metrics["test-operation"]).toBeDefined();
      expect(metrics["test-operation"].count).toBe(1);
      expect(metrics["test-operation"].avgTime).toBeGreaterThan(0);
    });

    it("should track multiple operations", () => {
      // Generate some test metrics
      SEOPerformanceMonitor.measure("fast-op", () => "fast");
      SEOPerformanceMonitor.measure("slow-op", () => {
        // Simulate slower operation
        let sum = 0;
        for (let i = 0; i < 10000; i++) {
          sum += i;
        }
        return sum;
      });

      const metrics = SEOPerformanceMonitor.getMetrics();

      expect(metrics["fast-op"]).toBeDefined();
      expect(metrics["slow-op"]).toBeDefined();
      expect(metrics["fast-op"].count).toBe(1);
      expect(metrics["slow-op"].count).toBe(1);
      expect(metrics["fast-op"].avgTime).toBeGreaterThan(0);
      expect(metrics["slow-op"].avgTime).toBeGreaterThan(0);
    });

    it("should handle errors in measured operations", () => {
      expect(() => {
        SEOPerformanceMonitor.measure("error-operation", () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");

      // Should still record the metric
      const metrics = SEOPerformanceMonitor.getMetrics();
      expect(metrics["error-operation"]).toBeDefined();
    });

    it("should clear metrics", () => {
      SEOPerformanceMonitor.measure("test-op", () => "test");

      expect(Object.keys(SEOPerformanceMonitor.getMetrics())).toHaveLength(1);

      SEOPerformanceMonitor.clearMetrics();

      expect(Object.keys(SEOPerformanceMonitor.getMetrics())).toHaveLength(0);
    });
  });

  describe("Integration Tests", () => {
    it("should improve performance with caching", () => {
      const startTime = performance.now();

      // First generation (no cache)
      OptimizedSEOGenerator.generateMetadataWithCache(mockConfig, "perf-test");
      const firstGenTime = performance.now() - startTime;

      const cacheStartTime = performance.now();

      // Second generation (from cache)
      OptimizedSEOGenerator.generateMetadataWithCache(mockConfig, "perf-test");
      const cachedGenTime = performance.now() - cacheStartTime;

      // Cached version should be faster (though this might be flaky in fast environments)
      expect(cachedGenTime).toBeLessThanOrEqual(firstGenTime + 1); // Allow 1ms tolerance
    });

    it("should handle cache size limits gracefully", () => {
      // Fill cache beyond limit
      for (let i = 0; i < 150; i++) {
        SEOCache.set(`key-${i}`, `data-${i}`);
      }

      const stats = SEOCache.getStats();
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });
  });
});
