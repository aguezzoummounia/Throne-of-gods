import { Metadata, Viewport } from "next";
import { SEOConfig, JSONLDSchema } from "./types";
import { SEO_CONFIG } from "./config";
import { SEOValidator, SEOErrorLogger } from "./validation";

export class SEOGenerator {
  /**
   * Generate Next.js Viewport object from SEO configuration
   */
  static generateViewport(config: SEOConfig): Viewport {
    return {
      width: "device-width",
      initialScale: 1,
      maximumScale: config.isMobileOptimized !== false ? 1 : 5,
      userScalable: config.isMobileOptimized !== false ? false : true,
      themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: SEO_CONFIG.themeColor },
      ],
      colorScheme: "dark light",
    };
  }

  /**
   * Generate Next.js Metadata object from SEO configuration with validation
   */
  static generateMetadata(config: SEOConfig): Metadata {
    // First validate the original config to log issues
    const originalValidation = SEOValidator.validateSEOConfig(config);

    // Generate fallback config
    const validatedConfig = SEOValidator.generateFallbackSEOConfig(config);

    // Log validation issues from original config
    if (!originalValidation.isValid) {
      SEOErrorLogger.logError("SEO metadata validation failed", {
        errors: originalValidation.errors,
        warnings: originalValidation.warnings,
        originalConfig: config,
      });
    } else if (originalValidation.warnings.length > 0) {
      SEOErrorLogger.logWarning("SEO metadata has warnings", {
        warnings: originalValidation.warnings,
        score: originalValidation.score,
      });
    }

    const title = validatedConfig.title;
    const description = validatedConfig.description;
    const image = validatedConfig.image || SEO_CONFIG.defaultImage;
    const url = validatedConfig.url
      ? `${SEO_CONFIG.siteUrl}${validatedConfig.url}`
      : SEO_CONFIG.siteUrl;

    // Generate responsive social media images with validation
    const socialImages = this.generateResponsiveSocialImages(validatedConfig);

    return {
      title,
      description,
      keywords: validatedConfig.keywords || [...SEO_CONFIG.defaultKeywords],
      authors: [{ name: validatedConfig.author || SEO_CONFIG.author }],
      creator: validatedConfig.author || SEO_CONFIG.author,
      publisher: SEO_CONFIG.siteName,

      // Open Graph with responsive images
      openGraph: {
        title,
        description,
        url,
        siteName: SEO_CONFIG.siteName,
        images: socialImages.openGraph,
        locale: SEO_CONFIG.locale,
        type: validatedConfig.type || "website",
        publishedTime: validatedConfig.publishedTime,
        modifiedTime: validatedConfig.modifiedTime,
      },

      // Twitter with optimized images
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: socialImages.twitter,
        creator: SEO_CONFIG.twitterHandle,
        site: SEO_CONFIG.twitterHandle,
      },

      // Mobile-specific meta tags
      appleWebApp: {
        capable: true,
        title: title.replace(/\s+/g, "").substring(0, 12), // iOS home screen title limit
        statusBarStyle: SEO_CONFIG.mobile.statusBarStyle as
          | "default"
          | "black"
          | "black-translucent",
      },

      // App icons for mobile
      icons: {
        icon: [
          { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
          { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
          {
            url: SEO_CONFIG.mobile.touchIcon,
            sizes: "180x180",
            type: "image/png",
          },
        ],
        other: [
          {
            rel: "mask-icon",
            url: SEO_CONFIG.mobile.maskIcon,
            color: SEO_CONFIG.mobile.maskIconColor,
          },
        ],
      },

      // Canonical URL
      alternates: {
        canonical: url,
      },

      // Enhanced robots with mobile considerations
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      // Additional mobile optimization meta tags
      other: {
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style":
          SEO_CONFIG.mobile.statusBarStyle,
        "format-detection": "telephone=no",
        "msapplication-TileColor": SEO_CONFIG.mobile.backgroundColor,
        "msapplication-config": "/browserconfig.xml",
      },
    };
  }

  /**
   * Generate social media specific tags
   */
  static generateSocialTags(config: SEOConfig) {
    const image = config.image || SEO_CONFIG.defaultImage;

    return {
      // Facebook specific
      "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,

      // Twitter specific
      "twitter:card": "summary_large_image",
      "twitter:site": SEO_CONFIG.twitterHandle,
      "twitter:creator": SEO_CONFIG.twitterHandle,
      "twitter:title": config.title,
      "twitter:description": config.description,
      "twitter:image": image.url,
      "twitter:image:alt": image.alt,

      // Additional Open Graph
      "og:image:width": image.width?.toString() || "1200",
      "og:image:height": image.height?.toString() || "630",
      "og:image:type": "image/jpeg",
    };
  }

  /**
   * Validate and sanitize SEO configuration
   */
  static validateConfig(config: Partial<SEOConfig>): SEOConfig {
    return {
      title: this.sanitizeText(config.title || SEO_CONFIG.defaultTitle),
      description: this.sanitizeText(
        config.description || SEO_CONFIG.defaultDescription
      ),
      keywords: config.keywords || [...SEO_CONFIG.defaultKeywords],
      image: config.image || SEO_CONFIG.defaultImage,
      url: config.url,
      type: config.type || "website",
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      author: config.author || SEO_CONFIG.author,
      siteName: config.siteName || SEO_CONFIG.siteName,
    };
  }

  /**
   * Sanitize text content for SEO
   */
  private static sanitizeText(text: string): string {
    return text
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
      .substring(0, 160); // Limit length for meta descriptions
  }

  /**
   * Generate JSON-LD script tag content with validation
   */
  static generateJSONLDScript(schema: JSONLDSchema): string {
    const validation = SEOValidator.validateJSONLDSchema(schema);

    if (!validation.isValid) {
      SEOErrorLogger.logError("JSON-LD schema validation failed", {
        errors: validation.errors,
        warnings: validation.warnings,
        schema: schema["@type"],
      });

      // Return minimal valid schema as fallback
      return JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": schema["@type"] || "Thing",
          name: "Throne of Gods",
          description: "Fantasy character quiz and profiles",
        },
        null,
        0
      );
    }

    if (validation.warnings.length > 0) {
      SEOErrorLogger.logWarning("JSON-LD schema has warnings", {
        warnings: validation.warnings,
        score: validation.score,
        schema: schema["@type"],
      });
    }

    return JSON.stringify(schema, null, 0);
  }

  /**
   * Create breadcrumb data for pages
   */
  static createBreadcrumbs(
    items: Array<{ name: string; url?: string }>
  ): JSONLDSchema {
    return {
      "@context": "https://schema.org",
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
   * Generate responsive social media images for different platforms with validation
   */
  private static generateResponsiveSocialImages(config: SEOConfig) {
    // Validate and get fallback images if needed
    const defaultImageValidation = SEOValidator.validateImageURL(
      config.image?.url || ""
    );
    const defaultImage = defaultImageValidation.fallbackUsed
      ? { ...SEO_CONFIG.defaultImage, url: defaultImageValidation.url }
      : config.image || SEO_CONFIG.defaultImage;

    const mobileImageValidation = SEOValidator.validateImageURL(
      config.mobileImage?.url || ""
    );
    const mobileImage = mobileImageValidation.fallbackUsed
      ? { ...SEO_CONFIG.mobileImage, url: mobileImageValidation.url }
      : config.mobileImage || SEO_CONFIG.mobileImage;

    const socialImages = config.socialImages || SEO_CONFIG.socialImages;

    // Log image validation issues
    if (defaultImageValidation.fallbackUsed) {
      SEOErrorLogger.logWarning(
        "Default image validation failed, using fallback",
        {
          originalUrl: config.image?.url,
          fallbackUrl: defaultImageValidation.url,
          error: defaultImageValidation.error,
        }
      );
    }

    if (mobileImageValidation.fallbackUsed) {
      SEOErrorLogger.logWarning(
        "Mobile image validation failed, using fallback",
        {
          originalUrl: config.mobileImage?.url,
          fallbackUrl: mobileImageValidation.url,
          error: mobileImageValidation.error,
        }
      );
    }

    return {
      openGraph: [
        // Desktop/default image
        {
          url: socialImages.facebook?.url || defaultImage.url,
          width: socialImages.facebook?.width || defaultImage.width || 1200,
          height: socialImages.facebook?.height || defaultImage.height || 630,
          alt: socialImages.facebook?.alt || defaultImage.alt,
        },
        // Mobile-optimized image
        {
          url: mobileImage.url,
          width: mobileImage.width || 800,
          height: mobileImage.height || 600,
          alt: mobileImage.alt,
        },
      ],
      twitter: [socialImages.twitter?.url || defaultImage.url],
    };
  }

  /**
   * Generate mobile-optimized viewport configuration
   */
  private static generateMobileViewport(config: SEOConfig): string {
    if (config.mobileViewport) {
      return config.mobileViewport;
    }

    const baseViewport = "width=device-width, initial-scale=1";
    const mobileOptimizations = [
      "shrink-to-fit=no",
      "user-scalable=no",
      "maximum-scale=1",
      "minimum-scale=1",
    ];

    if (config.isMobileOptimized !== false) {
      return `${baseViewport}, ${mobileOptimizations.join(", ")}`;
    }

    return baseViewport;
  }

  /**
   * Generate mobile-specific structured data enhancements
   */
  static generateMobileStructuredData(
    baseSchema: JSONLDSchema,
    config: SEOConfig
  ): JSONLDSchema {
    const mobileEnhancements = {
      ...baseSchema,
      // Add mobile app-like properties
      applicationCategory: "Entertainment",
      operatingSystem: "Any",
      // Mobile-specific interaction data
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ShareAction",
          userInteractionCount: 0,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: 0,
        },
      ],
      // Mobile sharing optimization
      potentialAction: [
        ...(baseSchema.potentialAction ? [baseSchema.potentialAction] : []),
        {
          "@type": "ShareAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SEO_CONFIG.siteUrl}${config.url || ""}`,
            actionPlatform: [
              "https://schema.org/MobileWebPlatform",
              "https://schema.org/IOSPlatform",
              "https://schema.org/AndroidPlatform",
            ],
          },
        },
      ],
    };

    return mobileEnhancements;
  }

  /**
   * Generate platform-specific social sharing metadata
   */
  static generatePlatformSpecificMeta(
    platform: "facebook" | "twitter" | "instagram" | "whatsapp",
    config: SEOConfig
  ) {
    const baseImage = config.image || SEO_CONFIG.defaultImage;
    const socialImages = config.socialImages || SEO_CONFIG.socialImages;

    switch (platform) {
      case "facebook":
        return {
          "og:image": socialImages.facebook?.url || baseImage.url,
          "og:image:width": socialImages.facebook?.width?.toString() || "1200",
          "og:image:height": socialImages.facebook?.height?.toString() || "630",
          "og:image:type": "image/jpeg",
          "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        };

      case "twitter":
        return {
          "twitter:card": "summary_large_image",
          "twitter:image": socialImages.twitter?.url || baseImage.url,
          "twitter:image:alt": socialImages.twitter?.alt || baseImage.alt,
          "twitter:site": SEO_CONFIG.twitterHandle,
          "twitter:creator": SEO_CONFIG.twitterHandle,
        };

      case "instagram":
        return {
          "og:image": socialImages.instagram?.url || baseImage.url,
          "og:image:width": socialImages.instagram?.width?.toString() || "1080",
          "og:image:height":
            socialImages.instagram?.height?.toString() || "1080",
          "og:image:type": "image/jpeg",
        };

      case "whatsapp":
        return {
          "og:image": config.mobileImage?.url || SEO_CONFIG.mobileImage.url,
          "og:image:width": config.mobileImage?.width?.toString() || "800",
          "og:image:height": config.mobileImage?.height?.toString() || "600",
          "og:type": "website",
        };

      default:
        return {};
    }
  }
}
