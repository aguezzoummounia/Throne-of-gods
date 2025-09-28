import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  classifyDevice,
  getPerformanceMode,
  shouldUseReducedMotion,
} from "../device-classifier";
import type { DeviceCapabilities } from "../../hooks/useDeviceCapabilities";

describe("Device Detection Integration", () => {
  let mockCapabilities: DeviceCapabilities;

  beforeEach(() => {
    // Create mock capabilities for testing
    mockCapabilities = {
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 8192,
      devicePixelRatio: 2,
      screenSize: { width: 1920, height: 1080 },
      userAgent: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        browser: "chrome",
        os: "windows",
      },
      memoryInfo: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
    };

    // Mock window.matchMedia for reduced motion tests
    global.window = {
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    } as any;
  });

  describe("Device Classification", () => {
    it("should classify high-end desktop correctly", () => {
      const classification = classifyDevice(mockCapabilities);

      expect(classification.type).toBe("desktop");
      expect(classification.tier).toBe("high");
      expect(classification.recommendedSettings.useWebGL).toBe(true);
      expect(classification.recommendedSettings.textureScale).toBe(1.0);
      expect(classification.recommendedSettings.targetFPS).toBe(60);
      expect(classification.recommendedSettings.shaderComplexity).toBe("full");
    });

    it("should classify mobile device correctly", () => {
      mockCapabilities.isMobile = true;
      mockCapabilities.userAgent.isMobile = true;
      mockCapabilities.userAgent.isDesktop = false;
      mockCapabilities.screenSize = { width: 375, height: 812 };
      mockCapabilities.gpuTier = "medium";
      mockCapabilities.maxTextureSize = 4096;

      const classification = classifyDevice(mockCapabilities);

      expect(classification.type).toBe("mobile");
      expect(classification.tier).toBe("medium");
      expect(classification.recommendedSettings.textureScale).toBeLessThan(
        0.75
      );
      expect(classification.recommendedSettings.targetFPS).toBeLessThanOrEqual(
        45
      );
    });

    it("should handle low-end device without WebGL", () => {
      mockCapabilities.hasWebGL = false;
      mockCapabilities.gpuTier = "low";
      mockCapabilities.maxTextureSize = 0;

      const classification = classifyDevice(mockCapabilities);

      expect(classification.tier).toBe("low");
      expect(classification.recommendedSettings.useWebGL).toBe(false);
      expect(classification.recommendedSettings.shaderComplexity).toBe(
        "minimal"
      );
    });
  });

  describe("Performance Mode Selection", () => {
    it("should return correct mode for high-tier WebGL device", () => {
      const classification = classifyDevice(mockCapabilities);
      const mode = getPerformanceMode(classification);

      expect(mode).toBe("webgl-high");
    });

    it("should return CSS fallback for non-WebGL device", () => {
      mockCapabilities.hasWebGL = false;
      const classification = classifyDevice(mockCapabilities);
      const mode = getPerformanceMode(classification);

      expect(mode).toBe("css-fallback");
    });
  });

  describe("Reduced Motion Detection", () => {
    it("should respect prefers-reduced-motion setting", () => {
      // Mock matchMedia to return true for reduced motion
      global.window.matchMedia = vi
        .fn()
        .mockImplementation((query: string) => ({
          matches: query.includes("prefers-reduced-motion"),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }));

      const result = shouldUseReducedMotion(mockCapabilities);

      expect(result).toBe(true);
    });

    it("should return true for low-end mobile devices", () => {
      mockCapabilities.isMobile = true;
      mockCapabilities.userAgent.isMobile = true;
      mockCapabilities.gpuTier = "low";

      const result = shouldUseReducedMotion(mockCapabilities);

      expect(result).toBe(true);
    });

    it("should return false for high-end devices with no reduced motion preference", () => {
      const result = shouldUseReducedMotion(mockCapabilities);

      expect(result).toBe(false);
    });
  });

  describe("Settings Validation", () => {
    it("should provide valid settings for all device types", () => {
      const deviceTypes = [
        { ...mockCapabilities }, // Desktop
        {
          ...mockCapabilities,
          isMobile: true,
          userAgent: {
            ...mockCapabilities.userAgent,
            isMobile: true,
            isDesktop: false,
          },
        }, // Mobile
        {
          ...mockCapabilities,
          userAgent: {
            ...mockCapabilities.userAgent,
            isTablet: true,
            isDesktop: false,
          },
        }, // Tablet
      ];

      deviceTypes.forEach((capabilities) => {
        const classification = classifyDevice(capabilities);
        const settings = classification.recommendedSettings;

        expect(settings.textureScale).toBeGreaterThan(0);
        expect(settings.textureScale).toBeLessThanOrEqual(1);
        expect(settings.targetFPS).toBeGreaterThan(0);
        expect(settings.targetFPS).toBeLessThanOrEqual(60);
        expect(["full", "reduced", "minimal"]).toContain(
          settings.shaderComplexity
        );
        expect(typeof settings.enableFrameSkipping).toBe("boolean");
        expect(typeof settings.useWebGL).toBe("boolean");
        expect(settings.maxAnimationDuration).toBeGreaterThan(0);
      });
    });

    it("should ensure minimum texture scale", () => {
      // Create a scenario that would result in very low texture scale
      mockCapabilities.isMobile = true;
      mockCapabilities.userAgent.isMobile = true;
      mockCapabilities.gpuTier = "low";

      const classification = classifyDevice(mockCapabilities);

      expect(
        classification.recommendedSettings.textureScale
      ).toBeGreaterThanOrEqual(0.25);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing memory info", () => {
      delete mockCapabilities.memoryInfo;

      const classification = classifyDevice(mockCapabilities);

      expect(classification).toBeDefined();
      expect(classification.tier).toBeDefined();
    });

    it("should handle extreme screen sizes", () => {
      // Very small screen
      mockCapabilities.screenSize = { width: 200, height: 300 };

      const classification = classifyDevice(mockCapabilities);

      expect(classification.type).toBe("mobile");

      // Very large screen
      mockCapabilities.screenSize = { width: 3840, height: 2160 };
      mockCapabilities.userAgent.isDesktop = true;
      mockCapabilities.userAgent.isMobile = false;

      const classification2 = classifyDevice(mockCapabilities);

      expect(classification2.type).toBe("desktop");
    });

    it("should handle missing matchMedia gracefully", () => {
      // Remove matchMedia
      delete (global.window as any).matchMedia;

      const result = shouldUseReducedMotion(mockCapabilities);

      // Should still work based on device capabilities
      expect(typeof result).toBe("boolean");
    });
  });
});
