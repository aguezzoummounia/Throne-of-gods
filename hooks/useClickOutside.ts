"use client";
import { useEffect } from "react";

const useClickOutside = (
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref?.current && !ref?.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, callback]);
};

export default useClickOutside;
