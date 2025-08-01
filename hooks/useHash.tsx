"use client";

import { useState, useEffect } from "react";

export function useHash(): string {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const getHash = () => window.location.hash || "";

    const update = () => setHash(getHash());

    // Initial hash
    update();

    // Listen to hashchange events
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update); // for back/forward nav

    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  return hash;
}
