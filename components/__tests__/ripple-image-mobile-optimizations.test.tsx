import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { RippleImageEnhanced } from "../ripple-image-enhanced";

// Mock the hooks and dependencies
vi.mock("../hooks/useDeviceCapabilities", () => ({
  useDeviceCapabilities: vi.fn(() => ({
    isMobile: true,
    hasWebGL: true,
    gpuTier: "medium",
    maxTextureSize: 4096,
    devicePixelRatio: 2,
    screenSize: { width: 375, height: 667 },
    userAgent: {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      browser: "chrome",
      os: "ios",
    },
    memoryInfo: {
      totalJSHeapSize: 50000000,
      usedJSHeapSize: 30000000,
      jsHeapSizeLimit: 100000000,
    },
  })),
}));

vi.mock("../hooks/usePerformanceMonitor", () => ({
  usePerformanceMonitor: vi.fn(() => ({
    currentQuality: "medium",
    isPerformancePoor: false,
    recordInteraction: vi.fn(),
  })),
}));

vi.mock("../hooks/useMobileOptimizations", () => ({
  useMobileOptimizations: vi.fn(() => [
    {
      batteryInfo: {
        charging: false,
        level: 0.8,
        chargingTime: Infinity,
        dischargingTime: 7200,
      },
      visibilityState: {
        isVisible: true,
        intersectionRatio: 1,
        isInViewport: true,
      },
      isLowBattery: false,
      shouldPauseRendering: false,
      recommendedQuality: null,
      optimizationReasons: [],
      isSlowConnection: false,
      hapticSupported: true,
    },
    {
      triggerHapticFeedback: vi.fn(),
      preloadImages: vi.fn(),
      loadImage: vi.fn(() => Promise.resolve(new Image())),
      getNetworkInfo: vi.fn(() => null),
      setupElementMonitoring: vi.fn(() => vi.fn()),
    },
  ]),
}));

// Mock the ripple components
vi.mock("../ripple-image", () => ({
  RippleImage: React.forwardRef<any, any>((props, ref) => (
    <div data-testid="webgl-ripple" ref={ref} {...props}>
      WebGL Ripple
    </div>
  )),
}));

vi.mock("../ripple-image-fallback", () => ({
  RippleImageFallback: (props: any) => (
    <div data-testid="css-ripple" {...props}>
      CSS Ripple
    </div>
  ),
}));

