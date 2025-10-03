import { SEOConfig } from "./types";
import { SEO_CONFIG } from "./config";
import { MobileSEO } from "./mobile";

/**
 * Mobile SEO testing and validation utilities
 */
export class MobileSEOTesting {
  /**
   * Test mobile viewport configuration
   */
  static testMobileViewport(config: SEOConfig): {
    isOptimal: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let isOptimal = true;

    // Check viewport configuration
    const viewport =
      config.mobileViewport || "width=device-width, initial-scale=1";

    if (!viewport.includes("width=device-width")) {
      recommendations.push("Add 'width=device-width' for responsive design");
      isOptimal = false;
    }

    if (!viewport.includes("initial-scale=1")) {
      recommendations.push("Add 'initial-scale=1' for proper mobile scaling");
      isOptimal = false;
    }

    if (viewport.includes("user-scalable=yes")) {
      recommendations.push(
        "Consider 'user-scalable=no' for app-like experience"
      );
    }

    return { isOptimal, recommendations };
  }

  /**
   * Test social media image optimization for mobile
   */
  static testSocialImageOptimization(config: SEOConfig): {
    platforms: Record<string, { isOptimal: boolean; issues: string[] }>;
    overallScore: number;
  } {
    const platforms = {
      facebook: { isOptimal: true, issues: [] as string[] },
      twitter: { isOptimal: true, issues: [] as string[] },
      whatsapp: { isOptimal: true, issues: [] as string[] },
      instagram: { isOptimal: true, issues: [] as string[] },
    };

    // Test Facebook optimization
    const fbImage =
      config.socialImages?.facebook || config.image || SEO_CONFIG.defaultImage;
    if (!fbImage || fbImage.width !== 1200 || fbImage.height !== 630) {
      platforms.facebook.isOptimal = false;
      platforms.facebook.issues.push("Facebook image should be 1200x630px");
    }

    // Test Twitter optimization
    const twitterImage =
      config.socialImages?.twitter || config.image || SEO_CONFIG.defaultImage;
    if (!twitterImage || (twitterImage.width && twitterImage.width < 1200)) {
      platforms.twitter.isOptimal = false;
      platforms.twitter.issues.push(
        "Twitter image should be at least 1200px wide"
      );
    }

    // Test WhatsApp/mobile optimization
    const mobileImage = config.mobileImage || SEO_CONFIG.mobileImage;
    if (!mobileImage || (mobileImage.width && mobileImage.width < 400)) {
      platforms.whatsapp.isOptimal = false;
      platforms.whatsapp.issues.push(
        "Mobile image should be at least 400px wide"
      );
    }

    // Test Instagram optimization
    const instaImage = config.socialImages?.instagram;
    if (
      !instaImage ||
      instaImage.width !== 1080 ||
      instaImage.height !== 1080
    ) {
      platforms.instagram.isOptimal = false;
      platforms.instagram.issues.push("Instagram image should be 1080x1080px");
    }

    // Calculate overall score
    const optimalCount = Object.values(platforms).filter(
      (p) => p.isOptimal
    ).length;
    const overallScore = (optimalCount / Object.keys(platforms).length) * 100;

    return { platforms, overallScore };
  }

  /**
   * Test mobile sharing preview generation
   */
  static async testMobileSharingPreviews(
    url: string,
    config: SEOConfig
  ): Promise<{
    previews: Record<string, { status: string; preview: any }>;
    recommendations: string[];
  }> {
    const fullUrl = url.startsWith("http")
      ? url
      : `${SEO_CONFIG.siteUrl}${url}`;
    const previews: Record<string, { status: string; preview: any }> = {};
    const recommendations: string[] = [];

    // Generate mock previews for different platforms
    const mobileSharing = MobileSEO.generateMobileSocialSharing(config);

    // WhatsApp preview simulation
    previews.whatsapp = {
      status: "success",
      preview: {
        title: config.title?.substring(0, 65) || "Title truncated",
        description:
          config.description?.substring(0, 100) || "Description truncated",
        image: mobileSharing.whatsapp["og:image"],
        domain: new URL(SEO_CONFIG.siteUrl).hostname,
      },
    };

    // Twitter mobile preview simulation
    previews.twitter = {
      status: "success",
      preview: {
        title: config.title?.substring(0, 70) || "Title truncated",
        description:
          config.description?.substring(0, 125) || "Description truncated",
        image: mobileSharing.twitterMobile["twitter:image"],
        card: "summary_large_image",
      },
    };

    // Facebook mobile preview simulation
    previews.facebook = {
      status: "success",
      preview: {
        title: config.title?.substring(0, 100) || "Title truncated",
        description:
          config.description?.substring(0, 300) || "Description truncated",
        image: mobileSharing.facebookMobile["og:image"],
        type: config.type || "website",
      },
    };

    // Generate recommendations based on preview analysis
    if (config.title && config.title.length > 65) {
      recommendations.push(
        "Title may be truncated in WhatsApp previews (>65 chars)"
      );
    }

    if (config.description && config.description.length > 100) {
      recommendations.push(
        "Description may be truncated in mobile previews (>100 chars)"
      );
    }

    if (!config.mobileImage) {
      recommendations.push(
        "Add mobile-optimized images for better mobile sharing"
      );
    }

    return { previews, recommendations };
  }

