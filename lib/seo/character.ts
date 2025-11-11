import { Metadata, Viewport } from "next";
import { VillainProfile } from "@/lib/types";
import { SEOGenerator } from "./generator";
import { SchemaBuilder } from "./schema-builder";
import { MobileSEO } from "./mobile";
import { SEOConfig, PersonSchema, BreadcrumbSchema } from "./types";
import { SEO_CONFIG, DEFAULT_FALLBACKS } from "./config";

// Type for character data from charactersData
type CharacterData = {
  slug: string;
  name: string;
  nickname: string;
  image: string;
  quote: string;
  overview: string;
  relations: {
    allies: string;
    enemies: string;
  };
  powers: Array<{
    name: string;
    image: string;
    overview: string;
  }>;
  stats: {
    race: string;
    age: string;
    faction: string;
    alignment: string;
    status: string;
    role: string;
    location: string;
  };
  trivia?: string[];
  backstory: string;
};

export class CharacterSEO {
  /**
   * Generate comprehensive metadata for character profile pages
   */
  static generateCharacterMetadata(
    character: CharacterData | VillainProfile
  ): Metadata {
    const config: SEOConfig = {
      title: `${character.name} - ${character.nickname} | ${SEO_CONFIG.siteName}`,
      description: this.generateCharacterDescription(character),
      keywords: this.generateCharacterKeywords(character),
      image: {
        url: character.image || DEFAULT_FALLBACKS.characterImage,
        width: 1200,
        height: 630,
        alt: `${character.name} - ${character.nickname}`,
      },
      url: `/characters/${character.slug}`,
      type: "profile",
      author: SEO_CONFIG.author,
      siteName: SEO_CONFIG.siteName,
      isMobileOptimized: true,
    };

    return SEOGenerator.generateMetadata(config);
  }

  /**
   * Generate viewport configuration for character pages
   */
  static generateCharacterViewport(
    character: CharacterData | VillainProfile
  ): Viewport {
    const config: SEOConfig = {
      title: `${character.name} - ${character.nickname} | ${SEO_CONFIG.siteName}`,
      description: this.generateCharacterDescription(character),
      url: `/characters/${character.slug}`,
      isMobileOptimized: true,
    };

    return SEOGenerator.generateViewport(config);
  }

  /**
   * Generate character-specific description for SEO
   */
  private static generateCharacterDescription(
    character: CharacterData | VillainProfile
  ): string {
    // Create a compelling description that includes key character details
    const description = `Discover ${character.name}, ${
      character.nickname
    }, from the Throne of Gods universe. ${character.overview.substring(
      0,
      100
    )}... Learn about their powers, relationships, and role in the world of Erosea.`;

    return description.length > 160
      ? description.substring(0, 157) + "..."
      : description;
  }

  /**
   * Generate character-specific keywords
   */
  private static generateCharacterKeywords(
    character: CharacterData | VillainProfile
  ): string[] {
    const baseKeywords = [...SEO_CONFIG.defaultKeywords];

    // Add character-specific keywords
    const characterKeywords = [
      character.name.toLowerCase(),
      character.nickname.toLowerCase(),
      character.stats.faction.toLowerCase(),
      character.stats.role.toLowerCase(),
      character.stats.race.toLowerCase(),
      character.stats.location.toLowerCase(),
      ...character.powers.map((power) => power.name.toLowerCase()),
    ];

    // Add power-related keywords
    const powerKeywords = character.powers.flatMap((power) =>
      power.name.toLowerCase().split(" ")
    );

    return [...baseKeywords, ...characterKeywords, ...powerKeywords]
      .filter((keyword, index, array) => array.indexOf(keyword) === index) // Remove duplicates
      .slice(0, 20); // Limit to 20 keywords
  }

  /**
   * Generate Person JSON-LD schema for character
   */
  static generateCharacterSchema(
    character: CharacterData | VillainProfile
  ): PersonSchema {
    return SchemaBuilder.createPersonSchema(character);
  }

