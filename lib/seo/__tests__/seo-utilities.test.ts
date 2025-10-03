import { describe, it, expect, beforeEach, vi } from "vitest";
import { SEOGenerator } from "../generator";
import { SchemaBuilder } from "../schema-builder";
import { SEOValidator, SEOErrorLogger } from "../validation";
import { SEOConfig, JSONLDSchema } from "../types";
import { SEO_CONFIG } from "../config";

describe("SEO Utilities - Comprehensive Unit Tests", () => {
  beforeEach(() => {
    SEOErrorLogger.clearLogs();
    vi.clearAllMocks();
  });

  describe("SEOGenerator Core Functions", () => {
    describe("generateMetadata", () => {
      it("should generate complete metadata for valid configuration", () => {
        const config: SEOConfig = {
          title: "Test Character Profile - Throne of Gods",
          description:
            "Discover the detailed profile of this mysterious character from the Throne of Gods universe with their powers, relationships, and story.",
          keywords: [
            "fantasy",
            "character",
            "throne of gods",
            "villain",
            "profile",
          ],
          image: {
            url: "/images/character-test.jpg",
            width: 1200,
            height: 630,
            alt: "Test Character Portrait",
          },
          url: "/characters/test-character",
          type: "profile",
          author: "Throne of Gods Team",
          siteName: "Throne of Gods",
        };

        const metadata = SEOGenerator.generateMetadata(config);

        expect(metadata.title).toBe(config.title);
        expect(metadata.description).toBe(config.description);
        expect(metadata.keywords).toEqual(config.keywords);
        expect(metadata.authors).toEqual([{ name: config.author }]);
        expect(metadata.creator).toBe(config.author);
        expect(metadata.publisher).toBe(SEO_CONFIG.siteName);

        // OpenGraph validation
        expect(metadata.openGraph?.title).toBe(config.title);
        expect(metadata.openGraph?.description).toBe(config.description);
        expect(metadata.openGraph?.type).toBe(config.type);
        expect(metadata.openGraph?.siteName).toBe(SEO_CONFIG.siteName);
        expect(metadata.openGraph?.images).toBeDefined();

        // Twitter validation
        expect(metadata.twitter?.card).toBe("summary_large_image");
        expect(metadata.twitter?.title).toBe(config.title);
        expect(metadata.twitter?.description).toBe(config.description);
        expect(metadata.twitter?.creator).toBe(SEO_CONFIG.twitterHandle);

        // Mobile optimization
        expect(metadata.viewport).toBeDefined();
        expect(metadata.themeColor).toBeDefined();
        expect(metadata.appleWebApp?.capable).toBe(true);
        expect(metadata.icons).toBeDefined();
      });

      it("should handle missing required fields with fallbacks", () => {
        const incompleteConfig: Partial<SEOConfig> = {
          keywords: ["test"],
        };

        const metadata = SEOGenerator.generateMetadata(
          incompleteConfig as SEOConfig
        );

        expect(metadata.title).toBeDefined();
        expect(metadata.title).not.toBe("");
        expect(metadata.description).toBeDefined();
        expect(metadata.description).not.toBe("");
        expect(metadata.keywords).toBeDefined();
        expect(metadata.openGraph?.images).toBeDefined();
      });

      it("should sanitize HTML content in title and description", () => {
        const configWithHtml: SEOConfig = {
          title:
            "<script>alert('xss')</script>Clean Title <strong>Bold</strong>",
          description:
            "<p>Description with <em>emphasis</em> and <a href='#'>links</a></p>",
          author: "Test Author",
          siteName: "Test Site",
        };

        // Test the validateConfig method directly which does the sanitization
        const validatedConfig = SEOGenerator.validateConfig(configWithHtml);

        expect(validatedConfig.title).not.toContain("<script>");
        expect(validatedConfig.title).not.toContain("<strong>");
        expect(validatedConfig.title).toContain("Clean Title Bold");
        expect(validatedConfig.description).not.toContain("<p>");
        expect(validatedConfig.description).not.toContain("<em>");
        expect(validatedConfig.description).toContain(
          "Description with emphasis and links"
        );
      });

      it("should generate responsive social media images", () => {
        const config: SEOConfig = {
          title: "Test Title",
          description: "Test Description",
          image: {
            url: "/images/test.jpg",
            width: 1200,
            height: 630,
            alt: "Test Image",
          },
          mobileImage: {
            url: "/images/test-mobile.jpg",
            width: 800,
            height: 600,
            alt: "Test Mobile Image",
          },
          socialImages: {
            facebook: {
              url: "/images/test-facebook.jpg",
              width: 1200,
              height: 630,
              alt: "Test Facebook Image",
            },
            twitter: {
              url: "/images/test-twitter.jpg",
              width: 1200,
              height: 675,
              alt: "Test Twitter Image",
            },
          },
          author: "Test Author",
          siteName: "Test Site",
        };

        const metadata = SEOGenerator.generateMetadata(config);

        expect(metadata.openGraph?.images).toHaveLength(2);
        expect(metadata.twitter?.images).toBeDefined();
      });

      it("should handle invalid image URLs with fallbacks", () => {
        const configWithBadImage: SEOConfig = {
          title: "Test Title",
          description: "Test Description",
          image: {
            url: "invalid-image-url.txt",
            width: 1200,
            height: 630,
            alt: "Test Image",
          },
          author: "Test Author",
          siteName: "Test Site",
        };

        const metadata = SEOGenerator.generateMetadata(configWithBadImage);

        expect(metadata.openGraph?.images).toBeDefined();

        // Should log image validation warnings
        const warningLogs = SEOErrorLogger.getLogs("warning");
        const imageWarnings = warningLogs.filter((log) =>
          log.message.includes("image validation failed")
        );
        expect(imageWarnings.length).toBeGreaterThan(0);
      });
    });

    describe("generateSocialTags", () => {
      it("should generate platform-specific social media tags", () => {
        const config: SEOConfig = {
          title: "Test Social Title",
          description: "Test social description for sharing",
          image: {
            url: "/images/social-test.jpg",
            width: 1200,
            height: 630,
            alt: "Social Test Image",
          },
          author: "Test Author",
          siteName: "Test Site",
        };

        const socialTags = SEOGenerator.generateSocialTags(config);

        expect(socialTags["twitter:card"]).toBe("summary_large_image");
        expect(socialTags["twitter:site"]).toBe(SEO_CONFIG.twitterHandle);
        expect(socialTags["twitter:title"]).toBe(config.title);
        expect(socialTags["twitter:description"]).toBe(config.description);
        expect(socialTags["twitter:image"]).toBe(config.image?.url);
        expect(socialTags["twitter:image:alt"]).toBe(config.image?.alt);
        expect(socialTags["og:image:width"]).toBe("1200");
        expect(socialTags["og:image:height"]).toBe("630");
      });
    });

    describe("validateConfig", () => {
      it("should validate and sanitize configuration", () => {
        const config: Partial<SEOConfig> = {
          title: "  Valid Title with Extra Spaces  ",
          description: "Valid description with proper length and content",
          keywords: ["test", "validation"],
        };

        const validated = SEOGenerator.validateConfig(config);

        expect(validated.title).toBe("Valid Title with Extra Spaces");
        expect(validated.description).toBe(
          "Valid description with proper length and content"
        );
        expect(validated.keywords).toEqual(config.keywords);
        expect(validated.author).toBe(SEO_CONFIG.author);
        expect(validated.siteName).toBe(SEO_CONFIG.siteName);
      });

      it("should limit description length", () => {
        const longDescription = "a".repeat(200);
        const config: Partial<SEOConfig> = {
          title: "Test Title",
          description: longDescription,
        };

        const validated = SEOGenerator.validateConfig(config);

        expect(validated.description.length).toBeLessThanOrEqual(160);
        expect(validated.description).toContain("a");
      });
    });

    describe("generateJSONLDScript", () => {
      it("should generate valid JSON-LD script for valid schema", () => {
        const schema: JSONLDSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Test Website",
          url: "https://example.com",
          description: "Test website description",
        };

        const script = SEOGenerator.generateJSONLDScript(schema);

        expect(script).toBeDefined();
        expect(() => JSON.parse(script)).not.toThrow();

        const parsed = JSON.parse(script);
        expect(parsed["@context"]).toBe("https://schema.org");
        expect(parsed["@type"]).toBe("WebSite");
        expect(parsed.name).toBe("Test Website");
      });

      it("should return fallback for invalid schema", () => {
        const invalidSchema: JSONLDSchema = {
          "@context": "",
          "@type": "",
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
      });
    });

    describe("createBreadcrumbs", () => {
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

        breadcrumbs.itemListElement.forEach((item: any, index: number) => {
          expect(item["@type"]).toBe("ListItem");
          expect(item.position).toBe(index + 1);
          expect(item.name).toBe(items[index].name);
          if (items[index].url) {
            expect(item.item).toContain(items[index].url);
          }
        });
      });

      it("should handle empty breadcrumb list", () => {
        const breadcrumbs = SEOGenerator.createBreadcrumbs([]);

        expect(breadcrumbs["@context"]).toBe("https://schema.org");
        expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
        expect(breadcrumbs.itemListElement).toHaveLength(0);
      });
    });

    describe("mobile optimization methods", () => {
      it("should generate mobile-optimized viewport", () => {
        const config: SEOConfig = {
          title: "Test Title",
          description: "Test Description",
          isMobileOptimized: true,
          author: "Test Author",
          siteName: "Test Site",
        };

        const metadata = SEOGenerator.generateMetadata(config);

        expect(metadata.viewport).toContain("width=device-width");
        expect(metadata.viewport).toContain("initial-scale=1");
        expect(metadata.viewport).toContain("user-scalable=no");
      });

      it("should generate platform-specific meta tags", () => {
        const config: SEOConfig = {
          title: "Test Title",
          description: "Test Description",
          image: {
            url: "/images/test.jpg",
            width: 1200,
            height: 630,
            alt: "Test Image",
          },
          author: "Test Author",
          siteName: "Test Site",
        };

        const facebookMeta = SEOGenerator.generatePlatformSpecificMeta(
          "facebook",
          config
        );
        const twitterMeta = SEOGenerator.generatePlatformSpecificMeta(
          "twitter",
          config
        );
        const whatsappMeta = SEOGenerator.generatePlatformSpecificMeta(
          "whatsapp",
          config
        );

        expect(facebookMeta["og:image"]).toBeDefined();
        expect(facebookMeta["og:image:width"]).toBe("1200");
        expect(twitterMeta["twitter:card"]).toBe("summary_large_image");
        expect(whatsappMeta["og:type"]).toBe("website");
      });
    });
  });

  describe("SchemaBuilder Core Functions", () => {
    const mockCharacter = {
      name: "Test Villain",
      nickname: "The Tester",
      slug: "test-villain",
      overview: "A mysterious villain created for testing purposes",
      image: "/images/test-villain.jpg",
      quote: "Testing is the path to perfection",
      backstory:
        "<p>This villain was born from the need to test our systems.</p>",
      stats: {
        faction: "Test Faction",
        role: "Test Role",
        race: "Test Race",
        alignment: "Chaotic Test",
        status: "Active",
        age: "Unknown",
        location: "Test Realm",
      },
      relations: {
        allies: "Test Allies",
        enemies: "Test Enemies",
      },
      powers: [
        {
          name: "Test Power",
          overview: "The ability to test anything",
          image: "/images/test-power.jpg",
        },
      ],
      trivia: ["Loves testing", "Never fails a test", "Born to debug"],
    };

    describe("createWebsiteSchema", () => {
      it("should create valid website schema", () => {
        const schema = SchemaBuilder.createWebsiteSchema();

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("WebSite");
        expect(schema.name).toBe(SEO_CONFIG.siteName);
        expect(schema.url).toBe(SEO_CONFIG.siteUrl);
        expect(schema.description).toBe(SEO_CONFIG.defaultDescription);
        expect(schema.potentialAction).toBeDefined();
        expect(schema.publisher).toBeDefined();
        expect(schema.mainEntity).toBeDefined();
        expect(schema.hasPart).toBeDefined();
        expect(schema.hasPart).toHaveLength(2);
      });
    });

    describe("createPersonSchema", () => {
      it("should create valid person schema for character", () => {
        const schema = SchemaBuilder.createPersonSchema(mockCharacter);

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("Person");
        expect(schema.name).toBe(mockCharacter.name);
        expect(schema.description).toBe(mockCharacter.overview);
        expect(schema.alternateName).toBe(mockCharacter.nickname);
        expect(schema.affiliation).toBeDefined();
        expect(schema.knowsAbout).toContain(mockCharacter.stats.role);
        expect(schema.knowsAbout).toContain(mockCharacter.stats.faction);
        expect(schema.hasOccupation).toBeDefined();
        expect(schema.homeLocation).toBeDefined();
        expect(schema.additionalProperty).toBeDefined();
        expect(schema.additionalProperty?.length).toBeGreaterThan(0);
      });

      it("should handle character with invalid image", () => {
        const characterWithBadImage = {
          ...mockCharacter,
          image: "invalid-image.txt",
        };

        const schema = SchemaBuilder.createPersonSchema(characterWithBadImage);

        expect(schema.image).toBeDefined();

        // Should log image validation warning
        const warningLogs = SEOErrorLogger.getLogs("warning");
        const imageWarnings = warningLogs.filter((log) =>
          log.message.includes("Character image validation failed")
        );
        expect(imageWarnings.length).toBeGreaterThan(0);
      });
    });

    describe("createQuizSchema", () => {
      it("should create valid quiz schema", () => {
        const questions = [
          {
            text: "What is your favorite color?",
            answers: [{ text: "Red" }, { text: "Blue" }, { text: "Green" }],
          },
          {
            text: "What is your preferred weapon?",
            answers: [{ text: "Sword" }, { text: "Magic" }, { text: "Bow" }],
          },
        ];

        const schema = SchemaBuilder.createQuizSchema(10, questions);

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("Quiz");
        expect(schema.name).toContain("Throne of Gods");
        expect(schema.numberOfQuestions).toBe(10);
        expect(schema.timeRequired).toBe("PT5M");
        expect(schema.isAccessibleForFree).toBe(true);
        expect(schema.hasPart).toHaveLength(2);
        expect(schema.hasPart?.[0]["@type"]).toBe("Question");
        expect(schema.hasPart?.[0].acceptedAnswer).toBeDefined();
      });

      it("should create quiz schema without questions", () => {
        const schema = SchemaBuilder.createQuizSchema(5);

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("Quiz");
        expect(schema.numberOfQuestions).toBe(5);
        expect(schema.hasPart).toEqual([]);
      });
    });

    describe("createArticleSchema", () => {
      it("should create article schema for character profile", () => {
        const schema = SchemaBuilder.createArticleSchema(
          mockCharacter as any,
          false
        );

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("Article");
        expect(schema.headline).toContain(mockCharacter.name);
        expect(schema.headline).toContain(mockCharacter.nickname);
        expect(schema.description).toBe(mockCharacter.overview);
        expect(schema.image).toBe(mockCharacter.image);
        expect(schema.author).toBeDefined();
        expect(schema.publisher).toBeDefined();
      });

      it("should create article schema for user result", () => {
        const schema = SchemaBuilder.createArticleSchema(
          mockCharacter as any,
          true
        );

        expect(schema.headline).toContain("Your Throne of Gods Result");
        expect(schema.mainEntity).toBeDefined();
        expect(schema.isPartOf).toBeDefined();
        expect(schema.isPartOf?.["@type"]).toBe("Quiz");
      });
    });

    describe("createBreadcrumbSchema", () => {
      it("should create valid breadcrumb schema", () => {
        const items = [
          { name: "Home", url: "/" },
          { name: "Characters", url: "/characters" },
          { name: "Test Character" },
        ];

        const schema = SchemaBuilder.createBreadcrumbSchema(items);

        expect(schema["@context"]).toBe("https://schema.org");
        expect(schema["@type"]).toBe("BreadcrumbList");
        expect(schema.itemListElement).toHaveLength(3);
        expect(schema.itemListElement[0].position).toBe(1);
        expect(schema.itemListElement[0].name).toBe("Home");
      });
    });

    describe("validateSchema", () => {
      it("should validate correct schema", () => {
        const validSchema: JSONLDSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Test Site",
          url: "https://example.com",
          description: "Test description",
        };

        const isValid = SchemaBuilder.validateSchema(validSchema);

        expect(isValid).toBe(true);
        expect(SEOErrorLogger.getLogs("error")).toHaveLength(0);
      });

      it("should reject invalid schema", () => {
        const invalidSchema: JSONLDSchema = {
          "@context": "",
          "@type": "WebSite",
        };

        const isValid = SchemaBuilder.validateSchema(invalidSchema);

        expect(isValid).toBe(false);
        expect(SEOErrorLogger.getLogs("error").length).toBeGreaterThan(0);
      });
    });

    describe("combineSchemas", () => {
      it("should combine valid schemas", () => {
        const schema1: JSONLDSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Test Site",
          url: "https://example.com",
          description: "Test description",
        };

        const schema2: JSONLDSchema = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Test Person",
          description: "Test person",
        };

        const combined = SchemaBuilder.combineSchemas(schema1, schema2);

        expect(combined).toHaveLength(2);
        expect(combined[0]["@type"]).toBe("WebSite");
        expect(combined[1]["@type"]).toBe("Person");
      });

      it("should exclude invalid schemas from combination", () => {
        const validSchema: JSONLDSchema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Test Site",
          url: "https://example.com",
          description: "Test description",
        };

        const invalidSchema: JSONLDSchema = {
          "@context": "",
          "@type": "",
        };

        const combined = SchemaBuilder.combineSchemas(
          validSchema,
          invalidSchema
        );

        expect(combined).toHaveLength(1);
        expect(combined[0]["@type"]).toBe("WebSite");

        // Should log exclusion
        const errorLogs = SEOErrorLogger.getLogs("error");
        expect(errorLogs.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Handling and Fallback Scenarios", () => {
    it("should handle circular references in JSON-LD", () => {
      const circularSchema: any = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Test",
      };
      circularSchema.self = circularSchema;

      const script = SEOGenerator.generateJSONLDScript(circularSchema);

      expect(script).toBeDefined();
      expect(() => JSON.parse(script)).not.toThrow();

      const parsed = JSON.parse(script);
      expect(parsed.name).toBe("Throne of Gods"); // Should use fallback
    });

    it("should handle missing character data gracefully", () => {
      const incompleteCharacter = {
        name: "Test Character",
        slug: "test",
        overview: "A test character with minimal data",
        backstory: "A simple backstory for testing purposes",
        stats: {
          faction: "Unknown",
          role: "Unknown",
          race: "Unknown",
          alignment: "Unknown",
          status: "Unknown",
          age: "Unknown",
          location: "Unknown",
        },
        relations: {
          allies: "Unknown",
          enemies: "Unknown",
        },
        powers: [],
        trivia: [],
      };

      const schema = SchemaBuilder.createPersonSchema(incompleteCharacter);

      expect(schema["@type"]).toBe("Person");
      expect(schema.name).toBe("Test Character");
      expect(schema.description).toBeDefined(); // Should have fallback
    });

    it("should accumulate multiple validation errors", () => {
      const problematicConfig: Partial<SEOConfig> = {
        title: "",
        description: "",
        type: "invalid-type" as any,
        url: "not-a-url",
      };

      SEOGenerator.generateMetadata(problematicConfig as SEOConfig);

      const summary = SEOErrorLogger.getLogsSummary();
      expect(summary.errors).toBeGreaterThan(0);
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
      expect(errorLog.timestamp).toBeInstanceOf(Date);
    });
  });
});
