"use client";

import { gsap } from "gsap";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const useHashScroll = (
  horizontalST: ScrollTrigger | null,
  isScrollingRef: { current: boolean }
) => {
  useEffect(() => {
    const hash = window.location.hash;
    isScrollingRef.current = true;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (!targetElement) return;

      if (hash === "#about") {
        if (horizontalST) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: horizontalST.start,
            ease: "power2.inOut",
            onComplete: () => {
              history.pushState(
                {},
                "",
                window.location.pathname + window.location.search
              );
              isScrollingRef.current = false;
            },
            onInterrupt: () => {
              isScrollingRef.current = false;
            },
          });
        }
      } else {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: hash,
          ease: "power2.inOut",
          onComplete: () => {
            history.pushState(
              {},
              "",
              window.location.pathname + window.location.search
            );
            isScrollingRef.current = false;
          },
          onInterrupt: () => {
            isScrollingRef.current = false;
          },
        });
      }
    }
  }, [horizontalST, isScrollingRef]);
};