  /**
   * Generate enhanced character schemas with power and relationship data
   */
  static generateEnhancedCharacterSchemas(
    character: CharacterData | VillainProfile
  ): any[] {
    return SchemaBuilder.createEnhancedCharacterSchema(character);
  }

  /**
   * Generate character relationship schema
   */
  static generateCharacterRelationshipSchema(
    character: CharacterData | VillainProfile
  ) {
    return SchemaBuilder.createCharacterRelationshipSchema(character);
  }

  /**
   * Generate breadcrumb schema for character pages
   */
  static generateCharacterBreadcrumbs(
    character: CharacterData | VillainProfile
  ): BreadcrumbSchema {
    return SchemaBuilder.createBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Characters", url: "/characters" },
      { name: character.name },
    ]);
  }

  /**
   * Generate social sharing optimization for character
   */
  static generateCharacterSocialTags(
    character: CharacterData | VillainProfile
  ) {
    const config: SEOConfig = {
      title: `${character.name} - ${character.nickname}`,
      description: this.generateSocialDescription(character),
      image: {
        url: character.image || DEFAULT_FALLBACKS.characterImage,
        width: 1200,
        height: 630,
        alt: `${character.name} - ${character.nickname}`,
      },
      url: `/characters/${character.slug}`,
      type: "profile",
    };

    return SEOGenerator.generateSocialTags(config);
  }

  /**
   * Generate social media optimized description
   */
  private static generateSocialDescription(
    character: CharacterData | VillainProfile
  ): string {
    // Create engaging social description with character highlights
    const highlights = [
      character.nickname,
      character.stats.role,
      character.stats.faction,
    ]
      .filter(Boolean)
      .join(" • ");

    return `${highlights} | ${character.quote.substring(
      0,
      80
    )}... Discover more about ${character.name} in Throne of Gods.`;
  }

  /**
   * Validate character data for SEO completeness
   */
  static validateCharacterSEO(character: CharacterData | VillainProfile): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Required fields
    if (!character.name) errors.push("Character name is required");
    if (!character.slug) errors.push("Character slug is required");
    if (!character.overview) errors.push("Character overview is required");

    // Recommended fields
    if (!character.nickname) warnings.push("Character nickname is missing");
    if (!character.image) warnings.push("Character image is missing");
    if (!character.quote) warnings.push("Character quote is missing");
    if (!character.powers || character.powers.length === 0) {
      warnings.push("Character powers are missing");
    }

    // SEO optimization checks
    if (character.overview.length < 50) {
      warnings.push("Character overview is too short for optimal SEO");
    }
    if (character.overview.length > 300) {
      warnings.push(
        "Character overview might be too long for meta description"
      );
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Generate fallback metadata for missing character data
   */
  static generateFallbackMetadata(slug: string): Metadata {
    const config: SEOConfig = {
      title: `Character Profile | ${SEO_CONFIG.siteName}`,
      description: DEFAULT_FALLBACKS.characterDescription,
      image: {
        url: DEFAULT_FALLBACKS.characterImage,
        width: 1200,
        height: 630,
        alt: "Throne of Gods Character",
      },
      url: `/characters/${slug}`,
      type: "profile",
    };

    return SEOGenerator.generateMetadata(config);
  }

  /**
   * Generate mobile-specific character SEO enhancements
   */
  static generateCharacterMobileSEO(character: CharacterData | VillainProfile) {
    const mobileConfig: SEOConfig = {
      title: `${character.name} - ${character.nickname}`,
      description: this.generateCharacterDescription(character),
      image: {
        url: character.image || DEFAULT_FALLBACKS.characterImage,
        width: 1200,
        height: 630,
        alt: `${character.name}`,
      },
      url: `/characters/${character.slug}`,
      isMobileOptimized: true,
    };

    return {
      pwaMeta: MobileSEO.generateMobilePWAMeta(mobileConfig),
      socialSharing: MobileSEO.generateMobileSocialSharing(mobileConfig),
      validation: MobileSEO.validateMobileConfig(mobileConfig),
      previewUrls: MobileSEO.generateMobilePreviewUrls(
        `/characters/${character.slug}`
      ),
    };
  }
}
