"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useHash(): string {
  const [hash, setHash] = useState("");
  const isInitializedRef = useRef(false);

  // Optimized hash getter with memoization
  const getHash = useCallback(() => {
    if (typeof window === "undefined") return "";
    return window.location.hash || "";
  }, []);

  // Throttled update function to prevent excessive re-renders
  const updateHash = useCallback(() => {
    const newHash = getHash();
    setHash((prevHash) => {
      // Only update if hash actually changed
      return prevHash !== newHash ? newHash : prevHash;
    });
  }, [getHash]);

  useEffect(() => {
    // Initialize hash on mount
    if (!isInitializedRef.current) {
      updateHash();
      isInitializedRef.current = true;
    }

    // Optimized event listeners with passive option for better performance
    const handleHashChange = () => updateHash();
    const handlePopState = () => updateHash();

    window.addEventListener("hashchange", handleHashChange, { passive: true });
    window.addEventListener("popstate", handlePopState, { passive: true });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [updateHash]);

  return hash;
}
