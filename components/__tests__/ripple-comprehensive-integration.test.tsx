import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { RippleImageEnhanced } from "../ripple-image-enhanced";
import { useDeviceCapabilities } from "../../hooks/useDeviceCapabilities";
import { usePerformanceMonitor } from "../../hooks/usePerformanceMonitor";

// Mock the hooks
vi.mock("../../hooks/useDeviceCapabilities");
vi.mock("../../hooks/usePerformanceMonitor");
vi.mock("../../hooks/useResourceManager", () => ({
  useResourceManager: () => ({
    disposeTextures: vi.fn(),
    pauseRendering: vi.fn(),
    resumeRendering: vi.fn(),
    adjustQuality: vi.fn(),
    getMemoryUsage: vi.fn(() => ({ used: 30, total: 100 })),
    isMemoryPressure: vi.fn(() => false),
  }),
}));

// Mock the ripple components
vi.mock("../ripple-image", () => ({
  RippleImage: ({ src, alt, onInteraction }: any) => (
    <div
      data-testid="webgl-ripple"
      aria-label={alt}
      onClick={() => onInteraction?.()}
    >
      <img src={src} alt={alt} />
    </div>
  ),
}));

vi.mock("../ripple-image-fallback", () => ({
  RippleImageFallback: ({ src, alt, onInteraction }: any) => (
    <div
      data-testid="css-ripple"
      aria-label={alt}
      onClick={() => onInteraction?.()}
    >
      <img src={src} alt={alt} />
    </div>
  ),
}));

const mockUseDeviceCapabilities = vi.mocked(useDeviceCapabilities);
const mockUsePerformanceMonitor = vi.mocked(usePerformanceMonitor);

