"use client";
import { useEffect } from "react";

const useBodyLockScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
};

export default useBodyLockScroll;
