import { describe, it, expect } from "vitest";
import {
  generateHomepageMetadata,
  generateHomepageSchemas,
  generateHomepageSocialTags,
  generateCompleteHomepageSEO,
} from "../homepage";

describe("Homepage SEO", () => {
  describe("generateHomepageMetadata", () => {
    it("should generate proper metadata for homepage", () => {
      const metadata = generateHomepageMetadata();

      expect(metadata.title).toBe(
        "Throne of Gods - Discover Your Inner Villain"
      );
      expect(metadata.description).toContain(
        "Embark on an epic fantasy journey"
      );
      expect(metadata.keywords).toContain("fantasy quiz");
      expect(metadata.openGraph?.title).toBe(
        "Throne of Gods - Discover Your Inner Villain"
      );
      expect(metadata.twitter?.card).toBe("summary_large_image");
    });

    it("should include proper image configuration", () => {
      const metadata = generateHomepageMetadata();

      expect(metadata.openGraph?.images).toBeDefined();
      expect(Array.isArray(metadata.openGraph?.images)).toBe(true);

      const image = (metadata.openGraph?.images as any[])?.[0];
      expect(image?.width).toBe(1200);
      expect(image?.height).toBe(630);
      expect(image?.alt).toContain("Throne of Gods");
    });
  });

  describe("generateHomepageSchemas", () => {
    it("should generate multiple JSON-LD schemas", () => {
      const schemas = generateHomepageSchemas();

      expect(Array.isArray(schemas)).toBe(true);
      expect(schemas.length).toBeGreaterThan(0);

      // Check for Website schema
      const websiteSchema = schemas.find(
        (schema) => schema["@type"] === "WebSite"
      );
      expect(websiteSchema).toBeDefined();
      expect(websiteSchema?.name).toBe("Throne of Gods");

      // Check for Organization schema
      const orgSchema = schemas.find(
        (schema) => schema["@type"] === "Organization"
      );
      expect(orgSchema).toBeDefined();
    });

    it("should include search functionality in Website schema", () => {
      const schemas = generateHomepageSchemas();
      const websiteSchemas = schemas.filter(
        (schema) => schema["@type"] === "WebSite"
      );

      expect(websiteSchemas.length).toBeGreaterThan(0);

      // Check if any website schema has search functionality
      const hasSearchAction = websiteSchemas.some((schema) => {
        const actions = Array.isArray(schema.potentialAction)
          ? schema.potentialAction
          : schema.potentialAction
          ? [schema.potentialAction]
          : [];

        return actions.some(
          (action: any) => action["@type"] === "SearchAction"
        );
      });

      expect(hasSearchAction).toBe(true);
    });

    it("should include main quiz entity", () => {
      const schemas = generateHomepageSchemas();
      const websiteSchema = schemas.find(
        (schema) => schema["@type"] === "WebSite"
      );

      expect(websiteSchema?.mainEntity).toBeDefined();
      expect(websiteSchema?.mainEntity?.["@type"]).toBe("Quiz");
      expect(websiteSchema?.mainEntity?.name).toContain(
        "Villain Personality Quiz"
      );
    });
  });

  describe("generateHomepageSocialTags", () => {
    it("should generate social media optimization tags", () => {
      const socialTags = generateHomepageSocialTags();

      expect(socialTags["twitter:card"]).toBe("summary_large_image");
      expect(socialTags["twitter:title"]).toContain(
        "Discover Your Inner Villain"
      );
      expect(socialTags["og:image:width"]).toBe("1200");
      expect(socialTags["og:image:height"]).toBe("630");
    });
  });

  describe("generateCompleteHomepageSEO", () => {
    it("should generate complete SEO configuration", () => {
      const completeSEO = generateCompleteHomepageSEO();

      expect(completeSEO.metadata).toBeDefined();
      expect(completeSEO.schemas).toBeDefined();
      expect(completeSEO.socialTags).toBeDefined();

      expect(Array.isArray(completeSEO.schemas)).toBe(true);
      expect(typeof completeSEO.socialTags).toBe("object");
    });
  });

  describe("Schema validation", () => {
    it("should generate valid JSON-LD schemas", () => {
      const schemas = generateHomepageSchemas();

      schemas.forEach((schema) => {
        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBeDefined();
        expect(typeof schema["@type"]).toBe("string");

        // Should be valid JSON
        expect(() => JSON.stringify(schema)).not.toThrow();
      });
    });

    it("should include required schema properties", () => {
      const schemas = generateHomepageSchemas();

      const websiteSchema = schemas.find(
        (schema) => schema["@type"] === "WebSite"
      );
      expect(websiteSchema?.name).toBeDefined();
      expect(websiteSchema?.url).toBeDefined();
      expect(websiteSchema?.description).toBeDefined();

      const orgSchema = schemas.find(
        (schema) => schema["@type"] === "Organization"
      );
      expect(orgSchema?.name).toBeDefined();
      expect(orgSchema?.url).toBeDefined();
    });
  });
});
