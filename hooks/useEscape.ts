"use client";
import { useEffect } from "react";

const useEscape = (callback: () => void) => {
  useEffect(() => {
    const escFunction = (event: KeyboardEvent) => {
      if (event.key === "Escape") callback();
    };
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useEscape;
