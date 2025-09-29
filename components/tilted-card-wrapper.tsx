"use client";

import { cn, lerp } from "@/lib/utils";
import { useRef, useEffect, useCallback, useMemo } from "react";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

/**
 * Configuration constants for the tilted card animation
 */
const ANIMATION_CONFIG = {
  MAX_TILT: 12, // Maximum tilt angle in degrees
  MAX_LIFT: 14, // Maximum lift distance in pixels
  SMOOTHING: 0.12, // Animation smoothing factor (0-1, lower = smoother)
  PERSPECTIVE: 1000, // CSS perspective value in pixels
  REST_THRESHOLD: {
    ROTATION: 0.01, // Threshold for rotation rest detection
    TRANSLATION: 0.1, // Threshold for translation rest detection
  },
} as const;

/**
 * Props for the TiltedCardWrapper component
 */
interface TiltedCardWrapperProps {
  /** Additional CSS classes to apply to the wrapper */
  className?: string;
  /** Child elements to render inside the tilted card */
  children: React.ReactNode;
  /** Whether the component is disabled (no tilt effect) */
  disabled?: boolean;
  /** Custom animation configuration overrides */
  config?: Partial<typeof ANIMATION_CONFIG>;
}

/**
 * Internal state types for better type safety
 */
interface AnimationState {
  rx: number; // Rotation X
  ry: number; // Rotation Y
  ty: number; // Translation Y
}

interface PointerState {
  x: number;
  y: number;
  inside: boolean;
}

interface RectCache {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * A wrapper component that applies a 3D tilt effect to its children based on pointer movement.
 * The component uses hardware-accelerated CSS transforms and requestAnimationFrame for smooth animations.
 *
 * @param props - The component props
 * @returns A React component with tilt animation capabilities
 */
const TiltedCardWrapper = ({
  children,
  className,
  disabled = false,
  config = {},
}: TiltedCardWrapperProps) => {
  const soundEvents = useInteractiveSound();

  // Merge custom config with defaults
  const animationConfig = useMemo(
    () => ({
      ...ANIMATION_CONFIG,
      ...config,
    }),
    [config]
  );

  // DOM element references
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Animation state references for smooth interpolation
  const targetState = useRef<AnimationState>({ rx: 0, ry: 0, ty: 0 });
  const currentState = useRef<AnimationState>({ rx: 0, ry: 0, ty: 0 });

  // Pointer tracking state
  const pointerState = useRef<PointerState>({ x: 0, y: 0, inside: false });

  // Animation and caching references
  const rafId = useRef<number | null>(null);
  const rectCache = useRef<RectCache>({ left: 0, top: 0, width: 1, height: 1 });
  const isInitialized = useRef(false);

  /**
   * Updates the cached bounding rectangle of the wrapper element.
   * This optimization prevents repeated getBoundingClientRect calls during animation.
   */
  const updateRect = useCallback(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    rectCache.current = {
      left: rect.left,
      top: rect.top,
      width: Math.max(rect.width, 1), // Prevent division by zero
      height: Math.max(rect.height, 1), // Prevent division by zero
    };
    isInitialized.current = true;
  }, []);

  /**
   * Handles pointer movement and updates the pointer state.
   * Separated from style application for better performance.
   */
  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (disabled) return;

      // Ensure we have valid rect data
      if (!isInitialized.current) {
        updateRect();
      }

