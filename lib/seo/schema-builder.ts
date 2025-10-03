import {
  WebsiteSchema,
  PersonSchema,
  QuizSchema,
  ArticleSchema,
  BreadcrumbSchema,
  JSONLDSchema,
} from "./types";
import { SEO_CONFIG, SCHEMA_CONTEXT } from "./config";
import { VillainProfile } from "@/lib/types";
import { SEOValidator, SEOErrorLogger } from "./validation";

export class SchemaBuilder {
  /**
   * Create Website schema for homepage with organization data and navigation
   */
  static createWebsiteSchema(): WebsiteSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "WebSite",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      description: SEO_CONFIG.defaultDescription,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SEO_CONFIG.siteUrl}/quiz?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
        description: SEO_CONFIG.defaultDescription,
        logo: {
          "@type": "ImageObject",
          url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
          width: 200,
          height: 200,
        },
      },
      mainEntity: {
        "@type": "Quiz",
        name: "Throne of Gods Villain Personality Quiz",
        description:
          "Discover which powerful villain from the Throne of Gods universe matches your personality",
        url: `${SEO_CONFIG.siteUrl}/quiz`,
      },
      hasPart: [
        {
          "@type": "WebPage",
          name: "Character Profiles",
          url: `${SEO_CONFIG.siteUrl}/characters`,
          description:
            "Explore detailed profiles of villains from the Throne of Gods universe",
        },
        {
          "@type": "WebPage",
          name: "Personality Quiz",
          url: `${SEO_CONFIG.siteUrl}/quiz`,
          description: "Take our quiz to discover your villain match",
        },
      ],
    };
  }

  /**
   * Create Person schema for character pages with relationships, powers, and story context
   */
  static createPersonSchema(character: any): PersonSchema {
    const characterUrl = `${SEO_CONFIG.siteUrl}/characters/${character.slug}`;

    // Validate character image and use fallback if needed
    const imageValidation = SEOValidator.validateImageURL(character.image);
    if (imageValidation.fallbackUsed) {
      SEOErrorLogger.logWarning(
        "Character image validation failed, using fallback",
        {
          characterName: character.name,
          originalImage: character.image,
          fallbackImage: imageValidation.url,
          error: imageValidation.error,
        }
      );
    }

    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Person",
      name: character.name,
      description: character.overview,
      image: {
        "@type": "ImageObject",
        url: imageValidation.url,
        caption: `${character.name} - ${character.nickname}`,
      },
      url: characterUrl,
      alternateName: character.nickname,
      affiliation: {
        "@type": "Organization",
        name: character.stats.faction,
      },
      knowsAbout: [
        character.stats.role,
        character.stats.faction,
        character.stats.location,
        ...character.powers.map((power: any) => power.name),
        "Fantasy",
        "Throne of Gods",
        "Erosea",
        "Dark Fantasy",
        "Character Profile",
        ...(character.trivia || []).slice(0, 3), // Add some trivia as knowledge
      ],
      hasOccupation: {
        "@type": "Role",
        roleName: character.stats.role,
      },
      homeLocation: {
        "@type": "Place",
        name: character.stats.location,
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Nickname",
          value: character.nickname,
        },
        {
          "@type": "PropertyValue",
          name: "Race",
          value: character.stats.race,
        },
        {
          "@type": "PropertyValue",
          name: "Alignment",
          value: character.stats.alignment,
        },
        {
          "@type": "PropertyValue",
          name: "Status",
          value: character.stats.status,
        },
        {
          "@type": "PropertyValue",
          name: "Age",
          value: character.stats.age,
        },
        {
          "@type": "PropertyValue",
          name: "Quote",
          value: character.quote,
        },
        {
          "@type": "PropertyValue",
          name: "Allies",
          value: character.relations.allies,
        },
        {
          "@type": "PropertyValue",
          name: "Enemies",
          value: character.relations.enemies,
        },
        // Add power details as properties
        ...character.powers.map((power: any, index: number) => ({
          "@type": "PropertyValue",
          name: `Power ${index + 1}`,
          value: `${power.name}: ${power.overview}`,
        })),
        // Add faction context
        {
          "@type": "PropertyValue",
          name: "Faction Context",
          value: `Member of ${character.stats.faction} in ${character.stats.location}`,
        },
      ],
      subjectOf: {
        "@type": "Article",
        name: `${character.name} Character Profile`,
        description:
          character.backstory.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
        url: characterUrl,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": characterUrl,
        name: `${character.name} - ${character.nickname}`,
        description: character.overview,
      },
    };
  }

  /**
   * Create Quiz schema for quiz pages with question structure and engagement data
   */
  static createQuizSchema(
    questionCount: number,
    questions?: any[]
  ): QuizSchema {
    const baseSchema: QuizSchema = {
      "@context": SCHEMA_CONTEXT,
      "@type": "Quiz",
      name: "Throne of Gods Villain Personality Quiz",
      description:
        "Discover which powerful villain from the Throne of Gods universe matches your personality and dark ambitions.",
      numberOfQuestions: questionCount,
      about: "Fantasy character personality assessment",
      educationalLevel: "General audience",
      timeRequired: "PT5M", // 5 minutes in ISO 8601 duration format
      url: `${SEO_CONFIG.siteUrl}/quiz`,
      image: `${SEO_CONFIG.siteUrl}/images/quiz-preview.jpg`,
      author: {
        "@type": "Organization",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      inLanguage: "en-US",
      isAccessibleForFree: true,
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/TakeAction",
        userInteractionCount: 0, // This would be updated with actual data
      },
      hasPart:
        questions?.map((question, index) => ({
          "@type": "Question",
          name: `Question ${index + 1}`,
          text: question.text,
          position: index + 1,
          acceptedAnswer: question.answers?.map((answer: any) => ({
            "@type": "Answer",
            text: answer.text,
          })),
        })) || [],
      mainEntity: {
        "@type": "WebPage",
        name: "Quiz Results",
        url: `${SEO_CONFIG.siteUrl}/quiz/results`,
        description:
          "Discover your villain match and explore character details",
      },
    };

    return baseSchema;
  }

  /**
   * Create Article schema for quiz results with result linking
   */
  static createArticleSchema(
    character: VillainProfile,
    userResult?: boolean
  ): ArticleSchema {
    const headline = userResult
      ? `Your Throne of Gods Result: ${character.name}`
      : `Character Profile: ${character.name} - ${character.nickname}`;

    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Article",
      headline,
      description: character.overview,
      image: character.image,
      author: {
        "@type": "Organization",
        name: SEO_CONFIG.siteName,
      },
      publisher: {
        "@type": "Organization",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntity: userResult
        ? {
            "@type": "Person",
            name: character.name,
            description: character.overview,
            url: `${SEO_CONFIG.siteUrl}/characters/${character.slug}`,
          }
        : undefined,
      isPartOf: userResult
        ? {
            "@type": "Quiz",
            name: "Throne of Gods Villain Personality Quiz",
            url: `${SEO_CONFIG.siteUrl}/quiz`,
          }
        : undefined,
    };
  }

  /**
   * Create comprehensive quiz results schema with engagement data
   */
  static createQuizResultSchema(character: VillainProfile): JSONLDSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "WebPage",
      name: `Quiz Result: ${character.name}`,
      description: `You matched with ${character.name} - ${character.nickname}. ${character.overview}`,
      url: `${SEO_CONFIG.siteUrl}/quiz/results/${character.slug}`,
      mainEntity: {
        "@type": "Person",
        name: character.name,
        description: character.overview,
        image: character.image,
        url: `${SEO_CONFIG.siteUrl}/characters/${character.slug}`,
      },
      isPartOf: {
        "@type": "Quiz",
        name: "Throne of Gods Villain Personality Quiz",
        url: `${SEO_CONFIG.siteUrl}/quiz`,
      },
      potentialAction: [
        {
          "@type": "ShareAction",
          name: "Share your result",
          description: `Share that you matched with ${character.name}`,
        },
        {
          "@type": "ViewAction",
          name: "View character profile",
          target: `${SEO_CONFIG.siteUrl}/characters/${character.slug}`,
        },
        {
          "@type": "Action",
          name: "Retake quiz",
          target: `${SEO_CONFIG.siteUrl}/quiz`,
        },
      ],
    };
  }

  /**
   * Create breadcrumb schema
   */
  static createBreadcrumbSchema(
    items: Array<{ name: string; url?: string }>
  ): BreadcrumbSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.url && { item: `${SEO_CONFIG.siteUrl}${item.url}` }),
      })),
    };
  }

  /**
   * Create homepage breadcrumb schema with site navigation structure
   */
  static createHomepageBreadcrumbSchema(): BreadcrumbSchema {
    return this.createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Quiz", url: "/quiz" },
      { name: "Characters", url: "/characters" },
    ]);
  }

  /**
   * Create Organization schema
   */
  static createOrganizationSchema(): JSONLDSchema {
    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      description: SEO_CONFIG.defaultDescription,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
      },
      sameAs: [
        // Add social media URLs here when available
      ],
    };
  }

  /**
   * Validate JSON-LD schema with comprehensive validation
   */
  static validateSchema(schema: JSONLDSchema): boolean {
    const validation = SEOValidator.validateJSONLDSchema(schema);

    if (!validation.isValid) {
      SEOErrorLogger.logError("Schema validation failed", {
        errors: validation.errors,
        warnings: validation.warnings,
        schemaType: schema["@type"],
      });
      return false;
    }

    if (validation.warnings.length > 0) {
      SEOErrorLogger.logWarning("Schema has validation warnings", {
        warnings: validation.warnings,
        score: validation.score,
        schemaType: schema["@type"],
      });
    }

    return true;
  }

  /**
   * Create enhanced character schema with detailed power and relationship context
   */
  static createEnhancedCharacterSchema(character: any): JSONLDSchema[] {
    const characterUrl = `${SEO_CONFIG.siteUrl}/characters/${character.slug}`;

    // Main Person schema
    const personSchema = this.createPersonSchema(character);

    // Create power schemas as CreativeWork entities
    const powerSchemas = character.powers.map((power: any, index: number) => ({
      "@context": SCHEMA_CONTEXT,
      "@type": "CreativeWork",
      name: power.name,
      description: power.overview,
      image: power.image,
      creator: {
        "@type": "Person",
        name: character.name,
        url: characterUrl,
      },
      isPartOf: {
        "@type": "Person",
        name: character.name,
        url: characterUrl,
      },
      position: index + 1,
    }));

    // Create faction/organization schema
    const factionSchema = {
      "@context": SCHEMA_CONTEXT,
      "@type": "Organization",
      name: character.stats.faction,
      location: {
        "@type": "Place",
        name: character.stats.location,
      },
      member: {
        "@type": "Person",
        name: character.name,
        url: characterUrl,
      },
    };

    return [personSchema, factionSchema, ...powerSchemas];
  }

  /**
   * Create character relationship schema
   */
  static createCharacterRelationshipSchema(character: any): JSONLDSchema {
    const characterUrl = `${SEO_CONFIG.siteUrl}/characters/${character.slug}`;

    return {
      "@context": SCHEMA_CONTEXT,
      "@type": "Article",
      name: `${character.name} Relationships and Alliances`,
      description: `Explore the complex relationships of ${character.name} including allies: ${character.relations.allies} and enemies: ${character.relations.enemies}`,
      mainEntity: {
        "@type": "Person",
        name: character.name,
        url: characterUrl,
      },
      about: [
        {
          "@type": "Thing",
          name: "Allies",
          description: character.relations.allies,
        },
        {
          "@type": "Thing",
          name: "Enemies",
          description: character.relations.enemies,
        },
      ],
      isPartOf: {
        "@type": "WebSite",
        name: SEO_CONFIG.siteName,
        url: SEO_CONFIG.siteUrl,
      },
    };
  }

  /**
   * Combine multiple schemas into a single JSON-LD array with validation
   */
  static combineSchemas(...schemas: JSONLDSchema[]): JSONLDSchema[] {
    const validSchemas = schemas.filter((schema) => {
      const isValid = this.validateSchema(schema);
      if (!isValid) {
        SEOErrorLogger.logError(
          "Schema excluded from combination due to validation failure",
          {
            schemaType: schema["@type"],
            schema: schema,
          }
        );
      }
      return isValid;
    });

    SEOErrorLogger.logInfo(
      `Combined ${validSchemas.length} of ${schemas.length} schemas`,
      {
        validCount: validSchemas.length,
        totalCount: schemas.length,
        excludedCount: schemas.length - validSchemas.length,
      }
    );

    return validSchemas;
  }
}
