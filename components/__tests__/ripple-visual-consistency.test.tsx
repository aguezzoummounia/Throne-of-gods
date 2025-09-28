import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { RippleImageFallback } from "../ripple-image-fallback";

/**
 * Visual consistency tests for CSS fallback ripple effect
 * These tests verify that the CSS implementation maintains visual consistency
 * with the WebGL version in terms of timing, positioning, and behavior.
 */

describe("Ripple Visual Consistency", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock getBoundingClientRect for consistent positioning tests
    Object.defineProperty(Element.prototype, "getBoundingClientRect", {
      value: vi.fn(() => ({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => {},
      })),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("Animation Timing Consistency", () => {
    it("matches WebGL animation duration (2.5s default)", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;
        const animationStyle = ripple.style.animation;
        expect(animationStyle).toContain("2500ms");
      });
    });

    it("supports custom animation durations", async () => {
      const customDuration = 1500;
      const { container } = render(
        <RippleImageFallback
          {...defaultProps}
          animationDuration={customDuration}
        />
      );

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;
        const animationStyle = ripple.style.animation;
        expect(animationStyle).toContain(`${customDuration}ms`);
      });
    });

    it("auto-starts with same delay as WebGL version (400ms)", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      // Should not have ripples initially
      expect(container.querySelectorAll(".ripple-effect")).toHaveLength(0);

      // Fast-forward to just before auto-start
      vi.advanceTimersByTime(399);
      expect(container.querySelectorAll(".ripple-effect")).toHaveLength(0);

      // Fast-forward past auto-start delay
      vi.advanceTimersByTime(1);

      await waitFor(() => {
        expect(container.querySelectorAll(".ripple-effect")).toHaveLength(1);
      });
    });
  });

  describe("Positioning Accuracy", () => {
    it("positions ripple at exact click coordinates", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;

      // Test multiple positions
      const testPositions = [
        { x: 100, y: 75 },
        { x: 300, y: 200 },
        { x: 50, y: 250 },
        { x: 350, y: 50 },
      ];

      for (const pos of testPositions) {
        fireEvent.click(rippleContainer, { clientX: pos.x, clientY: pos.y });

        await waitFor(() => {
          const ripples = container.querySelectorAll(".ripple-effect");
          const latestRipple = ripples[ripples.length - 1] as HTMLElement;
          expect(latestRipple).toHaveStyle({
            left: `${pos.x}px`,
            top: `${pos.y}px`,
          });
        });
      }
    });

    it("centers auto-start ripple in container", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      vi.advanceTimersByTime(400);

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;
        // Should be centered in 400x300 container
        expect(ripple).toHaveStyle({
          left: "200px", // 400/2
          top: "150px", // 300/2
        });
      });
    });

    it("handles touch events with same positioning accuracy", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;

      fireEvent.touchStart(rippleContainer, {
        touches: [{ clientX: 175, clientY: 225 }],
      });

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;
        expect(ripple).toHaveStyle({
          left: "175px",
          top: "225px",
        });
      });
    });
  });

  describe("Visual Effect Consistency", () => {
    it("applies correct ripple scaling progression", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;

        // Check that the CSS animation is applied
        const animationStyle = ripple.style.animation;
        expect(animationStyle).toContain("ripple-expand");

        // Verify initial transform state
        expect(ripple).toHaveStyle("transform: scale(0)");
      });
    });

    it("supports different intensity levels", async () => {
      const intensities = ["subtle", "normal", "strong"] as const;

      for (const intensity of intensities) {
        const { container } = render(
          <RippleImageFallback {...defaultProps} rippleIntensity={intensity} />
        );

        const rippleContainer = container.querySelector(
          '[aria-label="Test image"]'
        )!;
        fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

        await waitFor(() => {
          const ripple = container.querySelector(
            ".ripple-effect"
          ) as HTMLElement;
          const backgroundStyle = ripple.style.background;

          // Each intensity should have different opacity values
          if (intensity === "subtle") {
            expect(backgroundStyle).toContain("0.2");
          } else if (intensity === "strong") {
            expect(backgroundStyle).toContain("0.6");
          } else {
            expect(backgroundStyle).toContain("0.4");
          }
        });
      }
    });

    it("maintains proper opacity progression", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

      await waitFor(() => {
        const ripple = container.querySelector(".ripple-effect") as HTMLElement;

        // Should start with opacity 1
        expect(ripple).toHaveStyle("opacity: 1");

        // Animation should be applied
        const animationStyle = ripple.style.animation;
        expect(animationStyle).toContain("ripple-expand");
      });
    });
  });

  describe("Interaction Behavior Consistency", () => {
    it("prevents default behavior on interactions", () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;

      const clickEvent = new MouseEvent("click", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

      fireEvent(rippleContainer, clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("supports multiple simultaneous ripples like WebGL version", async () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;

      // Create multiple ripples in quick succession
      fireEvent.click(rippleContainer, { clientX: 100, clientY: 100 });
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });
      fireEvent.click(rippleContainer, { clientX: 300, clientY: 200 });

      await waitFor(() => {
        const ripples = container.querySelectorAll(".ripple-effect");
        expect(ripples).toHaveLength(3);
      });
    });

    it("cleans up ripples after animation completes", async () => {
      const animationDuration = 1000;
      const { container } = render(
        <RippleImageFallback
          {...defaultProps}
          animationDuration={animationDuration}
        />
      );

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      )!;
      fireEvent.click(rippleContainer, { clientX: 200, clientY: 150 });

      // Ripple should exist during animation
      await waitFor(() => {
        expect(container.querySelectorAll(".ripple-effect")).toHaveLength(1);
      });

      // Fast-forward past animation duration
      vi.advanceTimersByTime(animationDuration);

      // Ripple should be cleaned up
      await waitFor(() => {
        expect(container.querySelectorAll(".ripple-effect")).toHaveLength(0);
      });
    });
  });

  describe("Accessibility Consistency", () => {
    it("maintains same ARIA labels and structure", () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      );
      expect(rippleContainer).toBeInTheDocument();

      const image = container.querySelector("img");
      expect(image).toHaveAttribute("alt", "Test image");
      expect(image).toHaveAttribute("draggable", "false");
    });

    it("maintains proper focus and interaction states", () => {
      const { container } = render(<RippleImageFallback {...defaultProps} />);

      const rippleContainer = container.querySelector(
        '[aria-label="Test image"]'
      ) as HTMLElement;

      // Should be focusable and interactive
      expect(rippleContainer).toHaveStyle("cursor: pointer");
      expect(rippleContainer).toHaveStyle("user-select: none");
    });
  });
});
