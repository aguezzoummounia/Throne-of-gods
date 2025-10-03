import { SEOConfig, JSONLDSchema } from "./types";
import { SEOGenerator } from "./generator";

/**
 * Simplified performance optimization for SEO metadata generation
 */

/**
 * Simple in-memory cache for SEO data
 */
class SEOCache {
  private static cache = new Map<string, any>();
  private static readonly MAX_CACHE_SIZE = 100;

  /**
   * Get cached data
   */
  static get<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  /**
   * Set cached data
   */
  static set<T>(key: string, data: T): void {
    // Simple cache size management
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, data);
  }

  /**
   * Clear specific cache entry
   */
  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
    };
  }
}

/**
 * Simplified SEO generator with basic caching
 */
export class OptimizedSEOGenerator extends SEOGenerator {
  /**
   * Generate metadata with simple caching
   */
  static generateMetadataWithCache(config: SEOConfig, cacheKey?: string): any {
    const key = cacheKey || this.generateCacheKey(config);

    // Try to get from cache first
    const cached = SEOCache.get(key);
    if (cached) {
      return cached;
    }

    // Generate metadata and cache it
    const metadata = super.generateMetadata(config);
    SEOCache.set(key, metadata);

    return metadata;
  }

  /**
   * Generate JSON-LD with caching
   */
  static generateJSONLDWithCache(
    schema: JSONLDSchema,
    cacheKey?: string
  ): string {
    const key =
      cacheKey || `jsonld_${schema["@type"]}_${this.hashObject(schema)}`;

    // Try cache first
    const cached = SEOCache.get<string>(key);
    if (cached) {
      return cached;
    }

    // Generate and cache
    const jsonldScript = super.generateJSONLDScript(schema);
    SEOCache.set(key, jsonldScript);

    return jsonldScript;
  }

  /**
   * Clear cache for specific key or all cache
   */
  static clearCache(key?: string): void {
    if (key) {
      SEOCache.delete(key);
    } else {
      SEOCache.clear();
    }
  }

  /**
   * Generate simple cache key from SEO configuration
   */
  private static generateCacheKey(config: SEOConfig): string {
    const keyParts = [
      config.title,
      config.description,
      config.url || "",
      config.type || "website",
    ];

    return `seo_${this.hashString(keyParts.join("|"))}`;
  }

  /**
   * Simple hash function for strings
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Hash object for cache key generation
   */
  private static hashObject(obj: any): string {
    return this.hashString(JSON.stringify(obj));
  }
}

/**
 * Simple performance tracking for SEO operations
 */
export class SEOPerformanceMonitor {
  private static metrics = new Map<
    string,
    { count: number; totalTime: number }
  >();

  /**
   * Measure execution time of SEO operations
   */
  static measure<T>(operation: string, fn: () => T): T {
    const startTime = performance.now();

    try {
      const result = fn();
      const endTime = performance.now();
      this.recordMetric(operation, endTime - startTime);
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordMetric(operation, endTime - startTime);
      throw error;
    }
  }

  /**
   * Get simple performance metrics
   */
  static getMetrics() {
    const result: Record<string, { count: number; avgTime: number }> = {};

    for (const [operation, data] of this.metrics.entries()) {
      result[operation] = {
        count: data.count,
        avgTime: Math.round((data.totalTime / data.count) * 100) / 100,
      };
    }

    return result;
  }

  /**
   * Clear performance metrics
   */
  static clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Record performance metric
   */
  private static recordMetric(operation: string, time: number): void {
    const existing = this.metrics.get(operation);

    if (existing) {
      existing.totalTime += time;
      existing.count++;
    } else {
      this.metrics.set(operation, {
        totalTime: time,
        count: 1,
      });
    }
  }
}

// Export cache utilities for external use
export { SEOCache };
