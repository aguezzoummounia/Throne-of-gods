import { describe, it, expect } from "vitest";
import { MobileSEO } from "../mobile";
import { MobileSEOTesting } from "../mobile-testing";
import { SEOConfig } from "../types";
import { SEO_CONFIG } from "../config";

describe("MobileSEO", () => {
  const mockConfig: SEOConfig = {
    title: "Test Page Title",
    description: "Test page description for mobile optimization",
    image: {
      url: "/images/test-image.jpg",
      width: 1200,
      height: 630,
      alt: "Test image",
    },
    mobileImage: {
      url: "/images/test-mobile.jpg",
      width: 800,
      height: 600,
      alt: "Test mobile image",
    },
    socialImages: {
      facebook: {
        url: "/images/test-facebook.jpg",
        width: 1200,
        height: 630,
        alt: "Test Facebook image",
      },
      twitter: {
        url: "/images/test-twitter.jpg",
        width: 1200,
        height: 675,
        alt: "Test Twitter image",
      },
      instagram: {
        url: "/images/test-instagram.jpg",
        width: 1080,
        height: 1080,
        alt: "Test Instagram image",
      },
    },
    url: "/test-page",
    type: "article",
    isMobileOptimized: true,
  };

  describe("generateMobilePWAMeta", () => {
    it("should generate comprehensive mobile PWA meta tags", () => {
      const meta = MobileSEO.generateMobilePWAMeta(mockConfig);

      expect(meta).toHaveProperty("theme-color", SEO_CONFIG.mobile.themeColor);
      expect(meta).toHaveProperty("apple-mobile-web-app-capable", "yes");
      expect(meta).toHaveProperty("mobile-web-app-capable", "yes");
      expect(meta).toHaveProperty(
        "format-detection",
        "telephone=no, date=no, email=no, address=no"
      );
      expect(meta).toHaveProperty("apple-mobile-web-app-title");
      expect(meta["apple-mobile-web-app-title"]).toBe("Test Page Ti"); // Truncated to 12 chars
    });

    it("should handle missing title gracefully", () => {
      const configWithoutTitle = { ...mockConfig, title: undefined };
      const meta = MobileSEO.generateMobilePWAMeta(configWithoutTitle as any);

      expect(meta).toHaveProperty(
        "apple-mobile-web-app-title",
        "Throne of Gods"
      );
    });
  });

  describe("generateResponsiveImageSrcSet", () => {
    it("should generate responsive image srcset", () => {
      const result = MobileSEO.generateResponsiveImageSrcSet(
        "/images/test.jpg",
        mockConfig
      );

      expect(result.srcSet).toContain("/images/test-mobile.jpg 400w");
      expect(result.srcSet).toContain("/images/test-tablet.jpg 800w");
      expect(result.srcSet).toContain("/images/test-desktop.jpg 1200w");
      expect(result.srcSet).toContain("/images/test-large.jpg 1600w");

      expect(result.sizes).toBe(
        "(max-width: 480px) 400px, (max-width: 768px) 800px, (max-width: 1200px) 1200px, 1600px"
      );
    });

    it("should handle different image extensions", () => {
      const result = MobileSEO.generateResponsiveImageSrcSet(
        "/images/test.webp",
        mockConfig
      );
      expect(result.srcSet).toContain("/images/test-mobile.webp 400w");
    });
  });

  describe("enhanceSchemaForMobile", () => {
    it("should enhance schema with mobile-specific properties", () => {
      const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        name: "Test Article",
        description: "Test description",
      };

      const enhanced = MobileSEO.enhanceSchemaForMobile(baseSchema, mockConfig);

      expect(enhanced).toHaveProperty("applicationCategory", "Entertainment");
      expect(enhanced).toHaveProperty("operatingSystem", "Any");
      expect(enhanced).toHaveProperty("interactionStatistic");
      expect(enhanced.interactionStatistic).toHaveLength(2);
      expect(enhanced).toHaveProperty("potentialAction");
      expect(enhanced.potentialAction).toContainEqual(
        expect.objectContaining({
          "@type": "ShareAction",
          name: "Share on Mobile",
        })
      );
    });

    it("should preserve existing potentialAction", () => {
      const baseSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        name: "Test Article",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://example.com/search",
        },
      };

      const enhanced = MobileSEO.enhanceSchemaForMobile(baseSchema, mockConfig);
      expect(enhanced.potentialAction).toHaveLength(2);
    });
  });

  describe("generateMobileSocialSharing", () => {
    it("should generate platform-specific mobile sharing metadata", () => {
      const sharing = MobileSEO.generateMobileSocialSharing(mockConfig);

      expect(sharing).toHaveProperty("whatsapp");
      expect(sharing).toHaveProperty("telegram");
      expect(sharing).toHaveProperty("twitterMobile");
      expect(sharing).toHaveProperty("facebookMobile");

      expect(sharing.whatsapp["og:image"]).toBe(mockConfig.mobileImage!.url);
      expect(sharing.twitterMobile["twitter:image"]).toBe(
        mockConfig.socialImages!.twitter!.url
      );
      expect(sharing.facebookMobile["og:image"]).toBe(
        mockConfig.socialImages!.facebook!.url
      );
    });

    it("should fallback to mobile image when platform-specific images are missing", () => {
      const configWithoutSocialImages = {
        ...mockConfig,
        socialImages: undefined,
      };

      const sharing = MobileSEO.generateMobileSocialSharing(
        configWithoutSocialImages
      );

      expect(sharing.twitterMobile["twitter:image"]).toBe(
        mockConfig.mobileImage!.url
      );
      expect(sharing.facebookMobile["og:image"]).toBe(
        mockConfig.mobileImage!.url
      );
    });
  });

  describe("validateMobileConfig", () => {
    it("should validate optimal mobile configuration", () => {
      const result = MobileSEO.validateMobileConfig(mockConfig);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should warn about missing mobile image", () => {
      const configWithoutMobileImage = {
        ...mockConfig,
        mobileImage: undefined,
      };

      const result = MobileSEO.validateMobileConfig(configWithoutMobileImage);
      expect(result.warnings).toContain("No mobile-optimized image provided");
    });

    it("should warn about long title", () => {
      const configWithLongTitle = {
        ...mockConfig,
        title:
          "This is a very long title that exceeds the recommended length for mobile displays and should trigger a warning",
      };

      const result = MobileSEO.validateMobileConfig(configWithLongTitle);
      expect(result.warnings).toContain(
        "Title may be too long for mobile displays (>60 characters)"
      );
    });

    it("should warn about long description", () => {
      const configWithLongDescription = {
        ...mockConfig,
        description:
          "This is a very long description that exceeds the recommended length for mobile previews and should trigger a warning message",
      };

      const result = MobileSEO.validateMobileConfig(configWithLongDescription);
      expect(result.warnings).toContain(
        "Description may be too long for mobile previews (>120 characters)"
      );
    });
  });

  describe("generateMobilePreviewUrls", () => {
    it("should generate preview testing URLs for different platforms", () => {
      const urls = MobileSEO.generateMobilePreviewUrls("/test-page");

      expect(urls).toHaveProperty("facebook");
      expect(urls).toHaveProperty("twitter");
      expect(urls).toHaveProperty("linkedin");
      expect(urls).toHaveProperty("whatsapp");
      expect(urls).toHaveProperty("telegram");

      expect(urls.facebook).toContain("developers.facebook.com");
      expect(urls.twitter).toContain("cards-dev.twitter.com");
      expect(urls.linkedin).toContain("linkedin.com/post-inspector");
    });

    it("should handle full URLs", () => {
      const urls = MobileSEO.generateMobilePreviewUrls(
        "https://example.com/test"
      );
      expect(urls.facebook).toContain("https%3A%2F%2Fexample.com%2Ftest");
    });
  });
});

