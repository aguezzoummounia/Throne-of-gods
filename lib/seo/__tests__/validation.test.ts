import { describe, it, expect, beforeEach, vi } from "vitest";
import { SEOValidator, SEOErrorLogger } from "../validation";
import { SEOConfig, JSONLDSchema } from "../types";

describe("SEOValidator", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
  });

  describe("validateSEOConfig", () => {
    it("should validate complete SEO configuration", () => {
      const config: SEOConfig = {
        title: "Test Title - Perfect Length for SEO",
        description:
          "This is a test description that is exactly the right length for optimal SEO performance and user engagement.",
        keywords: ["test", "seo", "validation", "fantasy", "quiz"],
        image: {
          url: "/images/test.jpg",
          width: 1200,
          height: 630,
          alt: "Test image",
        },
        url: "/test",
        type: "article",
        author: "Test Author",
        siteName: "Test Site",
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(80);
    });

    it("should detect missing required fields", () => {
      const config: Partial<SEOConfig> = {
        keywords: ["test"],
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Title is required");
      expect(validation.errors).toContain("Description is required");
      expect(validation.score).toBeLessThan(50);
    });

    it("should warn about suboptimal content lengths", () => {
      const config: Partial<SEOConfig> = {
        title: "Short",
        description: "Too short",
        keywords: ["test"],
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.warnings).toContain(
        "Title is too short for optimal SEO (recommended: 30-60 characters)"
      );
      expect(validation.warnings).toContain(
        "Description is too short for optimal SEO (recommended: 120-160 characters)"
      );
    });

    it("should warn about missing image", () => {
      const config: Partial<SEOConfig> = {
        title: "Test Title with Good Length for SEO",
        description:
          "This is a good description that meets the recommended length requirements for optimal search engine optimization.",
        keywords: ["test"],
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.warnings).toContain(
        "Image is missing - social sharing will use default image"
      );
    });

    it("should validate URL format", () => {
      const config: Partial<SEOConfig> = {
        title: "Test Title with Good Length for SEO",
        description:
          "This is a good description that meets the recommended length requirements for optimal search engine optimization.",
        url: "invalid-url-format",
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.errors).toContain("Invalid URL format");
    });

    it("should validate content type", () => {
      const config: Partial<SEOConfig> = {
        title: "Test Title with Good Length for SEO",
        description:
          "This is a good description that meets the recommended length requirements for optimal search engine optimization.",
        type: "invalid-type" as any,
      };

      const validation = SEOValidator.validateSEOConfig(config);

      expect(validation.errors).toContain("Invalid content type");
    });
  });

  describe("validateJSONLDSchema", () => {
    it("should validate complete WebSite schema", () => {
      const schema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        description: "Test website description",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://example.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };

      const validation = SEOValidator.validateJSONLDSchema(schema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(70);
    });

    it("should detect missing required schema fields", () => {
      const schema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
      };

      const validation = SEOValidator.validateJSONLDSchema(schema);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("WebSite schema missing name");
      expect(validation.errors).toContain("WebSite schema missing url");
    });

    it("should validate Person schema", () => {
      const schema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: "Test person description",
        image: "/images/person.jpg",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Role",
            value: "Test Role",
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(schema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should validate Quiz schema", () => {
      const schema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: "Test Quiz",
        description: "Test quiz description",
        numberOfQuestions: 10,
        hasPart: [
          {
            "@type": "Question",
            name: "Question 1",
            text: "What is your favorite color?",
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(schema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should handle invalid JSON", () => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        circularRef: null as any,
      };

      // Create circular reference
      schema.circularRef = schema;

      const validation = SEOValidator.validateJSONLDSchema(
        schema as JSONLDSchema
      );

      expect(validation.isValid).toBe(false);
      expect(
        validation.errors.some((error) =>
          error.includes("JSON serialization failed")
        )
      ).toBe(true);
    });

    it("should warn about unknown schema types", () => {
      const schema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "UnknownType",
        name: "Test",
      };

      const validation = SEOValidator.validateJSONLDSchema(schema);

      expect(validation.warnings).toContain("Unknown schema type: UnknownType");
    });
  });

  describe("validateImageURL", () => {
    it("should validate correct image URLs", () => {
      const validation = SEOValidator.validateImageURL("/images/test.jpg");

      expect(validation.isValid).toBe(true);
      expect(validation.fallbackUsed).toBe(false);
      expect(validation.url).toBe("/images/test.jpg");
    });

    it("should handle empty URLs", () => {
      const validation = SEOValidator.validateImageURL("");

      expect(validation.isValid).toBe(false);
      expect(validation.fallbackUsed).toBe(true);
      expect(validation.error).toBe("Empty image URL");
    });

    it("should handle invalid URL formats", () => {
      const validation = SEOValidator.validateImageURL("not-a-valid-url");

      expect(validation.isValid).toBe(false);
      expect(validation.fallbackUsed).toBe(true);
      expect(validation.error).toBe("Invalid URL format");
    });

    it("should handle invalid file extensions", () => {
      const validation = SEOValidator.validateImageURL("/images/test.txt");

      expect(validation.isValid).toBe(false);
      expect(validation.fallbackUsed).toBe(true);
      expect(validation.error).toBe("Invalid image file extension");
    });

    it("should accept various image formats", () => {
      const formats = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

      formats.forEach((format) => {
        const validation = SEOValidator.validateImageURL(
          `/images/test${format}`
        );
        expect(validation.isValid).toBe(true);
      });
    });
  });

  describe("generateFallbackSEOConfig", () => {
    it("should generate fallback for character content", () => {
      const originalConfig: Partial<SEOConfig> = {
        title: "",
        description: "",
      };

      const fallback = SEOValidator.generateFallbackSEOConfig(
        originalConfig,
        "character"
      );

      expect(fallback.title).toBe("Character Profile - Throne of Gods");
      expect(fallback.description).toContain("mysterious character");
      expect(fallback.type).toBe("profile");
    });

    it("should generate fallback for quiz content", () => {
      const originalConfig: Partial<SEOConfig> = {};

      const fallback = SEOValidator.generateFallbackSEOConfig(
        originalConfig,
        "quiz"
      );

      expect(fallback.title).toBe("Fantasy Personality Quiz - Throne of Gods");
      expect(fallback.description).toContain("personality quiz");
      expect(fallback.type).toBe("website");
    });

    it("should preserve valid original values", () => {
      const originalConfig: Partial<SEOConfig> = {
        title: "Valid Title for SEO Optimization",
        description:
          "This is a valid description that meets all the requirements for optimal search engine optimization and user engagement.",
        keywords: ["valid", "keywords"],
      };

      const fallback = SEOValidator.generateFallbackSEOConfig(originalConfig);

      expect(fallback.title).toBe(originalConfig.title);
      expect(fallback.description).toBe(originalConfig.description);
      expect(fallback.keywords).toEqual(originalConfig.keywords);
    });
  });

  describe("checkSEOCompleteness", () => {
    it("should provide completeness score and suggestions", () => {
      const config: SEOConfig = {
        title: "Short",
        description: "Also short",
        keywords: ["one"],
        image: {
          url: "/images/test.jpg",
          width: 1200,
          height: 630,
          alt: "",
        },
        author: "Test Author",
        siteName: "Test Site",
      };

      const completeness = SEOValidator.checkSEOCompleteness(config);

      expect(completeness.score).toBeLessThan(100);
      expect(completeness.suggestions.length).toBeGreaterThan(0);
      expect(completeness.missingElements.length).toBeGreaterThan(0);
      expect(completeness.suggestions).toContain(
        "Add more relevant keywords to improve discoverability"
      );
      expect(completeness.suggestions).toContain(
        "Add descriptive alt text to images for accessibility and SEO"
      );
    });

    it("should suggest publication date", () => {
      const config: SEOConfig = {
        title: "Good Title Length for SEO Optimization",
        description:
          "This is a good description that meets the recommended length requirements for optimal search engine optimization.",
        keywords: ["test", "seo", "validation"],
        image: {
          url: "/images/test.jpg",
          width: 1200,
          height: 630,
          alt: "Test image",
        },
        author: "Test Author",
        siteName: "Test Site",
      };

      const completeness = SEOValidator.checkSEOCompleteness(config);

      expect(completeness.suggestions).toContain(
        "Add publication date for better search engine understanding"
      );
    });
  });

  describe("sanitizeAndValidateText", () => {
    it("should remove HTML tags", () => {
      const result = SEOValidator.sanitizeAndValidateText(
        "<p>Test <strong>content</strong></p>"
      );

      expect(result.sanitized).toBe("Test content");
      expect(result.warnings).toHaveLength(0);
    });

    it("should normalize whitespace", () => {
      const result = SEOValidator.sanitizeAndValidateText(
        "Test   content\n\nwith   spaces"
      );

      expect(result.sanitized).toBe("Test content with spaces");
    });

    it("should truncate long content", () => {
      const longText = "a".repeat(200);
      const result = SEOValidator.sanitizeAndValidateText(longText, 50);

      expect(result.sanitized.length).toBe(50);
      expect(result.sanitized.endsWith("...")).toBe(true);
      expect(result.warnings).toContain("Text was truncated to 50 characters");
    });

    it("should escape special characters", () => {
      const result = SEOValidator.sanitizeAndValidateText(
        "Test \"quoted\" and 'single' content"
      );

      expect(result.sanitized).toBe(
        "Test &quot;quoted&quot; and &#39;single&#39; content"
      );
      expect(result.warnings).toContain(
        "Special characters were escaped for safety"
      );
    });

    it("should handle empty text", () => {
      const result = SEOValidator.sanitizeAndValidateText("");

      expect(result.sanitized).toBe("");
      expect(result.warnings).toContain("Text content is empty");
    });
  });
});

describe("SEOErrorLogger", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
    vi.clearAllMocks();
  });

  it("should log errors with context", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    SEOErrorLogger.logError("Test error", { test: "context" });

    const logs = SEOErrorLogger.getLogs("error");
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe("Test error");
    expect(logs[0].context).toEqual({ test: "context" });
    expect(logs[0].level).toBe("error");
    expect(consoleSpy).toHaveBeenCalledWith("[SEO Error] Test error", {
      test: "context",
    });
  });

  it("should log warnings", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    SEOErrorLogger.logWarning("Test warning");

    const logs = SEOErrorLogger.getLogs("warning");
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe("Test warning");
    expect(logs[0].level).toBe("warning");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[SEO Warning] Test warning",
      undefined
    );
  });

  it("should log info messages", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    SEOErrorLogger.logInfo("Test info", { data: "test" });

    const logs = SEOErrorLogger.getLogs("info");
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe("Test info");
    expect(logs[0].context).toEqual({ data: "test" });
    expect(logs[0].level).toBe("info");
    expect(consoleSpy).toHaveBeenCalledWith("[SEO Info] Test info", {
      data: "test",
    });
  });

  it("should provide logs summary", () => {
    SEOErrorLogger.logError("Error 1");
    SEOErrorLogger.logError("Error 2");
    SEOErrorLogger.logWarning("Warning 1");
    SEOErrorLogger.logInfo("Info 1");

    const summary = SEOErrorLogger.getLogsSummary();

    expect(summary.errors).toBe(2);
    expect(summary.warnings).toBe(1);
    expect(summary.info).toBe(1);
    expect(summary.total).toBe(4);
  });

  it("should clear logs", () => {
    SEOErrorLogger.logError("Test error");
    SEOErrorLogger.logWarning("Test warning");

    expect(SEOErrorLogger.getLogs()).toHaveLength(2);

    SEOErrorLogger.clearLogs();

    expect(SEOErrorLogger.getLogs()).toHaveLength(0);
  });

  it("should filter logs by level", () => {
    SEOErrorLogger.logError("Error 1");
    SEOErrorLogger.logWarning("Warning 1");
    SEOErrorLogger.logInfo("Info 1");

    expect(SEOErrorLogger.getLogs("error")).toHaveLength(1);
    expect(SEOErrorLogger.getLogs("warning")).toHaveLength(1);
    expect(SEOErrorLogger.getLogs("info")).toHaveLength(1);
    expect(SEOErrorLogger.getLogs()).toHaveLength(3);
  });
});
