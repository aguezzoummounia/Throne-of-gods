import { describe, it, expect } from "vitest";
import { CharacterSEO } from "../character";
import { VillainProfile } from "@/lib/types";

// Mock character data for testing
const mockCharacter: any = {
  name: "Test Villain",
  slug: "test-villain",
  nickname: "The Test Master",
  quote: "Testing is the path to power",
  image: "/images/test-villain.jpg",
  overview:
    "A powerful villain who controls the realm of testing and validation. Known for their meticulous attention to detail and ruthless pursuit of perfection.",
  stats: {
    race: "Human",
    age: "Ancient",
    faction: "Test Empire",
    alignment: "Lawful Evil",
    status: "Active",
    role: "Emperor",
    location: "Test Realm",
  },
  relations: {
    allies: "Debug Squad, Quality Assurance Guild",
    enemies: "Bug Legion, Chaos Coders",
  },
  powers: [
    {
      name: "Code Validation",
      image: "/images/powers/validation.jpg",
      overview: "Ability to instantly detect flaws and errors in any system",
    },
    {
      name: "Test Automation",
      image: "/images/powers/automation.jpg",
      overview: "Can create automated processes to verify functionality",
    },
  ],
  trivia: [
    "First villain to achieve 100% test coverage",
    "Never releases code without proper testing",
    "Believes bugs are a form of weakness",
  ],
  backstory:
    "<p>Born in the depths of legacy code, Test Villain rose to power through meticulous testing and validation.</p>",
};

describe("CharacterSEO", () => {
  describe("generateCharacterMetadata", () => {
    it("should generate proper metadata for character", () => {
      const metadata = CharacterSEO.generateCharacterMetadata(mockCharacter);

      expect(metadata.title).toContain("Test Villain");
      expect(metadata.title).toContain("The Test Master");
      expect(metadata.description).toContain("Test Villain");
      expect(metadata.description).toContain("Test Master");
      expect(metadata.openGraph?.title).toContain("Test Villain");
      expect((metadata.openGraph?.images as any)?.[0]?.url).toBe(
        "/images/test-villain.jpg"
      );
      expect((metadata.openGraph as any)?.type).toBe("profile");
    });

    it("should include character-specific keywords", () => {
      const metadata = CharacterSEO.generateCharacterMetadata(mockCharacter);

      expect(metadata.keywords).toContain("test villain");
      expect(metadata.keywords).toContain("test empire");
      expect(metadata.keywords).toContain("emperor");
      expect(metadata.keywords).toContain("code validation");
    });

    it("should limit description length for SEO", () => {
      const metadata = CharacterSEO.generateCharacterMetadata(mockCharacter);

      expect(metadata.description?.length).toBeLessThanOrEqual(160);
    });
  });

  describe("generateCharacterSchema", () => {
    it("should generate valid Person schema", () => {
      const schema = CharacterSEO.generateCharacterSchema(mockCharacter);

      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Test Villain");
      expect(schema.alternateName).toBe("The Test Master");
      expect(schema.description).toBe(mockCharacter.overview);
      expect((schema.affiliation as any)?.name).toBe("Test Empire");
      expect(schema.hasOccupation?.roleName).toBe("Emperor");
      expect(schema.homeLocation?.name).toBe("Test Realm");
    });

    it("should include power information in knowsAbout", () => {
      const schema = CharacterSEO.generateCharacterSchema(mockCharacter);

      expect(schema.knowsAbout).toContain("Code Validation");
      expect(schema.knowsAbout).toContain("Test Automation");
      expect(schema.knowsAbout).toContain("Test Empire");
      expect(schema.knowsAbout).toContain("Emperor");
    });

    it("should include character properties", () => {
      const schema = CharacterSEO.generateCharacterSchema(mockCharacter);

      const properties = schema.additionalProperty || [];
      const nicknameProperty = properties.find((p) => p.name === "Nickname");
      const alliesProperty = properties.find((p) => p.name === "Allies");
      const enemiesProperty = properties.find((p) => p.name === "Enemies");

      expect(nicknameProperty?.value).toBe("The Test Master");
      expect(alliesProperty?.value).toBe(
        "Debug Squad, Quality Assurance Guild"
      );
      expect(enemiesProperty?.value).toBe("Bug Legion, Chaos Coders");
    });
  });

  describe("generateEnhancedCharacterSchemas", () => {
    it("should generate multiple schemas including powers and faction", () => {
      const schemas =
        CharacterSEO.generateEnhancedCharacterSchemas(mockCharacter);

      expect(schemas.length).toBeGreaterThan(1);

      // Should include Person schema
      const personSchema = schemas.find((s) => s["@type"] === "Person");
      expect(personSchema).toBeDefined();
      expect(personSchema?.name).toBe("Test Villain");

      // Should include Organization schema for faction
      const orgSchema = schemas.find((s) => s["@type"] === "Organization");
      expect(orgSchema).toBeDefined();
      expect(orgSchema?.name).toBe("Test Empire");

      // Should include CreativeWork schemas for powers
      const powerSchemas = schemas.filter((s) => s["@type"] === "CreativeWork");
      expect(powerSchemas.length).toBe(2);
      expect(powerSchemas[0].name).toBe("Code Validation");
      expect(powerSchemas[1].name).toBe("Test Automation");
    });
  });

  describe("generateCharacterBreadcrumbs", () => {
    it("should generate proper breadcrumb schema", () => {
      const breadcrumbs =
        CharacterSEO.generateCharacterBreadcrumbs(mockCharacter);

      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(3);
      expect(breadcrumbs.itemListElement[0].name).toBe("Home");
      expect(breadcrumbs.itemListElement[1].name).toBe("Characters");
      expect(breadcrumbs.itemListElement[2].name).toBe("Test Villain");
    });
  });

  describe("validateCharacterSEO", () => {
    it("should validate complete character data", () => {
      const validation = CharacterSEO.validateCharacterSEO(mockCharacter);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should detect missing required fields", () => {
      const incompleteCharacter = { ...mockCharacter, name: "", slug: "" };
      const validation = CharacterSEO.validateCharacterSEO(
        incompleteCharacter as any
      );

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Character name is required");
      expect(validation.errors).toContain("Character slug is required");
    });

    it("should warn about missing optional fields", () => {
      const characterWithoutImage = { ...mockCharacter, image: "" };
      const validation = CharacterSEO.validateCharacterSEO(
        characterWithoutImage
      );

      expect(validation.warnings).toContain("Character image is missing");
    });

    it("should warn about overview length", () => {
      const shortOverview = { ...mockCharacter, overview: "Short" };
      const validation = CharacterSEO.validateCharacterSEO(shortOverview);

      expect(validation.warnings).toContain(
        "Character overview is too short for optimal SEO"
      );
    });
  });

  describe("generateFallbackMetadata", () => {
    it("should generate fallback metadata for missing character", () => {
      const metadata =
        CharacterSEO.generateFallbackMetadata("missing-character");

      expect(metadata.title).toContain("Character Profile");
      expect(metadata.description).toContain("mysterious figure");
      expect((metadata.openGraph as any)?.type).toBe("profile");
    });
  });
});
