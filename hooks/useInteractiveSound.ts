import { useCallback, useMemo, useRef } from "react";
import { useAudio } from "@/context/sound-context";

// Additional throttling at hook level for extra protection
const HOOK_HOVER_THROTTLE = 60; // 60ms for ultra-responsive hover
const HOOK_CLICK_THROTTLE = 100; // 100ms for click protection

export const useInteractiveSound = () => {
  const { playHoverSound, playClickSound } = useAudio();

  // Throttling refs for this specific hook instance
  const lastHoverRef = useRef<number>(0);
  const lastClickRef = useRef<number>(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized hover handler with additional throttling
  const handleMouseEnter = useCallback(() => {
    const now = performance.now();

    // Clear existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Check if enough time has passed
    if (now - lastHoverRef.current >= HOOK_HOVER_THROTTLE) {
      lastHoverRef.current = now;
      playHoverSound();
    } else {
      // Schedule for later if too soon
      hoverTimeoutRef.current = setTimeout(() => {
        lastHoverRef.current = performance.now();
        playHoverSound();
      }, HOOK_HOVER_THROTTLE - (now - lastHoverRef.current));
    }
  }, [playHoverSound]);

  // Optimized click handler with additional throttling
  const handleClick = useCallback(() => {
    const now = performance.now();

    if (now - lastClickRef.current >= HOOK_CLICK_THROTTLE) {
      lastClickRef.current = now;
      playClickSound();
    }
    // If too soon, ignore (no scheduling for clicks to avoid spam)
  }, [playClickSound]);

  // Cleanup function for timeouts
  const cleanup = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Mouse leave handler to cancel pending hover sounds
  const handleMouseLeave = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Memoized return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      // Additional event handlers for comprehensive interaction
      onFocus: handleMouseEnter, // Keyboard navigation support
      onBlur: handleMouseLeave, // Keyboard navigation support
    }),
    [handleMouseEnter, handleMouseLeave, handleClick]
  );
};
