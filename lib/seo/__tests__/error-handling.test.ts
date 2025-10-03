import { describe, it, expect, beforeEach, vi } from "vitest";
import { SEOValidator, SEOErrorLogger } from "../validation";
import { SEOGenerator } from "../generator";
import { SchemaBuilder } from "../schema-builder";
import { SEOConfig, JSONLDSchema } from "../types";

describe("SEO Error Handling and Fallback Scenarios", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
    vi.clearAllMocks();
  });

  describe("SEOErrorLogger Functionality", () => {
    it("should log errors with context and timestamp", () => {
      const errorMessage = "Test error message";
      const errorContext = { field: "title", value: "" };

      SEOErrorLogger.logError(errorMessage, errorContext);

      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].message).toBe(errorMessage);
      expect(errorLogs[0].context).toEqual(errorContext);
      expect(errorLogs[0].timestamp).toBeInstanceOf(Date);
      expect(errorLogs[0].level).toBe("error");
    });

    it("should log warnings with context", () => {
      const warningMessage = "Test warning message";
      const warningContext = { field: "description", length: 50 };

      SEOErrorLogger.logWarning(warningMessage, warningContext);

      const warningLogs = SEOErrorLogger.getLogs("warning");
      expect(warningLogs).toHaveLength(1);
      expect(warningLogs[0].message).toBe(warningMessage);
      expect(warningLogs[0].context).toEqual(warningContext);
      expect(warningLogs[0].level).toBe("warning");
    });

    it("should log info messages", () => {
      const infoMessage = "Test info message";
      const infoContext = { operation: "schema_validation" };

      SEOErrorLogger.logInfo(infoMessage, infoContext);

      const infoLogs = SEOErrorLogger.getLogs("info");
      expect(infoLogs).toHaveLength(1);
      expect(infoLogs[0].message).toBe(infoMessage);
      expect(infoLogs[0].context).toEqual(infoContext);
      expect(infoLogs[0].level).toBe("info");
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
      SEOErrorLogger.logWarning("Warning 2");
      SEOErrorLogger.logInfo("Info 1");

      expect(SEOErrorLogger.getLogs("error")).toHaveLength(1);
      expect(SEOErrorLogger.getLogs("warning")).toHaveLength(2);
      expect(SEOErrorLogger.getLogs("info")).toHaveLength(1);
      expect(SEOErrorLogger.getLogs()).toHaveLength(4);
    });
  });

  describe("SEO Configuration Fallback Handling", () => {
    it("should generate fallback configuration for empty config", () => {
      const emptyConfig: Partial<SEOConfig> = {};

      const fallbackConfig = SEOValidator.generateFallbackSEOConfig(
        emptyConfig,
        "homepage"
      );

      expect(fallbackConfig.title).toBeDefined();
      expect(fallbackConfig.title).not.toBe("");
      expect(fallbackConfig.description).toBeDefined();
      expect(fallbackConfig.description).not.toBe("");
      expect(fallbackConfig.keywords).toBeDefined();
      expect(fallbackConfig.keywords?.length).toBeGreaterThan(0);
      expect(fallbackConfig.image).toBeDefined();
      expect(fallbackConfig.author).toBeDefined();
      expect(fallbackConfig.siteName).toBeDefined();
    });

    it("should generate content-type specific fallbacks", () => {
      const emptyConfig: Partial<SEOConfig> = {};

      const characterFallback = SEOValidator.generateFallbackSEOConfig(
        emptyConfig,
        "character"
      );
      const quizFallback = SEOValidator.generateFallbackSEOConfig(
        emptyConfig,
        "quiz"
      );
      const resultFallback = SEOValidator.generateFallbackSEOConfig(
        emptyConfig,
        "result"
      );

      expect(characterFallback.title).toContain("Character Profile");
      expect(characterFallback.type).toBe("profile");

      expect(quizFallback.title).toContain("Quiz");
      expect(quizFallback.type).toBe("website");

      expect(resultFallback.title).toContain("Results");
      expect(resultFallback.type).toBe("article");
    });

    it("should preserve valid fields while providing fallbacks for invalid ones", () => {
      const partialConfig: Partial<SEOConfig> = {
        title: "Valid Title",
        description: "", // Invalid - empty
        keywords: ["valid", "keywords"],
        image: {
          url: "invalid-image.txt", // Invalid extension
          alt: "Valid alt text",
        },
      };

      const fallbackConfig = SEOValidator.generateFallbackSEOConfig(
        partialConfig,
        "character"
      );

      expect(fallbackConfig.title).toBe("Valid Title"); // Preserved
      expect(fallbackConfig.description).not.toBe(""); // Fallback provided
      expect(fallbackConfig.keywords).toEqual(["valid", "keywords"]); // Preserved
      expect(fallbackConfig.image?.url).not.toBe("invalid-image.txt"); // Fallback provided
      expect(fallbackConfig.image?.alt).toBe("Valid alt text"); // Preserved from original
    });
  });

  describe("Image URL Validation and Fallbacks", () => {
    it("should validate correct image URLs", () => {
      const validUrls = [
        "/images/character.jpg",
        "https://example.com/image.png",
        "/assets/hero.webp",
        "https://cdn.example.com/photo.jpeg",
      ];

      validUrls.forEach((url) => {
        const validation = SEOValidator.validateImageURL(url);
        expect(validation.isValid).toBe(true);
        expect(validation.url).toBe(url);
        expect(validation.fallbackUsed).toBe(false);
      });
    });

    it("should reject invalid image URLs and provide fallbacks", () => {
      const invalidUrls = [
        "",
        "not-a-url",
        "invalid-image.txt",
        "https://example.com/document.pdf",
        "javascript:alert('xss')",
      ];

      invalidUrls.forEach((url) => {
        const validation = SEOValidator.validateImageURL(url);
        expect(validation.isValid).toBe(false);
        expect(validation.fallbackUsed).toBe(true);
        expect(validation.url).toBeDefined();
        expect(validation.url).not.toBe(url);
        expect(validation.error).toBeDefined();
      });
    });

    it("should handle null and undefined image URLs", () => {
      const nullValidation = SEOValidator.validateImageURL(null as any);
      const undefinedValidation = SEOValidator.validateImageURL(
        undefined as any
      );

      expect(nullValidation.isValid).toBe(false);
      expect(nullValidation.fallbackUsed).toBe(true);
      expect(undefinedValidation.isValid).toBe(false);
      expect(undefinedValidation.fallbackUsed).toBe(true);
    });
  });

  describe("JSON-LD Schema Error Handling", () => {
    it("should handle circular references in schemas", () => {
      const circularSchema: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Site",
        url: "https://example.com",
      };
      circularSchema.self = circularSchema; // Create circular reference

      const validation = SEOValidator.validateJSONLDSchema(circularSchema);

      expect(validation.isValid).toBe(false);
      expect(
        validation.errors.some((error) =>
          error.includes("JSON serialization failed")
        )
      ).toBe(true);
    });

    it("should handle schemas with undefined values", () => {
      const schemaWithUndefined: any = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: undefined,
        image: undefined,
        additionalProperty: undefined,
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithUndefined);

      // Should still be valid as JSON.stringify handles undefined
      expect(validation.isValid).toBe(true);
    });

    it("should handle schemas with null values", () => {
      const schemaWithNull: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: null as any,
        image: null as any,
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithNull);

      expect(validation.isValid).toBe(true);
    });

    it("should handle malformed schema objects", () => {
      const malformedSchemas = [
        {}, // Empty object
        { "@context": "" }, // Missing @type
        { "@type": "WebSite" }, // Missing @context
        { "@context": "invalid", "@type": "InvalidType" }, // Invalid values
      ];

      malformedSchemas.forEach((schema) => {
        const validation = SEOValidator.validateJSONLDSchema(schema as any);
        expect(validation.isValid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Text Sanitization and Validation", () => {
    it("should sanitize HTML content", () => {
      const htmlContent =
        "<script>alert('xss')</script><p>Valid content</p><strong>Bold text</strong>";

      const result = SEOValidator.sanitizeAndValidateText(htmlContent);

      expect(result.sanitized).not.toContain("<script>");
      expect(result.sanitized).not.toContain("<p>");
      expect(result.sanitized).not.toContain("<strong>");
      expect(result.sanitized).toContain("Valid content");
      expect(result.sanitized).toContain("Bold text");
    });

    it("should normalize whitespace", () => {
      const messyText = "  Multiple   spaces\n\nand\t\ttabs  ";

      const result = SEOValidator.sanitizeAndValidateText(messyText);

      expect(result.sanitized).toBe("Multiple spaces and tabs");
      expect(result.warnings).toHaveLength(0);
    });

    it("should truncate long text", () => {
      const longText = "a".repeat(200);

      const result = SEOValidator.sanitizeAndValidateText(longText, 100);

      expect(result.sanitized.length).toBeLessThanOrEqual(100);
      expect(result.sanitized).toContain("...");
      expect(result.warnings).toContain("Text was truncated to 100 characters");
    });

    it("should escape special characters", () => {
      const textWithQuotes = "Text with \"double\" and 'single' quotes";

      const result = SEOValidator.sanitizeAndValidateText(textWithQuotes);

      expect(result.sanitized).toContain("&quot;");
      expect(result.sanitized).toContain("&#39;");
      expect(result.warnings).toContain(
        "Special characters were escaped for safety"
      );
    });

    it("should handle empty or null text", () => {
      const emptyResult = SEOValidator.sanitizeAndValidateText("");
      const nullResult = SEOValidator.sanitizeAndValidateText(null as any);

      expect(emptyResult.sanitized).toBe("");
      expect(emptyResult.warnings).toContain("Text content is empty");
      expect(nullResult.sanitized).toBe("");
      expect(nullResult.warnings).toContain("Text content is empty");
    });
  });

  describe("SEO Generator Error Handling", () => {
    it("should handle invalid configuration gracefully", () => {
      const invalidConfig: Partial<SEOConfig> = {
        title: "",
        description: "",
        type: "invalid-type" as any,
        url: "not-a-url",
        image: {
          url: "invalid-image.txt",
          alt: "",
        },
      };

      const metadata = SEOGenerator.generateMetadata(
        invalidConfig as SEOConfig
      );

      // Should still generate valid metadata with fallbacks
      expect(metadata.title).toBeDefined();
      expect(metadata.title).not.toBe("");
      expect(metadata.description).toBeDefined();
      expect(metadata.description).not.toBe("");
      expect(metadata.openGraph?.images).toBeDefined();

      // Should log validation errors
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
    });

    it("should handle JSON-LD generation errors", () => {
      const invalidSchema: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
      };
      invalidSchema.circular = invalidSchema; // Create circular reference

      const script = SEOGenerator.generateJSONLDScript(invalidSchema);

      // Should return fallback schema
      expect(script).toBeDefined();
      expect(() => JSON.parse(script)).not.toThrow();

      const parsed = JSON.parse(script);
      expect(parsed.name).toBe("Throne of Gods"); // Fallback name

      // Should log validation errors
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
    });
  });

  describe("Schema Builder Error Handling", () => {
    it("should handle missing character data", () => {
      const incompleteCharacter = {
        name: "Test Character",
        slug: "test",
        // Missing required fields
      };

      const schema = SchemaBuilder.createPersonSchema(incompleteCharacter);

      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Test Character");
      expect(schema.description).toBeDefined(); // Should have fallback
      expect(schema.image).toBeDefined(); // Should have fallback image
    });

    it("should handle invalid character images", () => {
      const characterWithBadImage = {
        name: "Test Character",
        nickname: "Tester",
        slug: "test",
        overview: "Test character",
        image: "invalid-image.txt",
        quote: "Test quote",
        backstory: "Test backstory",
        stats: {
          faction: "Test Faction",
          role: "Test Role",
          race: "Human",
          alignment: "Neutral",
          status: "Active",
          age: "25",
          location: "Test Location",
        },
        relations: {
          allies: "Test Allies",
          enemies: "Test Enemies",
        },
        powers: [],
        trivia: [],
      };

      const schema = SchemaBuilder.createPersonSchema(characterWithBadImage);

      expect(schema.image).toBeDefined();
      expect(typeof schema.image).toBe("object");

      // Should log image validation warning
      const warningLogs = SEOErrorLogger.getLogs("warning");
      const imageWarnings = warningLogs.filter((log) =>
        log.message.includes("Character image validation failed")
      );
      expect(imageWarnings.length).toBeGreaterThan(0);
    });

    it("should exclude invalid schemas from combination", () => {
      const validSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Valid Site",
        url: "https://example.com",
        description: "Valid description",
      };

      const invalidSchema: JSONLDSchema = {
        "@context": "",
        "@type": "",
      };

      const combined = SchemaBuilder.combineSchemas(validSchema, invalidSchema);

      expect(combined).toHaveLength(1);
      expect(combined[0]["@type"]).toBe("WebSite");

      // Should log exclusion error
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
    });
  });

  describe("Comprehensive Error Accumulation", () => {
    it("should accumulate multiple validation errors across operations", () => {
      // Generate multiple validation errors
      const badConfig1: Partial<SEOConfig> = { title: "", description: "" };
      const badConfig2: Partial<SEOConfig> = {
        type: "invalid" as any,
        url: "not-a-url",
      };

      SEOGenerator.generateMetadata(badConfig1 as SEOConfig);
      SEOGenerator.generateMetadata(badConfig2 as SEOConfig);

      const invalidSchema: JSONLDSchema = { "@context": "", "@type": "" };
      SEOValidator.validateJSONLDSchema(invalidSchema);

      const summary = SEOErrorLogger.getLogsSummary();
      expect(summary.errors).toBeGreaterThan(0);
      expect(summary.warnings).toBeGreaterThan(0);
      expect(summary.total).toBeGreaterThan(0);
    });

    it("should provide detailed error context for debugging", () => {
      const problematicConfig: Partial<SEOConfig> = {
        title: "",
        description: "",
        image: { url: "invalid.txt", alt: "" },
      };

      SEOGenerator.generateMetadata(problematicConfig as SEOConfig);

      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);

      const errorLog = errorLogs[0];
      expect(errorLog.context).toBeDefined();
      expect(errorLog.context.errors).toBeDefined();
      expect(errorLog.context.originalConfig).toBeDefined();
      expect(errorLog.timestamp).toBeInstanceOf(Date);
    });
  });

  describe("Recovery and Resilience", () => {
    it("should continue processing after encountering errors", () => {
      const configs = [
        { title: "Valid Config 1", description: "Valid description 1" },
        { title: "", description: "" }, // Invalid
        { title: "Valid Config 2", description: "Valid description 2" },
      ];

      const results = configs.map((config) =>
        SEOGenerator.generateMetadata(config as SEOConfig)
      );

      // All should produce valid metadata objects
      results.forEach((metadata) => {
        expect(metadata.title).toBeDefined();
        expect(metadata.title).not.toBe("");
        expect(metadata.description).toBeDefined();
        expect(metadata.description).not.toBe("");
      });

      // Should have logged errors for the invalid config
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
    });

    it("should maintain system stability with extreme inputs", () => {
      const extremeInputs = [
        { title: "x".repeat(1000), description: "y".repeat(1000) },
        { title: null as any, description: undefined as any },
        { title: {}, description: [] } as any,
        { title: 123, description: true } as any,
      ];

      extremeInputs.forEach((input) => {
        expect(() => {
          const metadata = SEOGenerator.generateMetadata(input as SEOConfig);
          expect(metadata).toBeDefined();
        }).not.toThrow();
      });
    });
  });
});