describe("MobileSEOTesting", () => {
  const mockConfig: SEOConfig = {
    title: "Test Page",
    description: "Test description",
    mobileImage: {
      url: "/images/mobile.jpg",
      width: 800,
      height: 600,
      alt: "Mobile image",
    },
    socialImages: {
      facebook: {
        url: "/images/facebook.jpg",
        width: 1200,
        height: 630,
        alt: "Facebook image",
      },
      twitter: {
        url: "/images/twitter.jpg",
        width: 1200,
        height: 675,
        alt: "Twitter image",
      },
      instagram: {
        url: "/images/instagram.jpg",
        width: 1080,
        height: 1080,
        alt: "Instagram image",
      },
    },
    isMobileOptimized: true,
  };

  describe("testMobileViewport", () => {
    it("should validate optimal viewport configuration", () => {
      const configWithViewport = {
        ...mockConfig,
        mobileViewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
      };

      const result = MobileSEOTesting.testMobileViewport(configWithViewport);
      expect(result.isOptimal).toBe(true);
      expect(result.recommendations).toHaveLength(0);
    });

    it("should recommend missing viewport properties", () => {
      const configWithBadViewport = {
        ...mockConfig,
        mobileViewport: "width=320",
      };

      const result = MobileSEOTesting.testMobileViewport(configWithBadViewport);
      expect(result.isOptimal).toBe(false);
      expect(result.recommendations).toContain(
        "Add 'initial-scale=1' for proper mobile scaling"
      );
    });
  });

  describe("testSocialImageOptimization", () => {
    it("should test social media image optimization", () => {
      const result = MobileSEOTesting.testSocialImageOptimization(mockConfig);

      expect(result.platforms).toHaveProperty("facebook");
      expect(result.platforms).toHaveProperty("twitter");
      expect(result.platforms).toHaveProperty("whatsapp");
      expect(result.platforms).toHaveProperty("instagram");

      expect(result.platforms.facebook.isOptimal).toBe(true);
      expect(result.platforms.twitter.isOptimal).toBe(true);
      expect(result.platforms.instagram.isOptimal).toBe(true);
      expect(result.overallScore).toBe(100);
    });

    it("should identify image optimization issues", () => {
      const configWithBadImages = {
        ...mockConfig,
        socialImages: {
          facebook: {
            url: "/images/facebook.jpg",
            width: 800, // Wrong size
            height: 400, // Wrong size
            alt: "Facebook image",
          },
        },
        mobileImage: {
          url: "/images/mobile.jpg",
          width: 200, // Too small
          height: 150,
          alt: "Mobile image",
        },
      };

      const result =
        MobileSEOTesting.testSocialImageOptimization(configWithBadImages);
      expect(result.platforms.facebook.isOptimal).toBe(false);
      expect(result.platforms.whatsapp.isOptimal).toBe(false);
      expect(result.overallScore).toBeLessThan(100);
    });
  });

  describe("testMobileSharingPreviews", () => {
    it("should generate mobile sharing previews", async () => {
      const result = await MobileSEOTesting.testMobileSharingPreviews(
        "/test",
        mockConfig
      );

      expect(result.previews).toHaveProperty("whatsapp");
      expect(result.previews).toHaveProperty("twitter");
      expect(result.previews).toHaveProperty("facebook");

      expect(result.previews.whatsapp.status).toBe("success");
      expect(result.previews.whatsapp.preview).toHaveProperty("title");
      expect(result.previews.whatsapp.preview).toHaveProperty("description");
      expect(result.previews.whatsapp.preview).toHaveProperty("image");
    });

    it("should provide recommendations for long content", async () => {
      const configWithLongContent = {
        ...mockConfig,
        title:
          "This is a very long title that will be truncated in mobile previews",
        description:
          "This is a very long description that will be truncated in mobile sharing previews and should generate recommendations",
      };

      const result = await MobileSEOTesting.testMobileSharingPreviews(
        "/test",
        configWithLongContent
      );
      expect(result.recommendations).toContain(
        "Title may be truncated in WhatsApp previews (>65 chars)"
      );
      expect(result.recommendations).toContain(
        "Description may be truncated in mobile previews (>100 chars)"
      );
    });
  });

  describe("generateMobileSEOReport", () => {
    it("should generate comprehensive mobile SEO report", () => {
      const report = MobileSEOTesting.generateMobileSEOReport(
        mockConfig,
        "/test"
      );

      expect(report).toHaveProperty("score");
      expect(report).toHaveProperty("sections");
      expect(report).toHaveProperty("recommendations");
      expect(report).toHaveProperty("criticalIssues");

      expect(report.sections).toHaveProperty("viewport");
      expect(report.sections).toHaveProperty("images");
      expect(report.sections).toHaveProperty("sharing");
      expect(report.sections).toHaveProperty("performance");

      expect(report.score).toBeGreaterThan(80); // Should be high for optimal config
      expect(report.criticalIssues).toHaveLength(0);
    });

    it("should identify critical issues", () => {
      const configWithIssues = {
        ...mockConfig,
        mobileImage: undefined,
      };

      const report = MobileSEOTesting.generateMobileSEOReport(configWithIssues);
      expect(report.criticalIssues).toContain(
        "Missing mobile-optimized images"
      );
      expect(report.score).toBeLessThan(95);
    });
  });

  describe("generatePreviewTestingScript", () => {
    it("should generate testing script for multiple URLs", () => {
      const urls = ["/page1", "/page2", "https://example.com/page3"];
      const script = MobileSEOTesting.generatePreviewTestingScript(urls);

      expect(script).toContain("Mobile SEO Preview Testing Script");
      expect(script).toContain("facebook:");
      expect(script).toContain("twitter:");
      expect(script).toContain("linkedin:");
      expect(script).toContain("developers.facebook.com");
      expect(script).toContain("cards-dev.twitter.com");
    });
  });
});
