import { Metadata, Viewport } from "next";
import { SEOGenerator } from "./generator";
import { SchemaBuilder } from "./schema-builder";
import { MobileSEO } from "./mobile";
import { SEOConfig, JSONLDSchema } from "./types";
import { SEO_CONFIG } from "./config";

const homepageConfig: SEOConfig = {
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.defaultDescription,
  keywords: [...SEO_CONFIG.defaultKeywords],
  image: SEO_CONFIG.defaultImage,
  mobileImage: SEO_CONFIG.mobileImage,
  socialImages: SEO_CONFIG.socialImages,
  url: "/",
  type: "website",
  author: SEO_CONFIG.author,
  siteName: SEO_CONFIG.siteName,
  isMobileOptimized: true,
};

/**
 * Generate comprehensive homepage metadata with mobile SEO optimization
 */
export function generateHomepageMetadata(): Metadata {
  return SEOGenerator.generateMetadata(homepageConfig);
}

/**
 * Generate homepage viewport configuration
 */
export function generateHomepageViewport(): Viewport {
  return SEOGenerator.generateViewport(homepageConfig);
}

/**
 * Generate homepage JSON-LD schemas including Website, Organization, and Breadcrumb
 */
export function generateHomepageSchemas(): JSONLDSchema[] {
  const schemas: JSONLDSchema[] = [];

  // Website schema with search functionality and navigation
  const websiteSchema = SchemaBuilder.createWebsiteSchema();
  schemas.push(websiteSchema);

  // Organization schema for branding
  const organizationSchema = SchemaBuilder.createOrganizationSchema();
  schemas.push(organizationSchema);

  // Breadcrumb schema for homepage navigation
  const breadcrumbSchema = SchemaBuilder.createHomepageBreadcrumbSchema();
  schemas.push(breadcrumbSchema);

  // Enhanced website schema with additional homepage-specific data
  const enhancedWebsiteSchema: JSONLDSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: `${SEO_CONFIG.siteUrl}/quiz?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "Action",
        name: "Take Quiz",
        description: "Discover your villain match",
        target: `${SEO_CONFIG.siteUrl}/quiz`,
      },
    ],
    mainEntity: {
      "@type": "Quiz",
      name: "Throne of Gods Villain Personality Quiz",
      description:
        "Discover which powerful villain from the Throne of Gods universe matches your personality and dark ambitions",
      url: `${SEO_CONFIG.siteUrl}/quiz`,
      numberOfQuestions: 10,
      timeRequired: "PT5M",
      about: "Fantasy character personality assessment",
      isAccessibleForFree: true,
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
      {
        "@type": "WebPage",
        name: "World Map",
        url: `${SEO_CONFIG.siteUrl}/#map`,
        description: "Explore the fantasy world of Erosea",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      description: "Interactive fantasy experience and character quiz platform",
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
        width: 200,
        height: 200,
      },
    },
    inLanguage: "en-US",
    copyrightYear: new Date().getFullYear(),
    genre: ["Fantasy", "Interactive Fiction", "Personality Quiz"],
    audience: {
      "@type": "Audience",
      audienceType: "Fantasy enthusiasts and quiz takers",
    },
  };

  // Enhance schema with mobile optimizations
  const mobileEnhancedSchema = MobileSEO.enhanceSchemaForMobile(
    enhancedWebsiteSchema,
    {
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
      mobileImage: SEO_CONFIG.mobileImage,
      url: "/",
      isMobileOptimized: true,
    }
  );

  schemas.push(mobileEnhancedSchema);

  return SchemaBuilder.combineSchemas(...schemas);
}

/**
 * Generate homepage social media optimization tags
 */
export function generateHomepageSocialTags() {
  const socialConfig: SEOConfig = {
    title: "Discover Your Inner Villain - Throne of Gods Quiz",
    description:
      "Which powerful villain from the fantasy world of Erosea matches your dark ambitions? Take our personality quiz and explore the Throne of Gods universe!",
    image: {
      url: `${SEO_CONFIG.siteUrl}/images/social/homepage-share.jpg`,
      width: 1200,
      height: 630,
      alt: "Throne of Gods - Fantasy Villain Personality Quiz",
    },
    url: "/",
    type: "website",
  };

  return SEOGenerator.generateSocialTags(socialConfig);
}

/**
 * Generate complete homepage SEO configuration
 */
export function generateCompleteHomepageSEO() {
  return {
    metadata: generateHomepageMetadata(),
    schemas: generateHomepageSchemas(),
    socialTags: generateHomepageSocialTags(),
  };
}

/**
 * Create JSON-LD script content for homepage
 */
export function generateHomepageJSONLDScript(): string {
  const schemas = generateHomepageSchemas();
  return JSON.stringify(schemas, null, 0);
}

/**
 * Generate mobile-specific homepage SEO enhancements
 */
export function generateHomepageMobileSEO() {
  const mobileConfig: SEOConfig = {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    mobileImage: SEO_CONFIG.mobileImage,
    socialImages: SEO_CONFIG.socialImages,
    url: "/",
    isMobileOptimized: true,
  };

  return {
    pwaMeta: MobileSEO.generateMobilePWAMeta(mobileConfig),
    socialSharing: MobileSEO.generateMobileSocialSharing(mobileConfig),
    validation: MobileSEO.validateMobileConfig(mobileConfig),
    previewUrls: MobileSEO.generateMobilePreviewUrls("/"),
  };
}
