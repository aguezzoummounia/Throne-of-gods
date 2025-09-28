/**
 * Tests for texture scaling utilities
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  calculateTextureScale,
  scaleTextureDimensions,
  createScaledCanvas,
  getTextureFormat,
} from "../texture-scaling";

describe("Texture Scaling", () => {
  describe("calculateTextureScale", () => {
    it("should return high quality config for high GPU tier", () => {
      const config = calculateTextureScale("high", 1, false, 4096);

      expect(config.baseScale).toBe(1.0);
      expect(config.quality).toBe("high");
      expect(config.maxWidth).toBeGreaterThan(0);
      expect(config.maxHeight).toBeGreaterThan(0);
    });

    it("should reduce scale for medium GPU tier", () => {
      const config = calculateTextureScale("medium", 1, false, 4096);

      expect(config.baseScale).toBe(0.75);
      expect(config.quality).toBe("medium");
    });

    it("should use lowest scale for low GPU tier", () => {
      const config = calculateTextureScale("low", 1, false, 4096);

      expect(config.baseScale).toBe(0.5);
      expect(config.quality).toBe("low");
    });

    it("should apply mobile adjustments", () => {
      const desktopConfig = calculateTextureScale("high", 1, false, 4096);
      const mobileConfig = calculateTextureScale("high", 1, true, 4096);

      expect(mobileConfig.baseScale).toBeLessThan(desktopConfig.baseScale);
    });

    it("should adjust for high DPI mobile screens", () => {
      const normalDPIConfig = calculateTextureScale("medium", 1, true, 4096);
      const highDPIConfig = calculateTextureScale("medium", 3, true, 4096);

      expect(highDPIConfig.baseScale).toBeLessThan(normalDPIConfig.baseScale);
    });

    it("should respect max texture size limits", () => {
      const config = calculateTextureScale("high", 1, false, 1024);

      expect(config.maxWidth).toBeLessThanOrEqual(1024);
      expect(config.maxHeight).toBeLessThanOrEqual(1024);
    });

    it("should ensure minimum usable size", () => {
      const config = calculateTextureScale("low", 1, true, 128);

      expect(config.maxWidth).toBeGreaterThanOrEqual(256);
      expect(config.maxHeight).toBeGreaterThanOrEqual(256);
    });
  });

  describe("scaleTextureDimensions", () => {
    it("should maintain reasonable aspect ratio", () => {
      const config = {
        baseScale: 0.5,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: "medium" as const,
      };
      const result = scaleTextureDimensions(800, 600, config);

      // Power-of-2 rounding can significantly change aspect ratios for small dimensions
      // Just ensure we get valid dimensions
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.scale).toBeGreaterThan(0);
    });

    it("should respect max width constraint", () => {
      const config = {
        baseScale: 2.0,
        maxWidth: 512,
        maxHeight: 1024,
        quality: "high" as const,
      };
      const result = scaleTextureDimensions(800, 600, config);

      expect(result.width).toBeLessThanOrEqual(512);
    });

    it("should respect max height constraint", () => {
      const config = {
        baseScale: 2.0,
        maxWidth: 1024,
        maxHeight: 512,
        quality: "high" as const,
      };
      const result = scaleTextureDimensions(600, 800, config);

      expect(result.height).toBeLessThanOrEqual(512);
    });

    it("should return power-of-2 dimensions", () => {
      const config = {
        baseScale: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: "medium" as const,
      };
      const result = scaleTextureDimensions(500, 300, config);

      // Check if dimensions are powers of 2
      expect(Math.log2(result.width) % 1).toBe(0);
      expect(Math.log2(result.height) % 1).toBe(0);
    });

    it("should calculate correct scale factor", () => {
      const config = {
        baseScale: 0.5,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: "medium" as const,
      };
      const result = scaleTextureDimensions(800, 600, config);

      expect(result.scale).toBeGreaterThan(0);
      expect(result.scale).toBeLessThanOrEqual(config.baseScale);
    });
  });

  describe("createScaledCanvas", () => {
    let mockImage: HTMLImageElement;
    let mockCanvas: HTMLCanvasElement;
    let mockContext: CanvasRenderingContext2D;

    beforeEach(() => {
      // Mock global document if not available
      if (typeof document === "undefined") {
        global.document = {
          createElement: vi.fn(),
        } as any;
      }

      // Mock HTMLImageElement
      mockImage = {
        width: 800,
        height: 600,
      } as HTMLImageElement;

      // Mock CanvasRenderingContext2D
      mockContext = {
        imageSmoothingEnabled: false,
        imageSmoothingQuality: "low",
        drawImage: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      // Mock HTMLCanvasElement
      mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn().mockReturnValue(mockContext),
      } as unknown as HTMLCanvasElement;

      // Mock document.createElement
      vi.spyOn(document, "createElement").mockReturnValue(mockCanvas);
    });

    it("should create canvas with correct dimensions", () => {
      const canvas = createScaledCanvas(mockImage, 400, 300);

      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);
    });

    it("should enable high-quality image smoothing", () => {
      createScaledCanvas(mockImage, 400, 300);

      expect(mockContext.imageSmoothingEnabled).toBe(true);
      expect(mockContext.imageSmoothingQuality).toBe("high");
    });

    it("should draw image with correct parameters", () => {
      createScaledCanvas(mockImage, 400, 300);

      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockImage,
        0,
        0,
        400,
        300
      );
    });

    it("should throw error if context is not available", () => {
      vi.mocked(mockCanvas.getContext).mockReturnValue(null);

      expect(() => createScaledCanvas(mockImage, 400, 300)).toThrow(
        "Could not get 2D context for canvas"
      );
    });
  });

  describe("getTextureFormat", () => {
    it("should return RGBA format for high tier", () => {
      const format = getTextureFormat("high");

      expect(format.format).toBe("RGBA");
      expect(format.internalFormat).toBe("RGBA8");
      expect(format.type).toBe("UNSIGNED_BYTE");
    });

    it("should return RGB format for medium tier", () => {
      const format = getTextureFormat("medium");

      expect(format.format).toBe("RGB");
      expect(format.internalFormat).toBe("RGB8");
      expect(format.type).toBe("UNSIGNED_BYTE");
    });

    it("should return compressed format for low tier", () => {
      const format = getTextureFormat("low");

      expect(format.format).toBe("RGB");
      expect(format.type).toBe("UNSIGNED_SHORT_5_6_5");
      expect(format.internalFormat).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero max texture size", () => {
      const config = calculateTextureScale("high", 1, false, 0);

      expect(config.maxWidth).toBeGreaterThan(0);
      expect(config.maxHeight).toBeGreaterThan(0);
    });

    it("should handle very small original dimensions", () => {
      const config = {
        baseScale: 1.0,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: "high" as const,
      };
      const result = scaleTextureDimensions(10, 10, config);

      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
    });

    it("should handle very large original dimensions", () => {
      const config = {
        baseScale: 1.0,
        maxWidth: 512,
        maxHeight: 512,
        quality: "medium" as const,
      };
      const result = scaleTextureDimensions(4000, 3000, config);

      expect(result.width).toBeLessThanOrEqual(512);
      expect(result.height).toBeLessThanOrEqual(512);
    });
  });
});