describe("RippleImageEnhanced - Mobile Optimizations", () => {
  const defaultProps = {
    src: "test-image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render with mobile optimization attributes", () => {
    render(<RippleImageEnhanced {...defaultProps} />);

    const container = screen.getByTestId("webgl-ripple").parentElement;
    expect(container).toHaveAttribute("data-mobile-optimized", "true");
    expect(container).toHaveAttribute("data-battery-low", "false");
    expect(container).toHaveAttribute("data-visibility-paused", "false");
  });

  test("should setup mobile optimizations on mount", async () => {
    const { useMobileOptimizations } = await import(
      "../hooks/useMobileOptimizations"
    );
    const mockSetupElementMonitoring = vi.fn(() => vi.fn());

    (useMobileOptimizations as any).mockReturnValue([
      {
        batteryInfo: null,
        visibilityState: {
          isVisible: true,
          intersectionRatio: 1,
          isInViewport: true,
        },
        isLowBattery: false,
        shouldPauseRendering: false,
        recommendedQuality: null,
        optimizationReasons: [],
        isSlowConnection: false,
        hapticSupported: true,
      },
      {
        triggerHapticFeedback: vi.fn(),
        preloadImages: vi.fn(),
        loadImage: vi.fn(),
        getNetworkInfo: vi.fn(),
        setupElementMonitoring: mockSetupElementMonitoring,
      },
    ]);

    render(<RippleImageEnhanced {...defaultProps} />);

    expect(mockSetupElementMonitoring).toHaveBeenCalled();
  });

  test("should preload images on mobile devices", async () => {
    const { useMobileOptimizations } = await import(
      "../hooks/useMobileOptimizations"
    );
    const mockPreloadImages = vi.fn();

    (useMobileOptimizations as any).mockReturnValue([
      {
        batteryInfo: null,
        visibilityState: {
          isVisible: true,
          intersectionRatio: 1,
          isInViewport: true,
        },
        isLowBattery: false,
        shouldPauseRendering: false,
        recommendedQuality: null,
        optimizationReasons: [],
        isSlowConnection: false,
        hapticSupported: true,
      },
      {
        triggerHapticFeedback: vi.fn(),
        preloadImages: mockPreloadImages,
        loadImage: vi.fn(),
        getNetworkInfo: vi.fn(),
        setupElementMonitoring: vi.fn(() => vi.fn()),
      },
    ]);

    render(<RippleImageEnhanced {...defaultProps} />);

    expect(mockPreloadImages).toHaveBeenCalledWith([
      {
        src: "test-image.jpg",
        priority: "high",
      },
    ]);
  });

  test("should fallback to CSS mode when battery is low", async () => {
    const { useMobileOptimizations } = await import(
      "../hooks/useMobileOptimizations"
    );

    (useMobileOptimizations as any).mockReturnValue([
      {
        batteryInfo: {
          charging: false,
          level: 0.15,
          chargingTime: Infinity,
          dischargingTime: 1800,
        },
        visibilityState: {
          isVisible: true,
          intersectionRatio: 1,
          isInViewport: true,
        },
        isLowBattery: true,
        shouldPauseRendering: false,
        recommendedQuality: "low",
        optimizationReasons: ["Low battery level"],
        isSlowConnection: false,
        hapticSupported: true,
      },
      {
        triggerHapticFeedback: vi.fn(),
        preloadImages: vi.fn(),
        loadImage: vi.fn(),
        getNetworkInfo: vi.fn(),
        setupElementMonitoring: vi.fn(() => vi.fn()),
      },
    ]);

    render(<RippleImageEnhanced {...defaultProps} />);

    const container = screen.getByTestId("css-ripple").parentElement;
    expect(container).toHaveAttribute("data-battery-low", "true");
    expect(container).toHaveAttribute("data-render-mode", "css");
  });

  test("should pause rendering when element is not visible", async () => {
    const { useMobileOptimizations } = await import(
      "../hooks/useMobileOptimizations"
    );

    (useMobileOptimizations as any).mockReturnValue([
      {
        batteryInfo: null,
        visibilityState: {
          isVisible: false,
          intersectionRatio: 0,
          isInViewport: false,
        },
        isLowBattery: false,
        shouldPauseRendering: true,
        recommendedQuality: null,
        optimizationReasons: ["Element not visible"],
        isSlowConnection: false,
        hapticSupported: true,
      },
      {
        triggerHapticFeedback: vi.fn(),
        preloadImages: vi.fn(),
        loadImage: vi.fn(),
        getNetworkInfo: vi.fn(),
        setupElementMonitoring: vi.fn(() => vi.fn()),
      },
    ]);

    render(<RippleImageEnhanced {...defaultProps} />);

    const container = screen.getByTestId("css-ripple").parentElement;
    expect(container).toHaveAttribute("data-visibility-paused", "true");
    expect(container).toHaveAttribute("data-render-mode", "css");
  });

  test("should handle desktop devices without mobile optimizations", async () => {
    const { useDeviceCapabilities } = await import(
      "../hooks/useDeviceCapabilities"
    );

    (useDeviceCapabilities as any).mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 8192,
      devicePixelRatio: 1,
      screenSize: { width: 1920, height: 1080 },
      userAgent: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        browser: "chrome",
        os: "windows",
      },
    });

    const { useMobileOptimizations } = await import(
      "../hooks/useMobileOptimizations"
    );

    (useMobileOptimizations as any).mockReturnValue([
      {
        batteryInfo: null,
        visibilityState: {
          isVisible: true,
          intersectionRatio: 1,
          isInViewport: true,
        },
        isLowBattery: false,
        shouldPauseRendering: false,
        recommendedQuality: null,
        optimizationReasons: [],
        isSlowConnection: false,
        hapticSupported: false,
      },
      {
        triggerHapticFeedback: vi.fn(),
        preloadImages: vi.fn(),
        loadImage: vi.fn(),
        getNetworkInfo: vi.fn(),
        setupElementMonitoring: vi.fn(() => vi.fn()),
      },
    ]);

    render(<RippleImageEnhanced {...defaultProps} />);

    const container = screen.getByTestId("webgl-ripple").parentElement;
    expect(container).toHaveAttribute("data-mobile-optimized", "false");
    expect(container).toHaveAttribute("data-render-mode", "webgl");
  });
});
