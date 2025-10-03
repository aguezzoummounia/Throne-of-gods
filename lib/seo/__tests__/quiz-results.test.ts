import { describe, it, expect, beforeEach } from "vitest";
import {
  generateQuizResultsMetadata,
  generateQuizResultsSchema,
  generateQuizResultsBreadcrumbs,
  generateQuizResultsSocialMetadata,
  extractQuizResultsSEOData,
  QuizResultsSEOData,
} from "../quiz-results";
import { SEO_CONFIG } from "../config";

describe("Quiz Results SEO", () => {
  let mockData: QuizResultsSEOData;

  beforeEach(() => {
    mockData = {
      characterSlug: "jarvan",
      characterName: "Jarvan the First",
      characterNickname: "The Godless Emperor",
      characterImage: "/images/villains/villain-1.jpeg",
      characterQuote: "The strong rule, The weak pray.",
      characterOverview: "Jarvan the First was the 'Emperor of Galeeria'...",
      characterFaction: "Galeerian Empire",
      characterAlignment: "Lawful Evil",
    };
  });

  describe("generateQuizResultsMetadata", () => {
    it("should generate personalized metadata for quiz results", () => {
      const metadata = generateQuizResultsMetadata(mockData);

      expect(metadata.title).toBe(
        `You Are ${mockData.characterName} - ${mockData.characterNickname} | ${SEO_CONFIG.siteName}`
      );
      expect(metadata.description).toContain(mockData.characterName);
      expect(metadata.description).toContain(mockData.characterNickname);
      expect(metadata.description).toContain(mockData.characterQuote);
      expect(metadata.description).toContain("Share your result");
    });

    it("should include character-specific keywords", () => {
      const metadata = generateQuizResultsMetadata(mockData);

      expect(metadata.keywords).toContain("jarvan the first");
      expect(metadata.keywords).toContain("godless emperor");
      expect(metadata.keywords).toContain("quiz result");
      expect(metadata.keywords).toContain("villain quiz result");
    });

    it("should set correct Open Graph properties", () => {
      const metadata = generateQuizResultsMetadata(mockData);

      expect(metadata.openGraph?.title).toBe(
        `You Are ${mockData.characterName} - ${mockData.characterNickname} | ${SEO_CONFIG.siteName}`
      );
      expect(metadata.openGraph?.type).toBe("article");
      expect(metadata.openGraph?.images?.[0]?.url).toBe(
        mockData.characterImage
      );
      expect(metadata.openGraph?.images?.[0]?.alt).toContain(
        mockData.characterName
      );
    });

    it("should set correct Twitter Card properties", () => {
      const metadata = generateQuizResultsMetadata(mockData);

      expect(metadata.twitter?.card).toBe("summary_large_image");
      expect(metadata.twitter?.images?.[0]).toBe(mockData.characterImage);
    });
  });

  describe("generateQuizResultsSchema", () => {
    it("should generate valid Article JSON-LD schema", () => {
      const schema = generateQuizResultsSchema(mockData);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Article");
      expect(schema.headline).toContain(mockData.characterName);
      expect(schema.headline).toContain(mockData.characterNickname);
      expect(schema.description).toContain(mockData.characterQuote);
      expect(schema.image).toBe(mockData.characterImage);
    });

    it("should include character as main entity", () => {
      const schema = generateQuizResultsSchema(mockData);

      expect(schema.mainEntity).toBeDefined();
      expect(schema.mainEntity?.["@type"]).toBe("Person");
      expect(schema.mainEntity?.name).toBe(mockData.characterName);
      expect(schema.mainEntity?.description).toBe(mockData.characterOverview);
      expect(schema.mainEntity?.url).toBe(
        `${SEO_CONFIG.siteUrl}/characters/${mockData.characterSlug}`
      );
    });

    it("should link to parent quiz", () => {
      const schema = generateQuizResultsSchema(mockData);

      expect(schema.isPartOf).toBeDefined();
      expect(schema.isPartOf?.["@type"]).toBe("Quiz");
      expect(schema.isPartOf?.name).toBe("Throne of Gods Villain Quiz");
      expect(schema.isPartOf?.url).toBe(`${SEO_CONFIG.siteUrl}/quiz`);
    });

    it("should include relevant about topics", () => {
      const schema = generateQuizResultsSchema(mockData);

      expect(schema.about).toBeDefined();
      expect(schema.about).toHaveLength(3);
      expect(schema.about?.[0]?.name).toBe("Fantasy Character Quiz");
      expect(schema.about?.[1]?.name).toBe("Personality Assessment");
      expect(schema.about?.[2]?.name).toBe(mockData.characterFaction);
    });

    it("should include comprehensive keywords", () => {
      const schema = generateQuizResultsSchema(mockData);

      expect(schema.keywords).toContain(mockData.characterName);
      expect(schema.keywords).toContain(mockData.characterNickname);
      expect(schema.keywords).toContain("quiz result");
      expect(schema.keywords).toContain(mockData.characterFaction);
      expect(schema.keywords).toContain(mockData.characterAlignment);
    });
  });

  describe("generateQuizResultsBreadcrumbs", () => {
    it("should generate correct breadcrumb structure", () => {
      const breadcrumbs = generateQuizResultsBreadcrumbs(mockData);

      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement).toHaveLength(4);

      const items = breadcrumbs.itemListElement;
      expect(items[0].name).toBe("Home");
      expect(items[0].item).toBe(`${SEO_CONFIG.siteUrl}/`);
      expect(items[1].name).toBe("Quiz");
      expect(items[1].item).toBe(`${SEO_CONFIG.siteUrl}/quiz`);
      expect(items[2].name).toBe("Results");
      expect(items[2].item).toBe(`${SEO_CONFIG.siteUrl}/quiz/results`);
      expect(items[3].name).toBe(`${mockData.characterName} Result`);
      expect(items[3].item).toBeUndefined(); // Current page has no link
    });

    it("should have correct position numbers", () => {
      const breadcrumbs = generateQuizResultsBreadcrumbs(mockData);
      const items = breadcrumbs.itemListElement;

      items.forEach((item, index) => {
        expect(item.position).toBe(index + 1);
      });
    });
  });

  describe("generateQuizResultsSocialMetadata", () => {
    it("should generate Twitter-optimized metadata", () => {
      const socialMeta = generateQuizResultsSocialMetadata(mockData);

      expect(socialMeta["twitter:card"]).toBe("summary_large_image");
      expect(socialMeta["twitter:title"]).toContain(mockData.characterName);
      expect(socialMeta["twitter:description"]).toContain("#ThroneOfGods");
      expect(socialMeta["twitter:description"]).toContain("#VillainQuiz");
      expect(socialMeta["twitter:image"]).toBe(mockData.characterImage);
    });

    it("should generate Facebook/Open Graph optimized metadata", () => {
      const socialMeta = generateQuizResultsSocialMetadata(mockData);

      expect(socialMeta["og:title"]).toContain(mockData.characterName);
      expect(socialMeta["og:description"]).toContain("Share your result");
      expect(socialMeta["og:image"]).toBe(mockData.characterImage);
      expect(socialMeta["og:type"]).toBe("article");
      expect(socialMeta["og:image:width"]).toBe("1200");
      expect(socialMeta["og:image:height"]).toBe("630");
    });

    it("should include article-specific metadata", () => {
      const socialMeta = generateQuizResultsSocialMetadata(mockData);

      expect(socialMeta["article:author"]).toBe(SEO_CONFIG.siteName);
      expect(socialMeta["article:section"]).toBe("Quiz Results");
      expect(socialMeta["article:tag"]).toContain(mockData.characterName);
      expect(socialMeta["article:tag"]).toContain("villain quiz");
    });
  });

  describe("extractQuizResultsSEOData", () => {
    it("should extract SEO data from valid character slug", () => {
      const seoData = extractQuizResultsSEOData("jarvan");

      expect(seoData).toBeDefined();
      expect(seoData?.characterSlug).toBe("jarvan");
      expect(seoData?.characterName).toBe("Jarvan the First");
      expect(seoData?.characterNickname).toBe("The Godless Emperor");
    });

    it("should return null for invalid character slug", () => {
      const seoData = extractQuizResultsSEOData("invalid-slug");

      expect(seoData).toBeNull();
    });

    it("should include all required fields", () => {
      const seoData = extractQuizResultsSEOData("jarvan");

      expect(seoData).toMatchObject({
        characterSlug: expect.any(String),
        characterName: expect.any(String),
        characterNickname: expect.any(String),
        characterImage: expect.any(String),
        characterQuote: expect.any(String),
        characterOverview: expect.any(String),
        characterFaction: expect.any(String),
        characterAlignment: expect.any(String),
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle characters with special characters in names", () => {
      const specialData = {
        ...mockData,
        characterName: "Test & Character",
        characterNickname: "The <Special> One",
      };

      const metadata = generateQuizResultsMetadata(specialData);
      expect(metadata.title).toContain("Test & Character");
      expect(metadata.description).toContain("The <Special> One");
    });

    it("should handle long character descriptions", () => {
      const longData = {
        ...mockData,
        characterOverview: "A".repeat(500),
      };

      const schema = generateQuizResultsSchema(longData);
      expect(schema.mainEntity?.description).toBe(longData.characterOverview);
    });

    it("should handle missing optional fields gracefully", () => {
      const minimalData = {
        ...mockData,
        characterQuote: "",
        characterOverview: "",
      };

      const metadata = generateQuizResultsMetadata(minimalData);
      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
    });
  });
});
