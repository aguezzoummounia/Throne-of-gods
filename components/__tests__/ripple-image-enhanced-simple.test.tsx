/**
 * @vitest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the hooks
vi.mock("../../hooks/useDeviceCapabilities", () => ({
  useDeviceCapabilities: () => ({
    isMobile: false,
    hasWebGL: true,
    gpuTier: "high",
    maxTextureSize: 4096,
    devicePixelRatio: 1,
    screenSize: { width: 1024, height: 768 },
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
  usePerformanceMonitor: () => ({
    metrics: { currentFPS: 60, averageFPS: 60, frameDrops: 0 },
    currentQuality: "medium",
    isPerformancePoor: false,
    recordInteraction: vi.fn(),
    setQuality: vi.fn(),
  }),
}));

// Mock the child components
vi.mock("../ripple-image", () => ({
  RippleImage: React.forwardRef(
    ({ src, alt }: { src: string; alt: string }, ref) => (
      <div data-testid="webgl-ripple" aria-label={alt} ref={ref}>
        <img src={src} alt={alt} />
      </div>
    )
  ),
}));

vi.mock("../ripple-image-fallback", () => ({
  RippleImageFallback: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="css-ripple" aria-label={alt}>
      <img src={src} alt={alt} />
    </div>
  ),
}));

import { RippleImageEnhanced } from "../ripple-image-enhanced";

describe("RippleImageEnhanced", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <RippleImageEnhanced src="/test-image.jpg" alt="Test image" />
    );

    expect(container).toBeTruthy();
    expect(container.firstChild).toHaveClass("ripple-image-enhanced");
  });

  it("should have correct data attributes", () => {
    const { container } = render(
      <RippleImageEnhanced src="/test-image.jpg" alt="Test image" />
    );

    const component = container.firstChild as HTMLElement;
    expect(component).toHaveAttribute("data-render-mode");
    expect(component).toHaveAttribute("data-quality");
    expect(component).toHaveAttribute("data-device-tier");
  });
});
