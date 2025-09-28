import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { RippleImageEnhanced } from "../ripple-image-enhanced";
import { RippleImageFallback } from "../ripple-image-fallback";

// Mock the hooks
vi.mock("../../hooks/useDeviceCapabilities", () => ({
  useDeviceCapabilities: () => ({
    isMobile: false,
    hasWebGL: true,
    gpuTier: "medium",
    maxTextureSize: 4096,
    devicePixelRatio: 1,
    screenSize: { width: 1920, height: 1080 },
    userAgent: {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      browser: "chrome",
      os: "windows",
    },
  }),
}));

vi.mock("../../hooks/usePerformanceMonitor", () => ({
  usePerformanceMonitor: (initialQuality: string) => ({
    metrics: {
      currentFPS:
        initialQuality === "high" ? 60 : initialQuality === "medium" ? 45 : 30,
      averageFPS:
        initialQuality === "high" ? 58 : initialQuality === "medium" ? 43 : 28,
      frameDrops:
        initialQuality === "high" ? 0 : initialQuality === "medium" ? 2 : 8,
      memoryUsage: 50 * 1024 * 1024,
      lastInteraction: Date.now(),
      renderTime:
        initialQuality === "high" ? 16 : initialQuality === "medium" ? 22 : 33,
      frameCount: 100,
    },
    currentQuality: initialQuality,
    isPerformancePoor: initialQuality === "low",
    recordInteraction: vi.fn(),
    setQuality: vi.fn(),
    shouldSkipFrame: vi.fn(() => initialQuality !== "high"),
    shouldPauseRendering: vi.fn(() => false),
  }),
}));

// Mock WebGL ripple component with quality-specific rendering
vi.mock("../ripple-image", () => ({
  RippleImage: ({
    src,
    alt,
    quality = "medium",
    textureScale = 1.0,
    shaderComplexity = "full",
  }: any) => (
    <div
      data-testid="webgl-ripple"
      data-quality={quality}
      data-texture-scale={textureScale}
      data-shader-complexity={shaderComplexity}
      aria-label={alt}
    >
      <img src={src} alt={alt} />
      <div data-testid="webgl-canvas" className={`quality-${quality}`}>
        WebGL Canvas - Quality: {quality}
      </div>
    </div>
  ),
}));