      pointerState.current.x = event.clientX;
      pointerState.current.y = event.clientY;
    },
    [disabled, updateRect]
  );

  /**
   * Handles pointer enter events, initializes the animation loop.
   */
  const handlePointerEnter = useCallback(() => {
    if (disabled) return;

    pointerState.current.inside = true;
    updateRect();
    startAnimationLoop();
  }, [disabled, updateRect]);

  /**
   * Handles pointer leave events, resets the animation target to neutral state.
   */
  const handlePointerLeave = useCallback(() => {
    if (disabled) return;

    pointerState.current.inside = false;
    // Reset target to neutral position
    targetState.current = { rx: 0, ry: 0, ty: 0 };
  }, [disabled]);

  /**
   * Main animation loop that computes target values and applies smooth interpolation.
   * Uses requestAnimationFrame for optimal performance and hardware acceleration.
   */
  const animate = useCallback(() => {
    const cardElement = cardRef.current;
    if (!cardElement) {
      rafId.current = null;
      return;
    }

    // Compute target values based on pointer position
    if (pointerState.current.inside) {
      const { x, y } = pointerState.current;
      const { left, top, width, height } = rectCache.current;

      // Normalize coordinates to [-1, 1] range with center origin
      const normalizedX = ((x - left) / width - 0.5) * 2; // -1 (left) to +1 (right)
      const normalizedY = ((y - top) / height - 0.5) * 2; // -1 (top) to +1 (bottom)

      // Calculate rotation values
      // Invert Y rotation for natural camera-above perspective
      targetState.current.ry = normalizedX * animationConfig.MAX_TILT * -1;
      targetState.current.rx = normalizedY * animationConfig.MAX_TILT;

      // Calculate subtle lift effect (stronger when pointer is near edges)
      const liftFactor = (1 - Math.abs(normalizedY)) * 0.6;
      targetState.current.ty = liftFactor * animationConfig.MAX_LIFT;
    } else {
      // Reset to neutral when pointer is outside
      targetState.current = { rx: 0, ry: 0, ty: 0 };
    }

    // Apply smooth interpolation using linear interpolation (lerp)
    currentState.current.rx = lerp(
      currentState.current.rx,
      targetState.current.rx,
      animationConfig.SMOOTHING
    );
    currentState.current.ry = lerp(
      currentState.current.ry,
      targetState.current.ry,
      animationConfig.SMOOTHING
    );
    currentState.current.ty = lerp(
      currentState.current.ty,
      targetState.current.ty,
      animationConfig.SMOOTHING
    );

    // Apply hardware-accelerated CSS transform
    const transform = [
      `perspective(${animationConfig.PERSPECTIVE}px)`,
      `translate3d(0, ${-currentState.current.ty}px, 0)`,
      `rotateX(${currentState.current.rx}deg)`,
      `rotateY(${currentState.current.ry}deg)`,
    ].join(" ");

    cardElement.style.transform = transform;

    // Determine if animation should continue
    const isAtRest =
      Math.abs(currentState.current.rx - targetState.current.rx) <
        animationConfig.REST_THRESHOLD.ROTATION &&
      Math.abs(currentState.current.ry - targetState.current.ry) <
        animationConfig.REST_THRESHOLD.ROTATION &&
      Math.abs(currentState.current.ty - targetState.current.ty) <
        animationConfig.REST_THRESHOLD.TRANSLATION;

    // Continue animation if not at rest or pointer is still inside
    if (!isAtRest || pointerState.current.inside) {
      rafId.current = requestAnimationFrame(animate);
    } else {
      rafId.current = null;
    }
  }, [animationConfig]);

  /**
   * Starts the animation loop if not already running.
   */
  const startAnimationLoop = useCallback(() => {
    if (rafId.current === null && !disabled) {
      rafId.current = requestAnimationFrame(animate);
    }
  }, [animate, disabled]);

  /**
   * Cleanup effect to cancel animation frame on unmount
   */
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  /**
   * Window resize handler to update cached dimensions
   */
  useEffect(() => {
    const handleResize = () => {
      updateRect();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateRect]);

  /**
   * Initialize rect cache on mount
   */
  useEffect(() => {
    updateRect();
  }, [updateRect]);

  // Memoize the wrapper classes to prevent unnecessary re-renders
  const wrapperClasses = useMemo(
    () =>
      cn(
        // Base styles for optimal performance
        "will-change-transform transform-gpu backface-visibility-hidden",
        // Conditional styles based on disabled state
        disabled && "pointer-events-none",
        className
      ),
    [className, disabled]
  );

  return (
    <div
      ref={wrapperRef}
      {...(!disabled && soundEvents)}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={wrapperClasses}
      role="presentation"
      aria-hidden="true"
      style={{
        // Ensure proper 3D rendering context
        transformStyle: "preserve-3d",
      }}
    >
      <div
        ref={cardRef}
        className="w-full h-full"
        style={{
          // Ensure child elements participate in 3D space
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Set display name for better debugging
TiltedCardWrapper.displayName = "TiltedCardWrapper";

export default TiltedCardWrapper;
export type { TiltedCardWrapperProps };