describe("RippleImage Integration Test Suite", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
  };

  let mockRecordInteraction: ReturnType<typeof vi.fn>;
  let mockSetQuality: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockRecordInteraction = vi.fn();
    mockSetQuality = vi.fn();

    // Default device capabilities
    mockUseDeviceCapabilities.mockReturnValue({
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
      memoryInfo: {
        totalJSHeapSize: 50000000,
        usedJSHeapSize: 30000000,
        jsHeapSizeLimit: 2147483648,
      },
    });

    // Default performance monitor
    mockUsePerformanceMonitor.mockReturnValue({
      metrics: {
        currentFPS: 60,
        averageFPS: 58,
        frameDrops: 0,
        memoryUsage: 50 * 1024 * 1024,
        lastInteraction: Date.now(),
        renderTime: 16,
        frameCount: 100,
      },
      currentQuality: "medium",
      isPerformancePoor: false,
      recordInteraction: mockRecordInteraction,
      setQuality: mockSetQuality,
      shouldSkipFrame: vi.fn(() => false),
      shouldPauseRendering: vi.fn(() => false),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Component Mode Switching", () => {
    it("should switch from WebGL to CSS when performance degrades", async () => {
      // Start with good performance
      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Simulate performance degradation
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 25, // Poor performance
          averageFPS: 28,
          frameDrops: 15,
          memoryUsage: 80 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 35,
          frameCount: 100,
        },
        currentQuality: "low",
        isPerformancePoor: true,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => true),
        shouldPauseRendering: vi.fn(() => false),
      });

      // Trigger re-render
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
      });
    });

    it("should switch from CSS to WebGL when performance improves", async () => {
      // Start with poor performance
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 25,
          averageFPS: 28,
          frameDrops: 15,
          memoryUsage: 80 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 35,
          frameCount: 100,
        },
        currentQuality: "low",
        isPerformancePoor: true,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => true),
        shouldPauseRendering: vi.fn(() => false),
      });

      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });

      // Simulate performance improvement
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 55,
          averageFPS: 52,
          frameDrops: 2,
          memoryUsage: 40 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 18,
          frameCount: 100,
        },
        currentQuality: "medium",
        isPerformancePoor: false,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => false),
        shouldPauseRendering: vi.fn(() => false),
      });

      // Trigger re-render
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("css-ripple")).not.toBeInTheDocument();
      });
    });

    it("should handle mobile device mode switching", async () => {
      // Mobile device with medium capabilities
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: true,
        hasWebGL: true,
        gpuTier: "medium",
        maxTextureSize: 2048,
        devicePixelRatio: 2,
        screenSize: { width: 414, height: 896 },
        userAgent: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          browser: "safari",
          os: "ios",
        },
        memoryInfo: {
          totalJSHeapSize: 30000000,
          usedJSHeapSize: 20000000,
          jsHeapSizeLimit: 1073741824,
        },
      });

      render(<RippleImageEnhanced {...defaultProps} />);

      // Should start with WebGL on medium-tier mobile
      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Simulate battery pressure or thermal throttling
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 20,
          averageFPS: 22,
          frameDrops: 20,
          memoryUsage: 70 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 45,
          frameCount: 100,
        },
        currentQuality: "low",
        isPerformancePoor: true,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => true),
        shouldPauseRendering: vi.fn(() => false),
      });

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });
    });
  });

  describe("Interaction Handling", () => {
    it("should record interactions in both modes", async () => {
      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Click on WebGL ripple
      fireEvent.click(screen.getByTestId("webgl-ripple"));
      expect(mockRecordInteraction).toHaveBeenCalledTimes(1);

      // Switch to CSS mode
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 25,
          averageFPS: 28,
          frameDrops: 15,
          memoryUsage: 80 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 35,
          frameCount: 100,
        },
        currentQuality: "low",
        isPerformancePoor: true,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => true),
        shouldPauseRendering: vi.fn(() => false),
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });

      // Click on CSS ripple
      fireEvent.click(screen.getByTestId("css-ripple"));
      expect(mockRecordInteraction).toHaveBeenCalledTimes(2);
    });

    it("should handle rapid mode switching gracefully", async () => {
      render(<RippleImageEnhanced {...defaultProps} />);

      // Rapidly switch between good and poor performance
      for (let i = 0; i < 5; i++) {
        const isGoodPerformance = i % 2 === 0;

        mockUsePerformanceMonitor.mockReturnValue({
          metrics: {
            currentFPS: isGoodPerformance ? 55 : 25,
            averageFPS: isGoodPerformance ? 52 : 28,
            frameDrops: isGoodPerformance ? 2 : 15,
            memoryUsage: isGoodPerformance
              ? 40 * 1024 * 1024
              : 80 * 1024 * 1024,
            lastInteraction: Date.now(),
            renderTime: isGoodPerformance ? 18 : 35,
            frameCount: 100,
          },
          currentQuality: isGoodPerformance ? "medium" : "low",
          isPerformancePoor: !isGoodPerformance,
          recordInteraction: mockRecordInteraction,
          setQuality: mockSetQuality,
          shouldSkipFrame: vi.fn(() => !isGoodPerformance),
          shouldPauseRendering: vi.fn(() => false),
        });

        act(() => {
          vi.advanceTimersByTime(500);
        });
      }

      // Should stabilize to one mode
      await waitFor(() => {
        const webglElement = screen.queryByTestId("webgl-ripple");
        const cssElement = screen.queryByTestId("css-ripple");
        expect(webglElement || cssElement).toBeInTheDocument();
        expect(!(webglElement && cssElement)).toBe(true); // Only one should be present
      });
    });
  });

  describe("Quality Level Integration", () => {
    it("should respect manual quality overrides", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="high" />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Even with poor performance, high quality should maintain WebGL
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 30,
          averageFPS: 32,
          frameDrops: 10,
          memoryUsage: 70 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 30,
          frameCount: 100,
        },
        currentQuality: "high",
        isPerformancePoor: false, // Manual override prevents poor performance detection
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => false),
        shouldPauseRendering: vi.fn(() => false),
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });
    });

    it("should handle low quality settings appropriately", async () => {
      render(<RippleImageEnhanced {...defaultProps} quality="low" />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });

      // Low quality should maintain CSS even with good performance
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 60,
          averageFPS: 58,
          frameDrops: 0,
          memoryUsage: 30 * 1024 * 1024,
          lastInteraction: Date.now(),
          renderTime: 16,
          frameCount: 100,
        },
        currentQuality: "low",
        isPerformancePoor: false,
        recordInteraction: mockRecordInteraction,
        setQuality: mockSetQuality,
        shouldSkipFrame: vi.fn(() => false),
        shouldPauseRendering: vi.fn(() => false),
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });
    });
  });

  describe("Device-Specific Behavior", () => {
    it("should handle tablet devices appropriately", async () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: false, // Tablets are not considered mobile for this component
        hasWebGL: true,
        gpuTier: "medium",
        maxTextureSize: 4096,
        devicePixelRatio: 2,
        screenSize: { width: 1024, height: 768 },
        userAgent: {
          isMobile: false,
          isTablet: true,
          isDesktop: false,
          browser: "safari",
          os: "ios",
        },
        memoryInfo: {
          totalJSHeapSize: 40000000,
          usedJSHeapSize: 25000000,
          jsHeapSizeLimit: 2147483648,
        },
      });

      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });
    });

    it("should handle low-end mobile devices", async () => {
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: true,
        hasWebGL: false,
        gpuTier: "low",
        maxTextureSize: 1024,
        devicePixelRatio: 1,
        screenSize: { width: 320, height: 568 },
        userAgent: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          browser: "chrome",
          os: "android",
        },
        memoryInfo: {
          totalJSHeapSize: 15000000,
          usedJSHeapSize: 12000000,
          jsHeapSizeLimit: 536870912,
        },
      });

      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });
    });
  });

  describe("Error Recovery", () => {
    it("should fallback to CSS when WebGL context is lost", async () => {
      render(<RippleImageEnhanced {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      });

      // Simulate WebGL context loss
      mockUseDeviceCapabilities.mockReturnValue({
        isMobile: false,
        hasWebGL: false, // WebGL lost
        gpuTier: "low",
        maxTextureSize: 0,
        devicePixelRatio: 1,
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
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
        expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
      });
    });

    it("should handle performance monitor failures gracefully", async () => {
      // Simulate performance monitor failure
      mockUsePerformanceMonitor.mockReturnValue({
        metrics: {
          currentFPS: 0,
          averageFPS: 0,
          frameDrops: 0,
          memoryUsage: 0,
          lastInteraction: 0,
          renderTime: 0,
          frameCount: 0,
        },
        currentQuality: "low",
        isPerformancePoor: true,
        recordInteraction: vi.fn(),
        setQuality: vi.fn(),
        shouldSkipFrame: vi.fn(() => false),
        shouldPauseRendering: vi.fn(() => true),
      });

      render(<RippleImageEnhanced {...defaultProps} />);

      // Should fallback to CSS mode when performance monitoring fails
      await waitFor(() => {
        expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      });
    });
  });
});
