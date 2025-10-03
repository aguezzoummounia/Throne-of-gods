import { describe, it, expect } from "vitest";
import {
  generateQuizMetadata,
  generateQuizSchema,
  generateQuizBreadcrumbSchema,
  generateQuizSocialMetadata,
  getQuizKeywords,
} from "../quiz";
import type { QuizData } from "../quiz";

// Mock quiz data for testing
const mockQuizData: QuizData = {
  questions: [
    {
      id: 1,
      text: "When power fades, how do you reclaim it?",
      answers: [
        {
          text: "Outwit those who stand above",
          villains: ["leticia", "isolde"],
        },
        {
          text: "Burn the world if I must",
          villains: ["eternal-flames", "agon"],
        },
        {
          text: "Wait in shadows. Patience is my blade",
          villains: ["harald", "queen-of-deep"],
        },
      ],
    },
    {
      id: 2,
      text: "What would you sacrifice for control?",
      answers: [
        {
          text: "Love. It's a weakness I buried long ago",
          villains: ["isolde", "queen-of-deep"],
        },
        {
          text: "The lives of countless others",
          villains: ["agon", "eternal-flames"],
        },
      ],
    },
  ],
};

describe("Quiz SEO Functions", () => {
  describe("generateQuizMetadata", () => {
    it("should generate comprehensive metadata for quiz page", () => {
      const metadata = generateQuizMetadata();

      expect(metadata.title).toBe(
        "Which Throne of Gods Villain Are You? | Epic Fantasy Character Quiz"
      );
      expect(metadata.description).toContain("Discover your inner villain");
      expect(metadata.description).toContain("6 thought-provoking questions");
      expect(metadata.keywords).toContain("fantasy character quiz");
      expect(metadata.keywords).toContain("villain personality test");
    });

    it("should include proper Open Graph metadata", () => {
      const metadata = generateQuizMetadata();

      expect(metadata.openGraph?.title).toBe(
        "Which Throne of Gods Villain Are You? | Epic Fantasy Character Quiz"
      );
      expect(metadata.openGraph?.description).toContain(
        "Discover your inner villain"
      );
      expect(metadata.openGraph?.type).toBe("website");
      expect(metadata.openGraph?.images).toBeDefined();
    });

    it("should include Twitter Card metadata", () => {
      const metadata = generateQuizMetadata();

      expect(metadata.twitter?.card).toBe("summary_large_image");
      expect(metadata.twitter?.title).toBe(
        "Which Throne of Gods Villain Are You? | Epic Fantasy Character Quiz"
      );
      expect(metadata.twitter?.description).toContain(
        "Discover your inner villain"
      );
    });

    it("should include canonical URL", () => {
      const metadata = generateQuizMetadata();

      expect(metadata.alternates?.canonical).toContain("/quiz");
    });
  });

  describe("generateQuizSchema", () => {
    it("should generate valid Quiz JSON-LD schema", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Quiz");
      expect(schema.name).toBe("Which Throne of Gods Villain Are You?");
      expect(schema.description).toContain("personality quiz");
      expect(schema.numberOfQuestions).toBe(2);
    });

    it("should include all quiz questions in schema", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema.hasPart).toHaveLength(2);
      expect(schema.hasPart?.[0]["@type"]).toBe("Question");
      expect(schema.hasPart?.[0].text).toBe(
        "When power fades, how do you reclaim it?"
      );
      expect(schema.hasPart?.[0].position).toBe(1);
    });

    it("should include answer options for each question", () => {
      const schema = generateQuizSchema(mockQuizData);

      const firstQuestion = schema.hasPart?.[0];
      expect(firstQuestion?.acceptedAnswer).toHaveLength(3);
      expect(firstQuestion?.acceptedAnswer?.[0]["@type"]).toBe("Answer");
      expect(firstQuestion?.acceptedAnswer?.[0].text).toBe(
        "Outwit those who stand above"
      );
    });

    it("should include proper metadata fields", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema.about).toContain(
        "Fantasy character personality assessment"
      );
      expect(schema.educationalLevel).toBe("General audience");
      expect(schema.timeRequired).toBe("PT3M");
      expect(schema.isAccessibleForFree).toBe(true);
      expect(schema.inLanguage).toBe("en-US");
    });

    it("should include author and publisher information", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema.author?.["@type"]).toBe("Organization");
      expect(schema.publisher?.["@type"]).toBe("Organization");
      expect(schema.author?.name).toBeDefined();
      expect(schema.publisher?.name).toBeDefined();
    });

    it("should include interaction statistics", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema.interactionStatistic?.["@type"]).toBe("InteractionCounter");
      expect(schema.interactionStatistic?.interactionType).toBe(
        "https://schema.org/CommentAction"
      );
      expect(schema.interactionStatistic?.userInteractionCount).toBeGreaterThan(
        0
      );
    });
  });

  describe("generateQuizBreadcrumbSchema", () => {
    it("should generate valid breadcrumb schema", () => {
      const schema = generateQuizBreadcrumbSchema();

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toHaveLength(2);
    });

    it("should include proper breadcrumb structure", () => {
      const schema = generateQuizBreadcrumbSchema();

      const homeItem = schema.itemListElement[0];
      expect(homeItem["@type"]).toBe("ListItem");
      expect(homeItem.position).toBe(1);
      expect(homeItem.name).toBe("Home");
      expect(homeItem.item).toBeDefined();

      const quizItem = schema.itemListElement[1];
      expect(quizItem["@type"]).toBe("ListItem");
      expect(quizItem.position).toBe(2);
      expect(quizItem.name).toBe("Quiz");
    });
  });

  describe("generateQuizSocialMetadata", () => {
    it("should generate Twitter-specific metadata", () => {
      const socialMeta = generateQuizSocialMetadata();

      expect(socialMeta["twitter:card"]).toBe("summary_large_image");
      expect(socialMeta["twitter:title"]).toContain(
        "Which Throne of Gods Villain Are You?"
      );
      expect(socialMeta["twitter:description"]).toContain(
        "Discover your dark destiny"
      );
      expect(socialMeta["twitter:image"]).toContain("/quiz-bg-svg.svg");
    });

    it("should generate Facebook/Open Graph metadata", () => {
      const socialMeta = generateQuizSocialMetadata();

      expect(socialMeta["og:title"]).toContain(
        "Which Throne of Gods Villain Are You?"
      );
      expect(socialMeta["og:description"]).toContain(
        "Uncover your inner villain"
      );
      expect(socialMeta["og:type"]).toBe("website");
      expect(socialMeta["og:image"]).toContain("/quiz-bg-svg.svg");
      expect(socialMeta["og:image:width"]).toBe("1200");
      expect(socialMeta["og:image:height"]).toBe("630");
    });

    it("should include engagement optimization tags", () => {
      const socialMeta = generateQuizSocialMetadata();

      expect(socialMeta["article:tag"]).toContain("fantasy quiz");
      expect(socialMeta["article:tag"]).toContain("villain quiz");
      expect(socialMeta["theme-color"]).toBeDefined();
    });
  });

  describe("getQuizKeywords", () => {
    it("should return comprehensive keyword list", () => {
      const keywords = getQuizKeywords();

      expect(keywords).toContain("fantasy character quiz");
      expect(keywords).toContain("villain personality test");
      expect(keywords).toContain("throne of gods quiz");
      expect(keywords).toContain("which villain are you");
      expect(keywords.length).toBeGreaterThan(10);
    });

    it("should include relevant SEO keywords", () => {
      const keywords = getQuizKeywords();

      expect(keywords).toContain("fantasy villain quiz");
      expect(keywords).toContain("character personality test");
      expect(keywords).toContain("dark fantasy quiz");
      expect(keywords).toContain("personality quiz fantasy");
    });
  });

  describe("Schema Validation", () => {
    it("should generate schemas with required JSON-LD properties", () => {
      const quizSchema = generateQuizSchema(mockQuizData);
      const breadcrumbSchema = generateQuizBreadcrumbSchema();

      // All schemas should have @context and @type
      expect(quizSchema["@context"]).toBe("https://schema.org");
      expect(quizSchema["@type"]).toBeDefined();
      expect(breadcrumbSchema["@context"]).toBe("https://schema.org");
      expect(breadcrumbSchema["@type"]).toBeDefined();
    });

    it("should generate valid URLs in schemas", () => {
      const schema = generateQuizSchema(mockQuizData);

      expect(schema.url).toMatch(/^https?:\/\/.+\/quiz$/);
      expect(schema.image).toMatch(/^https?:\/\/.+\/quiz-bg-svg\.svg$/);
      expect(schema.author?.url).toMatch(/^https?:\/\/.+$/);
      expect(schema.publisher?.url).toMatch(/^https?:\/\/.+$/);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty quiz data gracefully", () => {
      const emptyQuizData: QuizData = { questions: [] };
      const schema = generateQuizSchema(emptyQuizData);

      expect(schema.numberOfQuestions).toBe(0);
      expect(schema.hasPart).toHaveLength(0);
      expect(schema["@type"]).toBe("Quiz");
    });

    it("should handle questions without answers", () => {
      const quizDataNoAnswers: QuizData = {
        questions: [{ id: 1, text: "Test question", answers: [] }],
      };
      const schema = generateQuizSchema(quizDataNoAnswers);

      expect(schema.hasPart?.[0].acceptedAnswer).toHaveLength(0);
      expect(schema.numberOfQuestions).toBe(1);
    });
  });
});
