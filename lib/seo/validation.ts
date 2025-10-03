import { SEOConfig, JSONLDSchema } from "./types";
import { SEO_CONFIG, DEFAULT_FALLBACKS } from "./config";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // SEO completeness score out of 100
}

export interface ImageValidationResult {
  isValid: boolean;
  url: string;
  fallbackUsed: boolean;
  error?: string;
}

export class SEOValidator {
  /**
   * Validate SEO configuration completeness and correctness
   */
  static validateSEOConfig(config: Partial<SEOConfig>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Required fields validation
    if (!config.title || config.title.trim().length === 0) {
      errors.push("Title is required");
    } else {
      score += 20;
      if (config.title.length < 30) {
        warnings.push(
          "Title is too short for optimal SEO (recommended: 30-60 characters)"
        );
      } else if (config.title.length > 60) {
        warnings.push(
          "Title is too long for optimal SEO (recommended: 30-60 characters)"
        );
      } else {
        score += 5;
      }
    }

    if (!config.description || config.description.trim().length === 0) {
      errors.push("Description is required");
    } else {
      score += 20;
      if (config.description.length < 120) {
        warnings.push(
          "Description is too short for optimal SEO (recommended: 120-160 characters)"
        );
      } else if (config.description.length > 160) {
        warnings.push(
          "Description is too long for optimal SEO (recommended: 120-160 characters)"
        );
      } else {
        score += 5;
      }
    }

    // Image validation
    if (!config.image?.url) {
      warnings.push("Image is missing - social sharing will use default image");
    } else {
      score += 15;
      const imageValidation = this.validateImageURL(config.image.url);
      if (!imageValidation.isValid) {
        warnings.push(`Image URL validation failed: ${imageValidation.error}`);
      } else {
        score += 5;
      }

      if (!config.image.alt) {
        warnings.push("Image alt text is missing");
      } else {
        score += 5;
      }
    }

    // Keywords validation
    if (!config.keywords || config.keywords.length === 0) {
      warnings.push("Keywords are missing");
    } else {
      score += 10;
      if (config.keywords.length < 3) {
        warnings.push("Consider adding more keywords for better SEO");
      } else {
        score += 5;
      }
    }

    // URL validation
    if (config.url) {
      score += 5;
      if (!this.isValidURL(config.url)) {
        errors.push("Invalid URL format");
      } else {
        score += 5;
      }
    }

    // Type validation
    if (
      config.type &&
      !["website", "article", "profile"].includes(config.type)
    ) {
      errors.push("Invalid content type");
    } else if (config.type) {
      score += 5;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.min(score, 100),
    };
  }

