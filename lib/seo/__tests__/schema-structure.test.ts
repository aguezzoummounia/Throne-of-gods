import { describe, it, expect, beforeEach } from "vitest";
import { SEOValidator, SEOErrorLogger } from "../validation";
import { SchemaBuilder } from "../schema-builder";
import { JSONLDSchema } from "../types";

describe("JSON-LD Schema Structure Validation", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
  });

  describe("Schema Type Validation", () => {
    it("should validate WebSite schema structure", () => {
      const websiteSchema: JSONLDSchema = {
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
        publisher: {
          "@type": "Organization",
          name: "Test Organization",
          url: "https://example.com",
        },
      };

      const validation = SEOValidator.validateJSONLDSchema(websiteSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(70);
    });

    it("should detect missing required WebSite fields", () => {
      const incompleteWebsiteSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        description: "Missing name and url",
      };

      const validation = SEOValidator.validateJSONLDSchema(
        incompleteWebsiteSchema
      );

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("WebSite schema missing name");
      expect(validation.errors).toContain("WebSite schema missing url");
    });

    it("should validate Person schema structure", () => {
      const personSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: "Test person description",
        image: "/images/person.jpg",
        url: "https://example.com/person",
        affiliation: {
          "@type": "Organization",
          name: "Test Organization",
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Role",
            value: "Test Role",
          },
          {
            "@type": "PropertyValue",
            name: "Power",
            value: "Test Power",
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(personSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should detect missing required Person fields", () => {
      const incompletePersonSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        image: "/images/person.jpg",
      };

      const validation = SEOValidator.validateJSONLDSchema(
        incompletePersonSchema
      );

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Person schema missing name");
      expect(validation.warnings).toContain(
        "Person schema missing description"
      );
    });

    it("should validate Quiz schema structure", () => {
      const quizSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        name: "Test Quiz",
        description: "Test quiz description",
        numberOfQuestions: 5,
        about: "Testing knowledge",
        timeRequired: "PT10M",
        hasPart: [
          {
            "@type": "Question",
            name: "Question 1",
            text: "What is your favorite color?",
            position: 1,
            acceptedAnswer: [
              {
                "@type": "Answer",
                text: "Red",
              },
              {
                "@type": "Answer",
                text: "Blue",
              },
            ],
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(quizSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should detect missing required Quiz fields", () => {
      const incompleteQuizSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        about: "Testing",
      };

      const validation =
        SEOValidator.validateJSONLDSchema(incompleteQuizSchema);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Quiz schema missing name");
      expect(validation.warnings).toContain("Quiz schema missing description");
      expect(validation.warnings).toContain(
        "Quiz schema missing numberOfQuestions"
      );
    });

    it("should validate Article schema structure", () => {
      const articleSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Test Article",
        description: "Test article description",
        image: "/images/article.jpg",
        author: {
          "@type": "Person",
          name: "Test Author",
        },
        publisher: {
          "@type": "Organization",
          name: "Test Publisher",
          url: "https://example.com",
        },
        datePublished: "2024-01-01T00:00:00Z",
        dateModified: "2024-01-02T00:00:00Z",
      };

      const validation = SEOValidator.validateJSONLDSchema(articleSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should detect missing required Article fields", () => {
      const incompleteArticleSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        description: "Missing headline",
      };

      const validation = SEOValidator.validateJSONLDSchema(
        incompleteArticleSchema
      );

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Article schema missing headline");
    });

    it("should validate Organization schema structure", () => {
      const organizationSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Test Organization",
        url: "https://example.com",
        description: "Test organization description",
        logo: {
          "@type": "ImageObject",
          url: "/images/logo.png",
          width: 200,
          height: 200,
        },
        sameAs: ["https://twitter.com/testorg", "https://facebook.com/testorg"],
      };

      const validation = SEOValidator.validateJSONLDSchema(organizationSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(60);
    });

    it("should detect missing required Organization fields", () => {
      const incompleteOrgSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        description: "Missing name and url",
      };

      const validation = SEOValidator.validateJSONLDSchema(incompleteOrgSchema);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Organization schema missing name");
      expect(validation.errors).toContain("Organization schema missing url");
    });
  });

  describe("Schema Context and Type Validation", () => {
    it("should require @context field", () => {
      const schemaWithoutContext: any = {
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
      };

      const validation =
        SEOValidator.validateJSONLDSchema(schemaWithoutContext);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Schema missing @context");
    });

    it("should require @type field", () => {
      const schemaWithoutType: any = {
        "@context": "https://schema.org",
        name: "Test",
        url: "https://example.com",
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithoutType);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Schema missing @type");
    });

    it("should warn about incorrect @context", () => {
      const schemaWithWrongContext: JSONLDSchema = {
        "@context": "https://wrong-context.org",
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
      };

      const validation = SEOValidator.validateJSONLDSchema(
        schemaWithWrongContext
      );

      expect(validation.warnings).toContain(
        "Schema @context should be https://schema.org"
      );
    });

    it("should warn about unknown schema types", () => {
      const unknownTypeSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "UnknownType",
        name: "Test",
      };

      const validation = SEOValidator.validateJSONLDSchema(unknownTypeSchema);

      expect(validation.warnings).toContain("Unknown schema type: UnknownType");
    });
  });

  describe("Complex Schema Structures", () => {
    it("should validate nested schema objects", () => {
      const complexSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Complex Website",
        url: "https://example.com",
        description: "A complex website with nested structures",
        publisher: {
          "@type": "Organization",
          name: "Publisher Organization",
          url: "https://publisher.com",
          logo: {
            "@type": "ImageObject",
            url: "/images/publisher-logo.png",
            width: 300,
            height: 100,
          },
        },
        mainEntity: {
          "@type": "Quiz",
          name: "Main Quiz",
          description: "The main quiz of the website",
          numberOfQuestions: 10,
        },
        hasPart: [
          {
            "@type": "WebPage",
            name: "Characters Page",
            url: "https://example.com/characters",
            description: "Character profiles page",
          },
          {
            "@type": "WebPage",
            name: "Quiz Page",
            url: "https://example.com/quiz",
            description: "Interactive quiz page",
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(complexSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.score).toBeGreaterThan(70);
    });

    it("should handle arrays in schema properties", () => {
      const schemaWithArrays: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: "Person with multiple properties",
        knowsAbout: ["Fantasy", "Gaming", "Testing"],
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Skill 1",
            value: "Magic",
          },
          {
            "@type": "PropertyValue",
            name: "Skill 2",
            value: "Combat",
          },
        ],
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithArrays);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe("Schema Builder Integration", () => {
    it("should create schemas that pass validation", () => {
      const websiteSchema = SchemaBuilder.createWebsiteSchema();
      const validation = SEOValidator.validateJSONLDSchema(websiteSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should create person schemas that pass validation", () => {
      const mockCharacter = {
        name: "Test Character",
        nickname: "Tester",
        slug: "test-character",
        overview: "A test character for validation",
        image: "/images/test.jpg",
        quote: "Testing is everything",
        backstory: "Born to test",
        stats: {
          faction: "Test Faction",
          role: "Tester",
          race: "Human",
          alignment: "Neutral",
          status: "Active",
          age: "25",
          location: "Test Realm",
        },
        relations: {
          allies: "Test Allies",
          enemies: "Test Enemies",
        },
        powers: [
          {
            name: "Test Power",
            overview: "Power to test",
            image: "/images/power.jpg",
          },
        ],
        trivia: ["Loves testing"],
      };

      const personSchema = SchemaBuilder.createPersonSchema(mockCharacter);
      const validation = SEOValidator.validateJSONLDSchema(personSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should create quiz schemas that pass validation", () => {
      const quizSchema = SchemaBuilder.createQuizSchema(5);
      const validation = SEOValidator.validateJSONLDSchema(quizSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should create breadcrumb schemas that pass validation", () => {
      const breadcrumbSchema = SchemaBuilder.createBreadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Test" },
      ]);
      const validation = SEOValidator.validateJSONLDSchema(breadcrumbSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe("JSON Serialization Edge Cases", () => {
    it("should handle undefined values in schema", () => {
      const schemaWithUndefined: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
        description: undefined,
        image: undefined,
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithUndefined);

      // Should still be valid as undefined values are handled by JSON.stringify
      expect(validation.isValid).toBe(true);
    });

    it("should handle null values in schema", () => {
      const schemaWithNull: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
        description: null as any,
        image: null as any,
      };

      const validation = SEOValidator.validateJSONLDSchema(schemaWithNull);

      expect(validation.isValid).toBe(true);
    });

    it("should detect circular references", () => {
      const circularSchema: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
      };
      circularSchema.self = circularSchema;

      const validation = SEOValidator.validateJSONLDSchema(circularSchema);

      expect(validation.isValid).toBe(false);
      expect(
        validation.errors.some((error) =>
          error.includes("JSON serialization failed")
        )
      ).toBe(true);
    });

    it("should handle very large schema objects", () => {
      const largeSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Test Person",
        description: "A".repeat(1000), // Very long description
        additionalProperty: Array.from({ length: 100 }, (_, i) => ({
          "@type": "PropertyValue",
          name: `Property ${i}`,
          value: `Value ${i}`,
        })),
      };

      const validation = SEOValidator.validateJSONLDSchema(largeSchema);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe("Schema Scoring System", () => {
    it("should provide higher scores for complete schemas", () => {
      const completeSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Complete Website",
        url: "https://example.com",
        description: "A complete website schema",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://example.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };

      const incompleteSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Incomplete Website",
        url: "https://example.com",
      };

      const completeValidation =
        SEOValidator.validateJSONLDSchema(completeSchema);
      const incompleteValidation =
        SEOValidator.validateJSONLDSchema(incompleteSchema);

      expect(completeValidation.score).toBeGreaterThan(
        incompleteValidation.score
      );
    });

    it("should penalize schemas with warnings", () => {
      const schemaWithWarnings: JSONLDSchema = {
        "@context": "https://wrong-context.org",
        "@type": "UnknownType",
        name: "Test",
      };

      const cleanSchema: JSONLDSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
        description: "Clean schema",
      };

      const warningValidation =
        SEOValidator.validateJSONLDSchema(schemaWithWarnings);
      const cleanValidation = SEOValidator.validateJSONLDSchema(cleanSchema);

      expect(cleanValidation.score).toBeGreaterThan(warningValidation.score);
    });
  });
});
