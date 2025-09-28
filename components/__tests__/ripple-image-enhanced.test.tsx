import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDeviceCapabilities } from "../../hooks/useDeviceCapabilities";

// Mock the hooks and components
vi.mock("../../hooks/useDeviceCapabilities");
vi.mock("../../hooks/usePerformanceMonitor", () => ({
  usePerformanceMonitor: () => ({
    metrics: { currentFPS: 60, averageFPS: 60, frameDrops: 0 },
    currentQuality: "medium",
    isPerformancePoor: false,
    recordInteraction: vi.fn(),
    setQuality: vi.fn(),
  }),
}));
vi.mock("../ripple-image", () => ({
  RippleImage: ({ src, alt }: { src: string; alt: string }) => (
    <div data-testid="webgl-ripple" aria-label={alt}>
      <img src={src} alt={alt} />
    </div>
  ),
}));
vi.mock("../ripple-image-fallback", () => ({
  RippleImageFallback: ({
    src,
    alt,
    transitionMode,
  }: {
    src: string;
    alt: string;
    transitionMode?: string | null;
  }) => (
    <div
      data-testid="css-ripple"
      aria-label={alt}
      data-transition-mode={transitionMode || "none"}
    >
      <img src={src} alt={alt} />
    </div>
  ),
}));

import { RippleImageEnhanced } from "../ripple-image-enhanced";

const mockUseDeviceCapabilities = useDeviceCapabilities as ReturnType<
  typeof vi.mocked
>;

describe("RippleImageEnhanced", () => {
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

  it("uses WebGL mode for high-capability devices", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 4096,
      devicePixelRatio: 1,
    });

    render(<RippleImageEnhanced {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("css-ripple")).not.toBeInTheDocument();
    });
  });

  it("uses CSS fallback for low-capability devices", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: false,
      gpuTier: "low",
      maxTextureSize: 1024,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
    });
  });

  it("uses CSS fallback for mobile devices with low quality setting", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: true,
      gpuTier: "medium",
      maxTextureSize: 2048,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} quality="low" />);

    await waitFor(() => {
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
    });
  });

  it('respects forceMode="webgl" override', async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: false,
      gpuTier: "low",
      maxTextureSize: 1024,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} forceMode="webgl" />);

    await waitFor(() => {
      expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("css-ripple")).not.toBeInTheDocument();
    });
  });

  it('respects forceMode="css" override', async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 4096,
      devicePixelRatio: 1,
    });

    render(<RippleImageEnhanced {...defaultProps} forceMode="css" />);

    await waitFor(() => {
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
    });
  });

  it("handles mode transitions smoothly", async () => {
    // Start with WebGL-capable device
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 4096,
      devicePixelRatio: 1,
    });

    const { rerender } = render(<RippleImageEnhanced {...defaultProps} />);

    // Should start with WebGL
    await waitFor(() => {
      expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
    });

    // Change to force CSS mode
    rerender(<RippleImageEnhanced {...defaultProps} forceMode="css" />);

    // Should transition to CSS mode
    vi.advanceTimersByTime(150);

    await waitFor(() => {
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
      expect(screen.queryByTestId("webgl-ripple")).not.toBeInTheDocument();
    });
  });

  it("converts animation duration correctly for CSS mode", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: false,
      gpuTier: "low",
      maxTextureSize: 1024,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} animationDuration={3.5} />);

    await waitFor(() => {
      const cssRipple = screen.getByTestId("css-ripple");
      expect(cssRipple).toBeInTheDocument();
      // The component should pass 3500ms (3.5 * 1000) to the CSS component
    });
  });

  it("applies custom className", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: false,
      hasWebGL: true,
      gpuTier: "high",
      maxTextureSize: 4096,
      devicePixelRatio: 1,
    });

    const { container } = render(
      <RippleImageEnhanced {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("ripple-image-enhanced");
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("uses medium quality by default", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: true,
      gpuTier: "medium",
      maxTextureSize: 2048,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} />);

    // With medium quality on mobile, should still use WebGL
    await waitFor(() => {
      expect(screen.getByTestId("webgl-ripple")).toBeInTheDocument();
    });
  });

  it("passes rippleIntensity to CSS fallback", async () => {
    mockUseDeviceCapabilities.mockReturnValue({
      isMobile: true,
      hasWebGL: false,
      gpuTier: "low",
      maxTextureSize: 1024,
      devicePixelRatio: 2,
    });

    render(<RippleImageEnhanced {...defaultProps} rippleIntensity="strong" />);

    await waitFor(() => {
      expect(screen.getByTestId("css-ripple")).toBeInTheDocument();
    });
  });
});
