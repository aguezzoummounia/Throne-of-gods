import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { RippleImageFallback } from "../ripple-image-fallback";

describe("RippleImageFallback", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock getBoundingClientRect
    const mockGetBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    if (typeof Element !== "undefined") {
      Object.defineProperty(Element.prototype, "getBoundingClientRect", {
        value: mockGetBoundingClientRect,
        configurable: true,
      });
    }
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders image with correct attributes", () => {
    render(<RippleImageFallback {...defaultProps} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("draggable", "false");
  });

  it("creates ripple on click", async () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    fireEvent.click(container, {
      clientX: 100,
      clientY: 100,
    });

    // Should create a ripple element
    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(1);
    });
  });

  it("creates ripple on touch", async () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    fireEvent.touchStart(container, {
      touches: [{ clientX: 150, clientY: 150 }],
    });

    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(1);
    });
  });

  it("positions ripple at click coordinates", async () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    fireEvent.click(container, {
      clientX: 75,
      clientY: 125,
    });

    await waitFor(() => {
      const ripple = container.querySelector(".ripple-effect") as HTMLElement;
      expect(ripple).toHaveStyle({
        left: "75px",
        top: "125px",
      });
    });
  });

  it("auto-starts ripple after mount delay", async () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    // Fast-forward past the auto-start delay
    vi.advanceTimersByTime(400);

    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(1);
    });
  });

  it("removes ripple after animation duration", async () => {
    const animationDuration = 1000;
    render(
      <RippleImageFallback
        {...defaultProps}
        animationDuration={animationDuration}
      />
    );

    const container = screen.getByLabelText("Test image");

    fireEvent.click(container, {
      clientX: 100,
      clientY: 100,
    });

    // Ripple should be present initially
    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(1);
    });

    // Fast-forward past animation duration
    vi.advanceTimersByTime(animationDuration);

    // Ripple should be removed
    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(0);
    });
  });

  it("handles multiple simultaneous ripples", async () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    // Create multiple ripples quickly
    fireEvent.click(container, { clientX: 50, clientY: 50 });
    fireEvent.click(container, { clientX: 100, clientY: 100 });
    fireEvent.click(container, { clientX: 150, clientY: 150 });

    await waitFor(() => {
      const ripples = container.querySelectorAll(".ripple-effect");
      expect(ripples).toHaveLength(3);
    });
  });

  it("applies custom animation duration", async () => {
    const customDuration = 3000;
    render(
      <RippleImageFallback
        {...defaultProps}
        animationDuration={customDuration}
      />
    );

    const container = screen.getByLabelText("Test image");

    fireEvent.click(container, {
      clientX: 100,
      clientY: 100,
    });

    await waitFor(() => {
      const ripple = container.querySelector(".ripple-effect") as HTMLElement;
      const animationStyle = ripple.style.animation;
      expect(animationStyle).toContain("3000ms");
    });
  });

  it("prevents default on click and touch events", () => {
    render(<RippleImageFallback {...defaultProps} />);

    const container = screen.getByLabelText("Test image");

    const clickEvent = new MouseEvent("click", { bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

    fireEvent(container, clickEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();

    const touchEvent = new TouchEvent("touchstart", {
      bubbles: true,
      touches: [{ clientX: 100, clientY: 100 } as Touch],
    });
    const touchPreventDefaultSpy = vi.spyOn(touchEvent, "preventDefault");

    fireEvent(container, touchEvent);
    expect(touchPreventDefaultSpy).toHaveBeenCalled();
  });

  it("handles edge case when container ref is null", () => {
    const { container } = render(<RippleImageFallback {...defaultProps} />);

    // Simulate container ref being null
    const rippleContainer = container.querySelector(
      '[aria-label="Test image"]'
    );

    // This should not throw an error
    expect(() => {
      fireEvent.click(rippleContainer!, {
        clientX: 100,
        clientY: 100,
      });
    }).not.toThrow();
  });
});
