import { SEOConfig, JSONLDSchema } from "./types";
import { SEO_CONFIG } from "./config";

/**
 * Mobile-specific SEO optimization utilities
 */
export class MobileSEO {
  /**
   * Generate mobile-optimized meta tags for PWA-like experience
   */
  static generateMobilePWAMeta(config: SEOConfig) {
    return {
      // PWA manifest
      "theme-color": SEO_CONFIG.mobile.themeColor,
      "background-color": SEO_CONFIG.mobile.backgroundColor,

      // iOS specific
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": SEO_CONFIG.mobile.statusBarStyle,
      "apple-mobile-web-app-title":
        config.title?.substring(0, 12) || "Throne of Gods",
      "apple-touch-icon": SEO_CONFIG.mobile.touchIcon,

      // Android specific
      "mobile-web-app-capable": "yes",
      "application-name": config.siteName || SEO_CONFIG.siteName,

      // Windows specific
      "msapplication-TileColor": SEO_CONFIG.mobile.backgroundColor,
      "msapplication-TileImage": "/images/mstile-144x144.png",
      "msapplication-config": "/browserconfig.xml",

      // General mobile optimization
      "format-detection": "telephone=no, date=no, email=no, address=no",
      "viewport-fit": SEO_CONFIG.mobile.viewportFit,
      "mobile-web-app-status-bar-style": SEO_CONFIG.mobile.statusBarStyle,
    };
  }

  /**
   * Generate responsive image srcset for social sharing
   */
  static generateResponsiveImageSrcSet(
    baseImageUrl: string,
    config: SEOConfig
  ) {
    const sizes = [
      { width: 400, suffix: "-mobile" },
      { width: 800, suffix: "-tablet" },
      { width: 1200, suffix: "-desktop" },
      { width: 1600, suffix: "-large" },
    ];

    const srcSet = sizes
      .map(({ width, suffix }) => {
        const imageUrl = baseImageUrl.replace(
          /\.(jpg|jpeg|png|webp)$/i,
          `${suffix}.$1`
        );
        return `${imageUrl} ${width}w`;
      })
      .join(", ");

    return {
      srcSet,
      sizes:
        "(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1200px) 1200px, 1600px",
    };
  }

  /**
   * Generate mobile-specific structured data for better mobile search results
   */
  static enhanceSchemaForMobile(
    schema: JSONLDSchema,
    config: SEOConfig
  ): JSONLDSchema {
    const mobileEnhancements = {
      ...schema,

      // Mobile app-like properties
      applicationCategory: "Entertainment",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Requires HTML5.",

      // Mobile interaction data
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ShareAction",
          userInteractionCount: 0,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ViewAction",
          userInteractionCount: 0,
        },
      ],

      // Mobile-optimized images
      image: {
        "@type": "ImageObject",
        url:
          config.mobileImage?.url ||
          config.image?.url ||
          SEO_CONFIG.mobileImage.url,
        width: config.mobileImage?.width || 800,
        height: config.mobileImage?.height || 600,
        caption:
          config.mobileImage?.alt ||
          config.image?.alt ||
          SEO_CONFIG.mobileImage.alt,
      },

      // Mobile sharing actions
      potentialAction: [
        ...(schema.potentialAction ? [schema.potentialAction] : []),
        {
          "@type": "ShareAction",
          name: "Share on Mobile",
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
   * Generate mobile-specific social sharing optimization
   */
  static generateMobileSocialSharing(config: SEOConfig) {
    const mobileImage = config.mobileImage || SEO_CONFIG.mobileImage;

    return {
      // WhatsApp optimization
      whatsapp: {
        "og:image": mobileImage.url,
        "og:image:width": mobileImage.width?.toString() || "800",
        "og:image:height": mobileImage.height?.toString() || "600",
        "og:title": config.title,
        "og:description": config.description,
        "og:type": "website",
      },

      // Telegram optimization
      telegram: {
        "og:image": mobileImage.url,
        "og:title": config.title,
        "og:description": config.description,
      },

      // Mobile Twitter optimization
      twitterMobile: {
        "twitter:card": "summary_large_image",
        "twitter:image": config.socialImages?.twitter?.url || mobileImage.url,
        "twitter:image:alt":
          config.socialImages?.twitter?.alt || mobileImage.alt,
        "twitter:title": config.title,
        "twitter:description": config.description,
        "twitter:site": SEO_CONFIG.twitterHandle,
        "twitter:creator": SEO_CONFIG.twitterHandle,
        "twitter:app:name:iphone": config.siteName || SEO_CONFIG.siteName,
        "twitter:app:name:ipad": config.siteName || SEO_CONFIG.siteName,
        "twitter:app:name:googleplay": config.siteName || SEO_CONFIG.siteName,
      },

      // Facebook mobile optimization
      facebookMobile: {
        "og:image": config.socialImages?.facebook?.url || mobileImage.url,
        "og:image:width":
          config.socialImages?.facebook?.width?.toString() || "1200",
        "og:image:height":
          config.socialImages?.facebook?.height?.toString() || "630",
        "og:title": config.title,
        "og:description": config.description,
        "og:type": config.type || "website",
        "og:site_name": config.siteName || SEO_CONFIG.siteName,
        "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      },
    };
  }

  /**
   * Validate mobile SEO configuration
   */
  static validateMobileConfig(config: SEOConfig): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check mobile image requirements
    if (!config.mobileImage) {
      warnings.push("No mobile-optimized image provided");
    }

    // Check title length for mobile
    if (config.title && config.title.length > 60) {
      warnings.push(
        "Title may be too long for mobile displays (>60 characters)"
      );
    }

    // Check description length for mobile
    if (config.description && config.description.length > 120) {
      warnings.push(
        "Description may be too long for mobile previews (>120 characters)"
      );
    }

    // Check image dimensions for mobile sharing
    const mobileImage = config.mobileImage || SEO_CONFIG.mobileImage;
    if (mobileImage.width && mobileImage.width < 400) {
      warnings.push(
        "Mobile image width should be at least 400px for optimal sharing"
      );
    }

    // Check for required mobile meta tags
    if (!config.isMobileOptimized) {
      warnings.push("Mobile optimization is disabled");
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Generate mobile preview testing URLs
   */
  static generateMobilePreviewUrls(url: string) {
    const fullUrl = url.startsWith("http")
      ? url
      : `${SEO_CONFIG.siteUrl}${url}`;

    return {
      facebook: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
        fullUrl
      )}`,
      twitter: `https://cards-dev.twitter.com/validator?url=${encodeURIComponent(
        fullUrl
      )}`,
      linkedin: `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(
        fullUrl
      )}`,
      whatsapp: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
        fullUrl
      )}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}`,
    };
  }
}
