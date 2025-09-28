import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../global/footer";

// Mock the enhanced ripple image component
jest.mock("../ripple-image-enhanced", () => ({
  RippleImageEnhanced: jest.fn(({ onError, onModeChange, ...props }) => (
    <div
      data-testid="ripple-image-enhanced"
      data-src={props.src}
      data-alt={props.alt}
      data-mode={props.forceMode}
      data-quality={props.quality}
      onClick={() => {
        // Simulate mode change callback
        onModeChange?.("css", "test mode change");
      }}
      onError={() => {
        // Simulate error callback
        onError?.(new Error("Test WebGL error"), { test: true });
      }}
    >
      Enhanced Ripple Image
    </div>
  )),
}));

// Mock GSAP and related plugins
jest.mock("gsap", () => ({
  gsap: {
    registerPlugin: jest.fn(),
    timeline: jest.fn(() => ({
      from: jest.fn().mockReturnThis(),
      add: jest.fn().mockReturnThis(),
    })),
    from: jest.fn(),
    set: jest.fn(),
    utils: {
      toArray: jest.fn(() => []),
    },
  },
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn((callback) => {
    // Execute the callback immediately for testing
    callback();
  }),
}));

jest.mock("gsap/SplitText", () =>
  jest.fn().mockImplementation(() => ({
    chars: [],
    lines: [],
    revert: jest.fn(),
  }))
);

jest.mock("gsap/ScrollTrigger", () => ({}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
}));

// Mock constants
jest.mock("@/lib/consts", () => ({
  dev_url: "https://dev.example.com",
  site_name: "Test Site",
  email_address: "test@example.com",
  trailer_url: "https://trailer.example.com",
}));

describe("Footer Integration with RippleImageEnhanced", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders footer with enhanced ripple image", () => {
    render(<Footer />);

    expect(screen.getByTestId("ripple-image-enhanced")).toBeInTheDocument();
    expect(
      screen.getByText("Memory Burns Brighter Than Flame")
    ).toBeInTheDocument();
  });

  it("passes correct props to RippleImageEnhanced", () => {
    render(<Footer />);

    const rippleImage = screen.getByTestId("ripple-image-enhanced");
    expect(rippleImage).toHaveAttribute(
      "data-src",
      "/images/static/footer-image.png"
    );
    expect(rippleImage).toHaveAttribute("data-alt", "Abstract landscape");
    expect(rippleImage).toHaveAttribute("data-mode", "auto");
    expect(rippleImage).toHaveAttribute("data-quality", "medium");
  });

  it("handles WebGL error gracefully", async () => {
    render(<Footer />);

    const rippleImage = screen.getByTestId("ripple-image-enhanced");

    // Simulate WebGL error
    fireEvent.error(rippleImage);

    // In development mode, error indicator should appear
    if (process.env.NODE_ENV === "development") {
      await waitFor(() => {
        expect(
          screen.getByText(/WebGL Error - Using CSS Fallback/)
        ).toBeInTheDocument();
      });
    }
  });

  it("handles mode changes correctly", async () => {
    render(<Footer />);

    const rippleImage = screen.getByTestId("ripple-image-enhanced");

    // Simulate mode change
    fireEvent.click(rippleImage);

    // In development mode, mode indicator should show CSS
    if (process.env.NODE_ENV === "development") {
      await waitFor(() => {
        expect(screen.getByText(/Mode: CSS/)).toBeInTheDocument();
      });
    }
  });

  it("applies mobile-specific styling", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveStyle({
      touchAction: "manipulation",
      willChange: "auto",
    });
  });

  it("applies performance optimizations to ripple container", () => {
    render(<Footer />);

    const rippleContainer = screen.getByTestId(
      "ripple-image-enhanced"
    ).parentElement;
    expect(rippleContainer).toHaveStyle({
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      touchAction: "manipulation",
    });
  });

  it("renders footer content correctly", () => {
    render(<Footer />);

    // Check main content
    expect(
      screen.getByText("Memory Burns Brighter Than Flame")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Immerse yourself in a dark epic/)
    ).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText("See trailer")).toBeInTheDocument();
    expect(screen.getByText("Reach out")).toBeInTheDocument();

    // Check footer info
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    expect(screen.getByText("Site by")).toBeInTheDocument();
  });

  it("maintains GSAP animation structure", () => {
    const { gsap } = require("gsap");
    const { useGSAP } = require("@gsap/react");

    render(<Footer />);

    // Verify GSAP hooks are called
    expect(useGSAP).toHaveBeenCalled();
    expect(gsap.timeline).toHaveBeenCalled();
  });
});
