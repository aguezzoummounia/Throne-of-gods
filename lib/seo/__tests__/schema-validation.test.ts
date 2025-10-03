import { describe, it, expect, beforeEach, vi } from "vitest";
import { SchemaBuilder } from "../schema-builder";
import { SEOErrorLogger } from "../validation";

describe("SchemaBuilder with Validation", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
    vi.clearAllMocks();
  });

  describe("createPersonSchema with validation", () => {
    it("should create valid person schema with good character data", () => {
      const character = {
        name: "Test Character",
        slug: "test-character",
        nickname: "The Tester",
        quote: "Testing is power",
        image: "/images/test-character.jpg",
        overview: "A powerful character for testing purposes",
        stats: {
          race: "Human",
          age: "25",
          faction: "Test Guild",
          alignment: "Neutral",
          status: "Active",
          role: "Tester",
          location: "Test Realm",
        },
        relations: {
          allies: "Debug Squad",
          enemies: "Bug Legion",
        },
        powers: [
          {
            name: "Code Review",
            image: "/images/powers/review.jpg",
            overview: "Ability to spot errors instantly",
          },
        ],
        trivia: ["First to achieve 100% test coverage"],
        backstory: "Born in the realm of quality assurance",
      };

      const schema = SchemaBuilder.createPersonSchema(character);

      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Test Character");
      expect(schema.alternateName).toBe("The Tester");
      expect((schema.image as any).url).toBe("/images/test-character.jpg");

      // Should not log any warnings for valid image
      const warningLogs = SEOErrorLogger.getLogs("warning");
      const imageWarnings = warningLogs.filter((log) =>
        log.message.includes("Character image validation failed")
      );
      expect(imageWarnings).toHaveLength(0);
    });

    it("should handle invalid character image and use fallback", () => {
      const characterWithBadImage = {
        name: "Test Character",
        slug: "test-character",
        nickname: "The Tester",
        quote: "Testing is power",
        image: "invalid-image.txt", // Invalid extension
        overview: "A powerful character for testing purposes",
        stats: {
          race: "Human",
          age: "25",
          faction: "Test Guild",
          alignment: "Neutral",
          status: "Active",
          role: "Tester",
          location: "Test Realm",
        },
        relations: {
          allies: "Debug Squad",
          enemies: "Bug Legion",
        },
        powers: [],
        trivia: [],
        backstory: "Born in the realm of quality assurance",
      };

      const schema = SchemaBuilder.createPersonSchema(characterWithBadImage);

      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Test Character");

      // Should use fallback image
      expect((schema.image as any).url).not.toBe("invalid-image.txt");
      expect((schema.image as any).url).toContain("default-character.jpg");

      // Should log image validation warning
      const warningLogs = SEOErrorLogger.getLogs("warning");
      const imageWarnings = warningLogs.filter((log) =>
        log.message.includes("Character image validation failed")
      );
      expect(imageWarnings.length).toBeGreaterThan(0);
      expect(imageWarnings[0].context.characterName).toBe("Test Character");
      expect(imageWarnings[0].context.originalImage).toBe("invalid-image.txt");
    });

    it("should handle missing character image", () => {
      const characterWithoutImage = {
        name: "Test Character",
        slug: "test-character",
        nickname: "The Tester",
        quote: "Testing is power",
        image: "", // Empty image
        overview: "A powerful character for testing purposes",
        stats: {
          race: "Human",
          age: "25",
          faction: "Test Guild",
          alignment: "Neutral",
          status: "Active",
          role: "Tester",
          location: "Test Realm",
        },
        relations: {
          allies: "Debug Squad",
          enemies: "Bug Legion",
        },
        powers: [],
        trivia: [],
        backstory: "Born in the realm of quality assurance",
      };

      const schema = SchemaBuilder.createPersonSchema(characterWithoutImage);

      expect(schema["@type"]).toBe("Person");
      expect((schema.image as any).url).toContain("default-character.jpg");

      // Should log warning about missing image
      const warningLogs = SEOErrorLogger.getLogs("warning");
      const imageWarnings = warningLogs.filter((log) =>
        log.message.includes("Character image validation failed")
      );
      expect(imageWarnings.length).toBeGreaterThan(0);
      expect(imageWarnings[0].context.error).toBe("Empty image URL");
    });
  });

  describe("validateSchema method", () => {
    it("should validate correct schema without errors", () => {
      const validSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        description: "Test description",
      };

      const isValid = SchemaBuilder.validateSchema(validSchema);

      expect(isValid).toBe(true);

      // Should not log errors for valid schema
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs).toHaveLength(0);
    });

    it("should detect invalid schema and log errors", () => {
      const invalidSchema = {
        "@context": "", // Invalid context
        "@type": "WebSite",
        // Missing required fields
      };

      const isValid = SchemaBuilder.validateSchema(invalidSchema);

      expect(isValid).toBe(false);

      // Should log validation errors
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
      expect(errorLogs[0].message).toBe("Schema validation failed");
      expect(errorLogs[0].context.schemaType).toBe("WebSite");
    });

    it("should log warnings for schema with missing optional fields", () => {
      const schemaWithWarnings = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        // Missing description - should generate warning
      };

      const isValid = SchemaBuilder.validateSchema(schemaWithWarnings);

      expect(isValid).toBe(true);

      // Should log warnings
      const warningLogs = SEOErrorLogger.getLogs("warning");
      expect(warningLogs.length).toBeGreaterThan(0);
      expect(warningLogs[0].message).toBe("Schema has validation warnings");
      expect(warningLogs[0].context.schemaType).toBe("WebSite");
    });
  });

  describe("combineSchemas with validation", () => {
    it("should combine valid schemas", () => {
      const validSchema1 = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        description: "Test description",
      };

      const validSchema2 = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Test Organization",
        url: "https://example.com",
      };

      const combined = SchemaBuilder.combineSchemas(validSchema1, validSchema2);

      expect(combined).toHaveLength(2);
      expect(combined[0]["@type"]).toBe("WebSite");
      expect(combined[1]["@type"]).toBe("Organization");

      // Should log info about successful combination
      const infoLogs = SEOErrorLogger.getLogs("info");
      expect(infoLogs.length).toBeGreaterThan(0);
      expect(infoLogs[0].message).toContain("Combined 2 of 2 schemas");
    });

    it("should exclude invalid schemas from combination", () => {
      const validSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test Website",
        url: "https://example.com",
        description: "Test description",
      };

      const invalidSchema = {
        "@context": "", // Invalid
        "@type": "",
      };

      const combined = SchemaBuilder.combineSchemas(validSchema, invalidSchema);

      expect(combined).toHaveLength(1);
      expect(combined[0]["@type"]).toBe("WebSite");

      // Should log error about excluded schema
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);
      // The first error will be from schema validation, then exclusion
      const exclusionError = errorLogs.find(
        (log) =>
          log.message ===
          "Schema excluded from combination due to validation failure"
      );
      expect(exclusionError).toBeDefined();

      // Should log info about partial combination
      const infoLogs = SEOErrorLogger.getLogs("info");
      expect(infoLogs.length).toBeGreaterThan(0);
      expect(infoLogs[0].message).toContain("Combined 1 of 2 schemas");
      expect(infoLogs[0].context.excludedCount).toBe(1);
    });

    it("should handle all invalid schemas", () => {
      const invalidSchema1 = {
        "@context": "",
        "@type": "",
      };

      const invalidSchema2 = {
        "@context": "",
        "@type": "",
      };

      const combined = SchemaBuilder.combineSchemas(
        invalidSchema1,
        invalidSchema2
      );

      expect(combined).toHaveLength(0);

      // Should log errors for both schemas
      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(1);

      // Should log info about no valid schemas
      const infoLogs = SEOErrorLogger.getLogs("info");
      expect(infoLogs.length).toBeGreaterThan(0);
      expect(infoLogs[0].message).toContain("Combined 0 of 2 schemas");
    });
  });

  describe("createWebsiteSchema validation", () => {
    it("should create valid website schema", () => {
      const schema = SchemaBuilder.createWebsiteSchema();

      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBeDefined();
      expect(schema.url).toBeDefined();
      expect(schema.description).toBeDefined();

      // Validate the schema
      const isValid = SchemaBuilder.validateSchema(schema);
      expect(isValid).toBe(true);
    });
  });

  describe("createQuizSchema validation", () => {
    it("should create valid quiz schema", () => {
      const questions = [
        {
          text: "What is your favorite color?",
          answers: [{ text: "Red" }, { text: "Blue" }],
        },
      ];

      const schema = SchemaBuilder.createQuizSchema(10, questions);

      expect(schema["@type"]).toBe("Quiz");
      expect(schema.numberOfQuestions).toBe(10);
      expect(schema.hasPart).toHaveLength(1);

      // Validate the schema
      const isValid = SchemaBuilder.validateSchema(schema);
      expect(isValid).toBe(true);
    });
  });

  describe("createArticleSchema validation", () => {
    it("should create valid article schema", () => {
      const character = {
        name: "Test Character",
        slug: "test-character",
        nickname: "The Tester",
        overview: "A test character",
        image: "/images/test.jpg",
      };

      const schema = SchemaBuilder.createArticleSchema(character as any, true);

      expect(schema["@type"]).toBe("Article");
      expect(schema.headline).toContain("Test Character");
      expect(schema.mainEntity).toBeDefined();
      expect(schema.isPartOf).toBeDefined();

      // Validate the schema
      const isValid = SchemaBuilder.validateSchema(schema);
      expect(isValid).toBe(true);
    });
  });

  describe("error context and logging", () => {
    it("should provide detailed error context for schema validation", () => {
      const invalidSchema = {
        "@context": "wrong-context",
        "@type": "WebSite",
      };

      SchemaBuilder.validateSchema(invalidSchema);

      const errorLogs = SEOErrorLogger.getLogs("error");
      expect(errorLogs.length).toBeGreaterThan(0);

      const errorLog = errorLogs[0];
      expect(errorLog.context).toBeDefined();
      expect(errorLog.context.errors).toBeDefined();
      expect(errorLog.context.schemaType).toBe("WebSite");
    });

    it("should provide detailed warning context", () => {
      const schemaWithWarnings = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        // Missing description and other optional fields
      };

      SchemaBuilder.validateSchema(schemaWithWarnings);

      const warningLogs = SEOErrorLogger.getLogs("warning");
      expect(warningLogs.length).toBeGreaterThan(0);

      const warningLog = warningLogs[0];
      expect(warningLog.context).toBeDefined();
      expect(warningLog.context.warnings).toBeDefined();
      expect(warningLog.context.score).toBeDefined();
      expect(warningLog.context.schemaType).toBe("Person");
    });
  });
});