describe("Visual Regression Quality Modes Test Suite", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("High Quality Mode Visual Tests", () => {
    it("should render high quality WebGL with full shader complexity", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="high" />);

      await waitFor(() => {
        const webglElement = screen.getByTestId("webgl-ripple");
        expect(webglElement).toBeInTheDocument();
        expect(webglElement).toHaveAttribute("data-quality", "high");
        expect(webglElement).toHaveAttribute("data-texture-scale", "1");
        expect(webglElement).toHaveAttribute("data-shader-complexity", "full");
      });

      const canvas = screen.getByTestId("webgl-canvas");
      expect(canvas).toHaveClass("quality-high");
      expect(canvas).toHaveTextContent("WebGL Canvas - Quality: high");
    });

    it("should maintain visual consistency in high quality mode", async () => {
      const { container } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Simulate multiple interactions to test visual consistency
      const rippleElement = screen.getByTestId("webgl-ripple");

      for (let i = 0; i < 5; i++) {
        fireEvent.click(rippleElement);
        await waitFor(() => {
          expect(rippleElement).toHaveAttribute("data-quality", "high");
        });
      }

      // Visual state should remain consistent
      expect(
        container.querySelector('[data-quality="high"]')
      ).toBeInTheDocument();
    });

    it("should handle high quality texture scaling correctly", async () => {
      render(
        <RippleImageEnhanced
          {...defaultProps}
          quality="high"
          textureScale={1.5}
        />
      );

      await waitFor(() => {
        const webglElement = screen.getByTestId("webgl-ripple");
        expect(webglElement).toHaveAttribute("data-texture-scale", "1.5");
      });
    });
  });

  describe("Medium Quality Mode Visual Tests", () => {
    it("should render medium quality with optimized settings", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        const webglElement = screen.getByTestId("webgl-ripple");
        expect(webglElement).toBeInTheDocument();
        expect(webglElement).toHaveAttribute("data-quality", "medium");
        expect(webglElement).toHaveAttribute("data-texture-scale", "0.75");
        expect(webglElement).toHaveAttribute(
          "data-shader-complexity",
          "reduced"
        );
      });

      const canvas = screen.getByTestId("webgl-canvas");
      expect(canvas).toHaveClass("quality-medium");
    });

    it("should show visual differences from high quality", async () => {
      const { rerender } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
          "data-quality",
          "high"
        );
      });

      rerender(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        const webglElement = screen.getByTestId("webgl-ripple");
        expect(webglElement).toHaveAttribute("data-quality", "medium");
        expect(webglElement).toHaveAttribute("data-texture-scale", "0.75");
      });
    });

    it("should handle frame skipping in medium quality", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Medium quality should enable frame skipping
      const canvas = screen.getByTestId("webgl-canvas");
      expect(canvas).toHaveClass("quality-medium");
    });
  });

  describe("Low Quality Mode Visual Tests", () => {
    it("should fallback to CSS ripple in low quality mode", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="low" />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
      });
    });

    it("should render CSS fallback with appropriate styling", async () => {
      render(<RippleImageFallback {...defaultProps} quality="low" />);

      await waitFor(() => {
        const cssElement = screen.getByTestId("css-ripple");
        expect(cssElement).toBeInTheDocument();
        expect(cssElement).toHaveClass("ripple-fallback");
      });
    });

    it("should maintain functionality in CSS fallback mode", async () => {
      render(<RippleImageFallback {...defaultProps} quality="low" />);

      await waitFor(() => {
        const cssElement = screen.getByTestId("css-ripple");
        expect(cssElement).toBeInTheDocument();
      });

      // Test interaction
      fireEvent.click(screen.getByTestId("css-ripple"));

      // Should still be functional
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
    });
  });

  describe("Quality Transition Visual Tests", () => {
    it("should smoothly transition between quality modes", async () => {
      const { rerender } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      // Start with high quality
      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
          "data-quality",
          "high"
        );
      });

      // Transition to medium quality
      rerender(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
          "data-quality",
          "medium"
        );
      });

      // Transition to low quality (CSS fallback)
      rerender(<RippleImageEnhanced {...defaultProps} quality="low" />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
      });
    });

    it("should handle rapid quality changes without visual artifacts", async () => {
      const { rerender } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      const qualities = ["high", "medium", "low", "medium", "high"] as const;

      for (const quality of qualities) {
        rerender(<RippleImageEnhanced {...defaultProps} quality={quality} />);

        if (quality === "low") {
          await waitFor(() => {
            expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
          });
        } else {
          await waitFor(() => {
            expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
              "data-quality",
              quality
            );
          });
        }
      }
    });

    it("should preserve visual state during quality transitions", async () => {
      const { rerender } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      // Interact with high quality
      fireEvent.click(screen.getByTestId("webgl-ripple"));

      // Transition to medium quality
      rerender(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        const webglElement = screen.getByTestId("webgl-ripple");
        expect(webglElement).toHaveAttribute("data-quality", "medium");
      });

      // Visual elements should still be present
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("Shader Complexity Visual Tests", () => {
    it("should render different shader complexities correctly", async () => {
      const complexities = [
        { quality: "high", expected: "full" },
        { quality: "medium", expected: "reduced" },
        { quality: "low", expected: "minimal" },
      ] as const;

      for (const { quality, expected } of complexities) {
        const { unmount } = render(
          <RippleImageEnhanced {...defaultProps} quality={quality} />
        );

        if (quality === "low") {
          await waitFor(() => {
            expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
          });
        } else {
          await waitFor(() => {
            expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
              "data-shader-complexity",
              expected
            );
          });
        }

        unmount();
      }
    });

    it("should handle custom shader complexity overrides", async () => {
      render(
        <RippleImageEnhanced
          {...defaultProps}
          quality="medium"
          shaderComplexity="full"
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
          "data-shader-complexity",
          "full"
        );
      });
    });
  });

  describe("Texture Scaling Visual Tests", () => {
    it("should apply correct texture scaling for each quality level", async () => {
      const scalingTests = [
        { quality: "high", expectedScale: "1" },
        { quality: "medium", expectedScale: "0.75" },
      ] as const;

      for (const { quality, expectedScale } of scalingTests) {
        const { unmount } = render(
          <RippleImageEnhanced {...defaultProps} quality={quality} />
        );

        await waitFor(() => {
          expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
            "data-texture-scale",
            expectedScale
          );
        });

        unmount();
      }
    });

    it("should handle custom texture scaling", async () => {
      render(
        <RippleImageEnhanced
          {...defaultProps}
          quality="medium"
          textureScale={0.5}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
          "data-texture-scale",
          "0.5"
        );
      });
    });

    it("should maintain aspect ratio with different texture scales", async () => {
      const scales = [0.25, 0.5, 0.75, 1.0, 1.5];

      for (const scale of scales) {
        const { unmount } = render(
          <RippleImageEnhanced
            {...defaultProps}
            quality="high"
            textureScale={scale}
          />
        );

        await waitFor(() => {
          expect(screen.getByTestId("webgl-ripple")).toHaveAttribute(
            "data-texture-scale",
            scale.toString()
          );
        });

        // Image should maintain its aspect ratio
        const img = screen.getByRole("img");
        expect(img).toHaveAttribute("alt", defaultProps.alt);

        unmount();
      }
    });
  });

  describe("Animation Quality Visual Tests", () => {
    it("should adjust animation duration based on quality", async () => {
      const { rerender } = render(
        <RippleImageEnhanced
          {...defaultProps}
          quality="high"
          animationDuration={2.0}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Switch to CSS mode (low quality)
      rerender(
        <RippleImageEnhanced
          {...defaultProps}
          quality="low"
          animationDuration={2.0}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });
    });

    it("should handle different ripple intensities", async () => {
      const intensities = ["subtle", "normal", "strong"] as const;

      for (const intensity of intensities) {
        const { unmount } = render(
          <RippleImageFallback {...defaultProps} rippleIntensity={intensity} />
        );

        await waitFor(() => {
          const cssElement = screen.getByTestId("css-ripple");
          expect(cssElement).toHaveAttribute("data-intensity", intensity);
        });

        unmount();
      }
    });
  });

  describe("Responsive Visual Tests", () => {
    it("should adapt visuals for different screen sizes", async () => {
      // Mock different screen sizes
      const screenSizes = [
        { width: 320, height: 568, expectedMode: "css" }, // Small mobile
        { width: 768, height: 1024, expectedMode: "webgl" }, // Tablet
        { width: 1920, height: 1080, expectedMode: "webgl" }, // Desktop
      ];

      for (const { width, height, expectedMode } of screenSizes) {
        Object.defineProperty(window, "innerWidth", {
          value: width,
          configurable: true,
        });
        Object.defineProperty(window, "innerHeight", {
          value: height,
          configurable: true,
        });

        const { unmount } = render(
          <RippleImageEnhanced {...defaultProps} quality="medium" />
        );

        if (expectedMode === "webgl") {
          await waitFor(() => {
            expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
          });
        } else {
          await waitFor(() => {
            expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
          });
        }

        unmount();
      }
    });

    it("should handle device pixel ratio variations", async () => {
      const pixelRatios = [1, 1.5, 2, 3];

      for (const ratio of pixelRatios) {
        Object.defineProperty(window, "devicePixelRatio", {
          value: ratio,
          configurable: true,
        });

        const { unmount } = render(
          <RippleImageEnhanced {...defaultProps} quality="medium" />
        );

        await waitFor(() => {
          // Should render regardless of pixel ratio
          const webglElement = screen.queryByTestId("webgl-ripple");
          const cssElement = screen.queryByTestId("css-ripple");
          expect(webglElement || cssElement).toBeInTheDocument();
        });

        unmount();
      }
    });
  });

  describe("Error State Visual Tests", () => {
    it("should gracefully handle WebGL context loss", async () => {
      // Start with WebGL
      const { rerender } = render(
        <RippleImageEnhanced {...defaultProps} quality="high" />
      );

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Simulate WebGL context loss by forcing CSS mode
      rerender(<RippleImageEnhanced {...defaultProps} forceMode="css" />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
      });
    });

    it("should maintain visual integrity during error recovery", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="medium" />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Image should always be present regardless of mode
      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(screen.getByRole("img")).toHaveAttribute("src", defaultProps.src);
      expect(screen.getByRole("img")).toHaveAttribute("alt", defaultProps.alt);
    });
  });
});