  /**
   * Test mobile structured data enhancement
   */
  static testMobileStructuredData(
    schema: any,
    config: SEOConfig
  ): {
    isEnhanced: boolean;
    mobileFeatures: string[];
    missingFeatures: string[];
  } {
    const mobileFeatures: string[] = [];
    const missingFeatures: string[] = [];

    // Check for mobile-specific enhancements
    if (schema.applicationCategory) {
      mobileFeatures.push("Application category defined");
    } else {
      missingFeatures.push("Application category for app-like experience");
    }

    if (schema.interactionStatistic) {
      mobileFeatures.push("Interaction statistics included");
    } else {
      missingFeatures.push("Interaction statistics for engagement tracking");
    }

    if (
      schema.potentialAction?.some(
        (action: any) => action["@type"] === "ShareAction"
      )
    ) {
      mobileFeatures.push("Mobile sharing actions defined");
    } else {
      missingFeatures.push("Mobile sharing actions");
    }

    if (
      schema.image &&
      typeof schema.image === "object" &&
      schema.image["@type"] === "ImageObject"
    ) {
      mobileFeatures.push("Structured image data");
    } else {
      missingFeatures.push("Structured image data for better mobile display");
    }

    const isEnhanced = mobileFeatures.length > missingFeatures.length;

    return { isEnhanced, mobileFeatures, missingFeatures };
  }

  /**
   * Generate comprehensive mobile SEO report
   */
  static generateMobileSEOReport(
    config: SEOConfig,
    url?: string
  ): {
    score: number;
    sections: {
      viewport: any;
      images: any;
      sharing: any;
      performance: any;
    };
    recommendations: string[];
    criticalIssues: string[];
  } {
    const recommendations: string[] = [];
    const criticalIssues: string[] = [];

    // Test viewport
    const viewportTest = this.testMobileViewport(config);

    // Test images
    const imageTest = this.testSocialImageOptimization(config);

    // Test mobile configuration
    const mobileValidation = MobileSEO.validateMobileConfig(config);

    // Performance considerations
    const performanceTest = {
      hasOptimizedImages: !!config.mobileImage,
      hasResponsiveImages: !!config.socialImages,
      hasMinimalMeta: Object.keys(config).length < 15,
      score: 0,
    };

    performanceTest.score =
      [
        performanceTest.hasOptimizedImages,
        performanceTest.hasResponsiveImages,
        performanceTest.hasMinimalMeta,
      ].filter(Boolean).length * 33.33;

    // Compile recommendations
    recommendations.push(...viewportTest.recommendations);
    recommendations.push(...mobileValidation.warnings);

    if (imageTest.overallScore < 75) {
      recommendations.push("Improve social media image optimization");
    }

    if (!config.mobileImage) {
      criticalIssues.push("Missing mobile-optimized images");
    }

    // Calculate overall score
    const scores = [
      viewportTest.isOptimal ? 100 : 50,
      imageTest.overallScore,
      performanceTest.score,
      mobileValidation.isValid ? 100 : 70,
    ];

    const score = scores.reduce((sum, s) => sum + s, 0) / scores.length;

    return {
      score: Math.round(score),
      sections: {
        viewport: viewportTest,
        images: imageTest,
        sharing: { recommendations: recommendations.slice(0, 3) },
        performance: performanceTest,
      },
      recommendations: recommendations.slice(0, 5),
      criticalIssues,
    };
  }

  /**
   * Generate mobile preview testing script
   */
  static generatePreviewTestingScript(urls: string[]): string {
    const testUrls = urls.map((url) =>
      url.startsWith("http") ? url : `${SEO_CONFIG.siteUrl}${url}`
    );

    return `
// Mobile SEO Preview Testing Script
const testUrls = ${JSON.stringify(testUrls, null, 2)};

const previewUrls = {
  facebook: (url) => \`https://developers.facebook.com/tools/debug/?q=\${encodeURIComponent(url)}\`,
  twitter: (url) => \`https://cards-dev.twitter.com/validator?url=\${encodeURIComponent(url)}\`,
  linkedin: (url) => \`https://www.linkedin.com/post-inspector/inspect/\${encodeURIComponent(url)}\`,
};

console.log("Mobile SEO Preview Testing URLs:");
testUrls.forEach(url => {
  console.log(\`\\nTesting: \${url}\`);
  Object.entries(previewUrls).forEach(([platform, generator]) => {
    console.log(\`  \${platform}: \${generator(url)}\`);
  });
});

// Mobile viewport testing
console.log("\\nMobile Viewport Test:");
console.log("Add this to your browser dev tools to simulate mobile:");
console.log("document.querySelector('meta[name=viewport]').content");
    `.trim();
  }
}
