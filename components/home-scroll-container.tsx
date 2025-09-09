"use client";
import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useScrollTriggerContext } from "@/context/scroll-trigger-context";

gsap.registerPlugin(ScrollTrigger);

interface HomeScrollContainerProps {
  children: React.ReactNode;
}

// this component sets the active section, helps with header NavLink highlighting

const HomeScrollContainer = ({ children }: HomeScrollContainerProps) => {
  const { horizontalST, setHorizontalST, setActiveSection, isScrollingRef } =
    useScrollTriggerContext();

  // either scroll to the top of the horizontal scroll section, in  this case "about section", or just to any other section
  useHashScroll(horizontalST, isScrollingRef);

  useGSAP(
    () => {
      const horizontalContainer = document.querySelector<HTMLElement>(
        ".horizontal-container"
      );
      if (horizontalContainer) {
        const horizontalSections =
          gsap.utils.toArray<HTMLElement>(".horizontal-panel");
        const horizontalTween = gsap.to(horizontalSections, {
          /* ... */
        });
        if (horizontalTween.scrollTrigger) {
          setHorizontalST(horizontalTween.scrollTrigger);
        }
      }

      // --- NEW: Active Section Tracking Logic ---
      // Select all sections that should be trackable
      const trackableSections = gsap.utils.toArray<HTMLElement>("section[id]");
      trackableSections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            // Read the INSTANTANEOUS value from the ref's .current property
            if (!isScrollingRef.current && self.isActive) {
              setActiveSection(section.id);
            }
          },
        });
      });

      return () => {
        setHorizontalST(null);
        // ScrollTriggers created with .create() are automatically killed by useGSAP's cleanup
      };
    },
    { dependencies: [setActiveSection, setHorizontalST, isScrollingRef] }
  );

  return <>{children}</>;
};

export default HomeScrollContainer;
