import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the RippleImageEnhanced component
const MockRippleImageEnhanced = ({
  src,
  alt,
  onError,
  onModeChange,
  ...props
}: any) => (
  <div
    data-testid="ripple-image-enhanced"
    data-src={src}
    data-alt={alt}
    className={props.className}
  >
    Enhanced Ripple Image Mock
  </div>
);

// Mock all the dependencies
jest.mock("../ripple-image-enhanced", () => ({
  RippleImageEnhanced: MockRippleImageEnhanced,
}));

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
  useGSAP: jest.fn((callback) => callback()),
}));

jest.mock("gsap/SplitText", () =>
  jest.fn().mockImplementation(() => ({
    chars: [],
    lines: [],
    revert: jest.fn(),
  }))
);

jest.mock("gsap/ScrollTrigger", () => ({}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/test",
}));

jest.mock("@/lib/consts", () => ({
  dev_url: "https://dev.example.com",
  site_name: "Test Site",
  email_address: "test@example.com",
  trailer_url: "https://trailer.example.com",
}));

// Import Footer after mocking dependencies
import Footer from "../global/footer";

describe("Footer Integration with RippleImageEnhanced", () => {
  it("renders footer with enhanced ripple image", () => {
    render(<Footer />);

    // Check that the enhanced ripple image is rendered
    const rippleImage = screen.getByTestId("ripple-image-enhanced");
    expect(rippleImage).toBeInTheDocument();

    // Check that it has the correct props
    expect(rippleImage).toHaveAttribute(
      "data-src",
      "/images/static/footer-image.png"
    );
    expect(rippleImage).toHaveAttribute("data-alt", "Abstract landscape");
    expect(rippleImage).toHaveClass("w-full", "h-full");
  });

  it("renders all footer content", () => {
    render(<Footer />);

    // Check main heading
    expect(
      screen.getByText("Memory Burns Brighter Than Flame")
    ).toBeInTheDocument();

    // Check description
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

    const rippleImage = screen.getByTestId("ripple-image-enhanced");
    const container = rippleImage.parentElement;

    expect(container).toHaveStyle({
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      touchAction: "manipulation",
    });
  });
});
