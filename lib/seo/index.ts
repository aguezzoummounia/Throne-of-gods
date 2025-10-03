// Import config for utility functions
import { SEO_CONFIG } from "./config";

// Main exports for SEO utilities
export { SEOGenerator } from "./generator";
export { SchemaBuilder } from "./schema-builder";
export { CharacterSEO } from "./character";
export { MobileSEO } from "./mobile";
export { MobileSEOTesting } from "./mobile-testing";
export { SEO_CONFIG, DEFAULT_FALLBACKS } from "./config";
export {
  generateHomepageMetadata,
  generateHomepageSchemas,
  generateHomepageSocialTags,
  generateCompleteHomepageSEO,
  generateHomepageJSONLDScript,
} from "./homepage";
export {
  generateQuizMetadata,
  generateQuizSchema,
  generateQuizBreadcrumbSchema,
  generateQuizSocialMetadata,
  getQuizKeywords,
} from "./quiz";
export {
  generateQuizResultsMetadata,
  generateQuizResultsSchema,
  generateQuizResultsBreadcrumbs,
  generateQuizResultsSocialMetadata,
  extractQuizResultsSEOData,
} from "./quiz-results";
export type { QuizResultsSEOData } from "./quiz-results";
export type {
  SEOConfig,
  JSONLDSchema,
  WebsiteSchema,
  PersonSchema,
  QuizSchema,
  ArticleSchema,
  BreadcrumbSchema,
} from "./types";
export {
  generateSitemapUrls,
  generateSitemapXML,
  generateRobotsTxt,
  validateSitemapUrls,
  getSitemapStats,
  getLastModifiedDate,
  DEFAULT_SITEMAP_CONFIG,
} from "./sitemap";
export { SitemapMonitor } from "./sitemap-monitor";
export type { SitemapUrl, SitemapConfig } from "./sitemap";
export type { SitemapChange } from "./sitemap-monitor";

// Validation and error handling
export { SEOValidator, SEOErrorLogger } from "./validation";
export type { ValidationResult, ImageValidationResult } from "./validation";

// Performance optimization and caching
export {
  OptimizedSEOGenerator,
  SEOPerformanceMonitor,
  SEOCache,
} from "./performance";

// Utility functions for common SEO tasks
export const createPageTitle = (title: string, includeSite = true): string => {
  return includeSite ? `${title} | ${SEO_CONFIG.siteName}` : title;
};

export const truncateDescription = (
  description: string,
  maxLength = 160
): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + "...";
};

export const generateImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) return imagePath;
  return `${SEO_CONFIG.siteUrl}${imagePath}`;
};

export const createCanonicalUrl = (path: string): string => {
  return `${SEO_CONFIG.siteUrl}${path}`;
};