  /**
   * Validate JSON-LD schema structure and required fields
   */
  static validateJSONLDSchema(schema: JSONLDSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    try {
      // Basic structure validation
      if (!schema["@context"]) {
        errors.push("Schema missing @context");
      } else if (schema["@context"] !== "https://schema.org") {
        warnings.push("Schema @context should be https://schema.org");
      } else {
        score += 20;
      }

      if (!schema["@type"]) {
        errors.push("Schema missing @type");
      } else {
        score += 20;
      }

      // Validate JSON serialization
      JSON.stringify(schema);
      score += 10;

      // Type-specific validation
      switch (schema["@type"]) {
        case "WebSite":
          score += this.validateWebsiteSchema(schema, errors, warnings);
          break;
        case "Person":
          score += this.validatePersonSchema(schema, errors, warnings);
          break;
        case "Quiz":
          score += this.validateQuizSchema(schema, errors, warnings);
          break;
        case "Article":
          score += this.validateArticleSchema(schema, errors, warnings);
          break;
        case "Organization":
          score += this.validateOrganizationSchema(schema, errors, warnings);
          break;
        case "BreadcrumbList":
          score += this.validateBreadcrumbListSchema(schema, errors, warnings);
          break;
        default:
          warnings.push(`Unknown schema type: ${schema["@type"]}`);
      }
    } catch (error) {
      errors.push(`Schema JSON serialization failed: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.min(score, 100),
    };
  }

  /**
   * Validate image URL and provide fallback if needed
   */
  static validateImageURL(url: string): ImageValidationResult {
    if (!url || url.trim().length === 0) {
      return {
        isValid: false,
        url: DEFAULT_FALLBACKS.characterImage,
        fallbackUsed: true,
        error: "Empty image URL",
      };
    }

    // Check if URL is properly formatted
    if (!this.isValidURL(url) && !url.startsWith("/")) {
      return {
        isValid: false,
        url: DEFAULT_FALLBACKS.characterImage,
        fallbackUsed: true,
        error: "Invalid URL format",
      };
    }

    // Check file extension
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    const hasValidExtension = validExtensions.some((ext) =>
      url.toLowerCase().includes(ext)
    );

    if (!hasValidExtension) {
      return {
        isValid: false,
        url: DEFAULT_FALLBACKS.characterImage,
        fallbackUsed: true,
        error: "Invalid image file extension",
      };
    }

    return {
      isValid: true,
      url,
      fallbackUsed: false,
    };
  }

  /**
   * Generate fallback SEO configuration for missing or invalid data
   */
  static generateFallbackSEOConfig(
    originalConfig: Partial<SEOConfig>,
    contentType: "character" | "quiz" | "result" | "homepage" = "homepage"
  ): SEOConfig {
    const validation = this.validateSEOConfig(originalConfig);

    const fallbackConfig: SEOConfig = {
      title: originalConfig.title || this.getFallbackTitle(contentType),
      description:
        originalConfig.description || this.getFallbackDescription(contentType),
      keywords: originalConfig.keywords || [...SEO_CONFIG.defaultKeywords],
      image: this.getFallbackImage(originalConfig.image, contentType),
      url: originalConfig.url,
      type: originalConfig.type || this.getFallbackType(contentType),
      publishedTime: originalConfig.publishedTime,
      modifiedTime: originalConfig.modifiedTime,
      author: originalConfig.author || SEO_CONFIG.author,
      siteName: originalConfig.siteName || SEO_CONFIG.siteName,
    };

    // Log validation issues
    if (!validation.isValid) {
      console.warn("SEO validation failed, using fallbacks:", {
        errors: validation.errors,
        warnings: validation.warnings,
        contentType,
      });
    }

    return fallbackConfig;
  }

  /**
   * Check SEO completeness and provide improvement suggestions
   */
  static checkSEOCompleteness(config: SEOConfig): {
    score: number;
    suggestions: string[];
    missingElements: string[];
  } {
    const validation = this.validateSEOConfig(config);
    const suggestions: string[] = [];
    const missingElements: string[] = [];

    // Analyze validation results for suggestions
    validation.warnings.forEach((warning) => {
      if (warning.includes("too short")) {
        suggestions.push(
          "Consider expanding the content for better SEO impact"
        );
      } else if (warning.includes("too long")) {
        suggestions.push(
          "Consider shortening the content to fit within recommended limits"
        );
      } else if (warning.includes("missing")) {
        missingElements.push(warning.replace(" is missing", ""));
      }
    });

    // Additional completeness checks
    if (!config.keywords || config.keywords.length < 5) {
      suggestions.push("Add more relevant keywords to improve discoverability");
    }

    if (!config.image?.alt) {
      suggestions.push(
        "Add descriptive alt text to images for accessibility and SEO"
      );
    }

    if (!config.publishedTime) {
      suggestions.push(
        "Add publication date for better search engine understanding"
      );
    }

    return {
      score: validation.score,
      suggestions,
      missingElements,
    };
  }

  /**
   * Validate and sanitize text content
   */
  static sanitizeAndValidateText(
    text: string,
    maxLength: number = 160
  ): {
    sanitized: string;
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (!text || text.trim().length === 0) {
      warnings.push("Text content is empty");
      return { sanitized: "", warnings };
    }

    // Remove HTML tags
    let sanitized = text.replace(/<[^>]*>/g, "");

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, " ").trim();

    // Check length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength - 3) + "...";
      warnings.push(`Text was truncated to ${maxLength} characters`);
    }

    // Check for potentially problematic characters
    if (sanitized.includes('"') || sanitized.includes("'")) {
      sanitized = sanitized.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      warnings.push("Special characters were escaped for safety");
    }

    return { sanitized, warnings };
  }

  // Private helper methods
  private static validateWebsiteSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.name) {
      errors.push("WebSite schema missing name");
    } else {
      score += 15;
    }

    if (!schema.url) {
      errors.push("WebSite schema missing url");
    } else {
      score += 15;
    }

    if (!schema.description) {
      warnings.push("WebSite schema missing description");
    } else {
      score += 10;
    }

    if (schema.potentialAction) {
      score += 10;
    }

    return score;
  }

  private static validatePersonSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.name) {
      errors.push("Person schema missing name");
    } else {
      score += 20;
    }

    if (!schema.description) {
      warnings.push("Person schema missing description");
    } else {
      score += 15;
    }

    if (!schema.image) {
      warnings.push("Person schema missing image");
    } else {
      score += 10;
    }

    if (schema.additionalProperty && Array.isArray(schema.additionalProperty)) {
      score += 5;
    }

    return score;
  }

  private static validateQuizSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.name) {
      errors.push("Quiz schema missing name");
    } else {
      score += 20;
    }

    if (!schema.description) {
      warnings.push("Quiz schema missing description");
    } else {
      score += 15;
    }

    if (typeof schema.numberOfQuestions !== "number") {
      warnings.push("Quiz schema missing numberOfQuestions");
    } else {
      score += 10;
    }

    if (schema.hasPart && Array.isArray(schema.hasPart)) {
      score += 5;
    }

    return score;
  }

  private static validateArticleSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.headline) {
      errors.push("Article schema missing headline");
    } else {
      score += 20;
    }

    if (!schema.description) {
      warnings.push("Article schema missing description");
    } else {
      score += 15;
    }

    if (!schema.author) {
      warnings.push("Article schema missing author");
    } else {
      score += 10;
    }

    if (!schema.datePublished) {
      warnings.push("Article schema missing datePublished");
    } else {
      score += 5;
    }

    return score;
  }

  private static validateOrganizationSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.name) {
      errors.push("Organization schema missing name");
    } else {
      score += 25;
    }

    if (!schema.url) {
      errors.push("Organization schema missing url");
    } else {
      score += 15;
    }

    if (schema.logo) {
      score += 10;
    }

    return score;
  }

  private static validateBreadcrumbListSchema(
    schema: any,
    errors: string[],
    warnings: string[]
  ): number {
    let score = 0;

    if (!schema.itemListElement) {
      errors.push("BreadcrumbList schema missing itemListElement");
    } else if (!Array.isArray(schema.itemListElement)) {
      errors.push("BreadcrumbList itemListElement must be an array");
    } else {
      score += 30;

      // Validate each breadcrumb item
      schema.itemListElement.forEach((item: any, index: number) => {
        if (!item["@type"] || item["@type"] !== "ListItem") {
          warnings.push(
            `Breadcrumb item ${index + 1} missing or invalid @type`
          );
        } else {
          score += 5;
        }

        if (!item.name) {
          warnings.push(`Breadcrumb item ${index + 1} missing name`);
        } else {
          score += 5;
        }

        if (typeof item.position !== "number") {
          warnings.push(
            `Breadcrumb item ${index + 1} missing or invalid position`
          );
        } else {
          score += 5;
        }

        if (item.item && !this.isValidURL(item.item)) {
          warnings.push(`Breadcrumb item ${index + 1} has invalid URL`);
        }
      });

      // Check if positions are sequential
      const positions = schema.itemListElement
        .map((item: any) => item.position)
        .filter((pos: any) => typeof pos === "number")
        .sort((a: number, b: number) => a - b);

      const expectedPositions = Array.from(
        { length: positions.length },
        (_, i) => i + 1
      );
      if (JSON.stringify(positions) !== JSON.stringify(expectedPositions)) {
        warnings.push(
          "Breadcrumb positions should be sequential starting from 1"
        );
      } else {
        score += 10;
      }
    }

    return Math.min(score, 50); // Cap the score for breadcrumbs
  }

  private static isValidURL(url: string): boolean {
    try {
      // Allow relative URLs starting with /
      if (url.startsWith("/")) {
        return true;
      }
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static getFallbackTitle(contentType: string): string {
    switch (contentType) {
      case "character":
        return "Character Profile - Throne of Gods";
      case "quiz":
        return "Fantasy Personality Quiz - Throne of Gods";
      case "result":
        return "Quiz Results - Throne of Gods";
      default:
        return SEO_CONFIG.defaultTitle;
    }
  }

  private static getFallbackDescription(contentType: string): string {
    switch (contentType) {
      case "character":
        return "Discover the detailed profile of this mysterious character from the Throne of Gods universe.";
      case "quiz":
        return "Take our personality quiz to discover which villain from the Throne of Gods universe matches your character.";
      case "result":
        return "Your personality quiz results reveal your match from the Throne of Gods universe.";
      default:
        return SEO_CONFIG.defaultDescription;
    }
  }

  private static getFallbackImage(originalImage: any, contentType: string) {
    if (originalImage?.url) {
      const validation = this.validateImageURL(originalImage.url);
      if (validation.isValid) {
        return originalImage;
      }
    }

    switch (contentType) {
      case "character":
        return {
          url: DEFAULT_FALLBACKS.characterImage,
          width: 800,
          height: 600,
          alt: "Character from Throne of Gods",
        };
      case "quiz":
        return {
          url: DEFAULT_FALLBACKS.quizImage,
          width: 1200,
          height: 630,
          alt: "Throne of Gods Personality Quiz",
        };
      case "result":
        return {
          url: DEFAULT_FALLBACKS.resultImage,
          width: 1200,
          height: 630,
          alt: "Quiz Results - Throne of Gods",
        };
      default:
        return SEO_CONFIG.defaultImage;
    }
  }

  private static getFallbackType(
    contentType: string
  ): "website" | "article" | "profile" {
    switch (contentType) {
      case "character":
        return "profile";
      case "result":
        return "article";
      default:
        return "website";
    }
  }
}

/**
 * Error logging utility for SEO validation issues
 */
export class SEOErrorLogger {
  private static logs: Array<{
    timestamp: Date;
    level: "error" | "warning" | "info";
    message: string;
    context?: any;
  }> = [];

  static logError(message: string, context?: any) {
    const logEntry = {
      timestamp: new Date(),
      level: "error" as const,
      message,
      context,
    };

    this.logs.push(logEntry);
    console.error(`[SEO Error] ${message}`, context);
  }

  static logWarning(message: string, context?: any) {
    const logEntry = {
      timestamp: new Date(),
      level: "warning" as const,
      message,
      context,
    };

    this.logs.push(logEntry);
    console.warn(`[SEO Warning] ${message}`, context);
  }

  static logInfo(message: string, context?: any) {
    const logEntry = {
      timestamp: new Date(),
      level: "info" as const,
      message,
      context,
    };

    this.logs.push(logEntry);
    console.info(`[SEO Info] ${message}`, context);
  }

  static getLogs(level?: "error" | "warning" | "info") {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  static clearLogs() {
    this.logs.length = 0;
  }

  static getLogsSummary() {
    const errors = this.logs.filter((log) => log.level === "error").length;
    const warnings = this.logs.filter((log) => log.level === "warning").length;
    const info = this.logs.filter((log) => log.level === "info").length;

    return { errors, warnings, info, total: this.logs.length };
  }
}
