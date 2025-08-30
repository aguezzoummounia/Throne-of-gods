"use client";

import { useState, useEffect } from "react";

/**
 * A custom React hook that tracks the state of a CSS media query.
 * @param query The media query string to watch (e.g., '(min-width: 768px)').
 * @returns `true` if the media query matches, otherwise `false`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR safety, though "use client" handles this)
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(query);

    // Update state on first run
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);

    // Add listener for changes
    media.addEventListener("change", listener);

    // Cleanup on unmount
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}
