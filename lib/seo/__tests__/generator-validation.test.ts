import { describe, it, expect, beforeEach, vi } from "vitest";
import { SEOGenerator } from "../generator";
import { SEOErrorLogger } from "../validation";
import { SEOConfig } from "../types";

describe("SEOGenerator with Validation", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
    vi.clearAllMocks();
  });

  describe("generateMetadata with validation", () => {
    it("should generate metadata with valid configuration", () => {
      const config: SEOConfig = {
        title: "Valid Title for SEO Optimization",
        description:
          "This is a valid description that meets all the requirements for optimal search engine optimization and user engagement.",
        keywords: ["test", "seo", "validation"],
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

      const metadata = SEOGenerator.generateMetadata(config);

      expect(metadata.title).toBe(config.title);
      expect(metadata.description).toBe(config.description);
      expect(metadata.keywords).toEqual(config.keywords);

      // Should not log any errors for valid config
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs).toHaveLength(0);
    });

    it("should use fallbacks for invalid configuration", () => {
      const invalidConfig: Partial<SEOConfig> = {
        title: "", // Invalid empty title
        description: "", // Invalid empty description
        image: {
          url: "invalid-image-url", // Invalid image URL
          width: 1200,
          height: 630,
          alt: "Test image",
        },
      };

      const metadata = SEOGenerator.generateMetadata(
        invalidConfig as SEOConfig
      );

      // Should use fallback values
      expect(metadata.title).not.toBe("");
      expect(metadata.description).not.toBe("");
      expect(metadata.title).toContain("Throne of Gods");

      // Should log validation errors (from original config validation)
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
      expect(errorLogs[0].message).toBe("SEO metadata validation failed");
    });

    it("should log warnings for suboptimal configuration", () => {
      const suboptimalConfig: SEOConfig = {
        title: "Short", // Too short
        description: "Also short", // Too short
        keywords: ["one"], // Too few keywords
        image: {
          url: "/images/test.jpg",
          width: 1200,
          height: 630,
          alt: "", // Missing alt text
        },
        author: "Test Author",
        siteName: "Test Site",
      };

      const metadata = SEOGenerator.generateMetadata(suboptimalConfig);

      expect(metadata).toBeDefined();

      // Should log warnings
      const warningLogs = SEOErrorLogger.getLogs("warning");
      expect(warningLogs.length).toBeGreaterThan(0);
      expect(warningLogs[0].message).toBe("SEO metadata has warnings");
    });

    it("should handle image validation failures", () => {
      const configWithBadImage: SEOConfig = {
        title: "Valid Title for SEO Optimization",
        description:
          "This is a valid description that meets all the requirements for optimal search engine optimization and user engagement.",
        keywords: ["test", "seo"],
        image: {
          url: "/images/nonexistent.txt", // Invalid extension
          width: 1200,
          height: 630,
          alt: "Test image",
        },
        author: "Test Author",
        siteName: "Test Site",
      };

      const metadata = SEOGenerator.generateMetadata(configWithBadImage);

      expect(metadata).toBeDefined();
      expect(metadata.openGraph?.images).toBeDefined();

      // Should log image validation warnings
      const warningLogs = SEOErrorLogger.getLogs("warning");
      const imageWarnings = warningLogs.filter((log) =>
        log.message.includes("image validation failed")
      );
      expect(imageWarnings.length).toBeGreaterThan(0);
    });
  });

  describe("generateJSONLDScript with validation", () => {
    it("should generate valid JSON-LD script", () => {
      const validSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        description: "Test description",
      };

      const script = SEOGenerator.generateJSONLDScript(validSchema);

      expect(script).toBeDefined();
      expect(() => JSON.parse(script)).not.toThrow();

      const parsed = JSON.parse(script);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("WebSite");

      // Should not log errors for valid schema
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs).toHaveLength(0);
    });

    it("should handle invalid schema and return fallback", () => {
      const invalidSchema = {
        "@context": "", // Invalid context
        "@type": "", // Invalid type
      };

      const script = SEOGenerator.generateJSONLDScript(invalidSchema);

      expect(script).toBeDefined();
      expect(() => JSON.parse(script)).not.toThrow();

      const parsed = JSON.parse(script);
      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed.name).toBe("Throne of Gods");

      // Should log validation errors
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
      expect(errorLogs[0].message).toBe("JSON-LD schema validation failed");
    });

    it("should log warnings for schema with issues", () => {
      const schemaWithWarnings = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        // Missing description - should generate warnings
      };

      const script = SEOGenerator.generateJSONLDScript(schemaWithWarnings);

      expect(script).toBeDefined();

      // Should log warnings
      const warningLogs = SEOErrorLogger.getLogs("warning");
      expect(warningLogs.length).toBeGreaterThan(0);
      expect(warningLogs[0].message).toBe("JSON-LD schema has warnings");
    });
  });

  describe("validateConfig method", () => {
    it("should sanitize and validate configuration", () => {
      const configWithHtml: Partial<SEOConfig> = {
        title: "<script>alert('xss')</script>Valid Title",
        description: "<p>Description with <strong>HTML</strong> tags</p>",
        keywords: ["test", "validation"],
      };

      const validated = SEOGenerator.validateConfig(configWithHtml);

      expect(validated.title).not.toContain("<script>");
      expect(validated.title).not.toContain("<strong>");
      expect(validated.description).not.toContain("<p>");
      expect(validated.description).not.toContain("<strong>");
      expect(validated.title).toContain("Valid Title");
      expect(validated.description).toContain("Description with HTML tags");
    });

    it("should limit description length", () => {
      const longDescription = "a".repeat(200);
      const configWithLongDesc: Partial<SEOConfig> = {
        title: "Test Title",
        description: longDescription,
      };

      const validated = SEOGenerator.validateConfig(configWithLongDesc);

      expect(validated.description.length).toBeLessThanOrEqual(160);
    });

    it("should provide fallback values", () => {
      const emptyConfig: Partial<SEOConfig> = {};

      const validated = SEOGenerator.validateConfig(emptyConfig);

      expect(validated.title).toBeDefined();
      expect(validated.description).toBeDefined();
      expect(validated.keywords).toBeDefined();
      expect(validated.author).toBeDefined();
      expect(validated.siteName).toBeDefined();
    });
  });

  describe("createBreadcrumbs with validation", () => {
    it("should create valid breadcrumb schema", () => {
      const items = [
        { name: "Home", url: "/" },
        { name: "Characters", url: "/characters" },
        { name: "Test Character" },
      ];

      const breadcrumbs = SEOGenerator.createBreadcrumbs(items);

      expect(breadcrumbs["@context"]).toBe("https://schema.org");
      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(3);

      // Validate structure
      breadcrumbs.itemListElement.forEach((item: any, index: number) => {
        expect(item["@type"]).toBe("ListItem");
        expect(item.position).toBe(index + 1);
        expect(item.name).toBe(items[index].name);
      });
    });

    it("should handle empty breadcrumb items", () => {
      const breadcrumbs = SEOGenerator.createBreadcrumbs([]);

      expect(breadcrumbs["@context"]).toBe("https://schema.org");
      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(0);
    });
  });

  describe("error logging integration", () => {
    it("should accumulate multiple validation issues", () => {
      const problematicConfig: Partial<SEOConfig> = {
        title: "", // Error: missing title
        description: "Short", // Warning: too short
        image: {
          url: "invalid.txt", // Warning: invalid image
          width: 1200,
          height: 630,
          alt: "",
        },
        type: "invalid" as any, // Error: invalid type
      };

      SEOGenerator.generateMetadata(problematicConfig as SEOConfig);

      const summary = SEOErrorLogger.getLogsSummary();
      expect(summary.errors).toBeGreaterThan(0);
      expect(summary.warnings).toBeGreaterThan(0);
      expect(summary.total).toBeGreaterThan(0);
    });

    it("should provide detailed error context", () => {
      const invalidConfig: Partial<SEOConfig> = {
        title: "",
        description: "",
      };

      SEOGenerator.generateMetadata(invalidConfig as SEOConfig);

      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);

      const errorLog = errorLogs[0];
      expect(errorLog.context).toBeDefined();
      expect(errorLog.context.errors).toBeDefined();
      expect(errorLog.context.originalConfig).toBeDefined();
    });
  });
});
