"use client";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, useState, useContext, useRef } from "react";

interface ScrollTriggerContextType {
  activeSection: string | null;
  horizontalST: ScrollTrigger | null;
  isScrollingRef: { current: boolean };
  setActiveSection: (id: string | null) => void;
  setHorizontalST: (st: ScrollTrigger | null) => void;
}

const ScrollTriggerContext = createContext<
  ScrollTriggerContextType | undefined
>(undefined);

export const ScrollTriggerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isScrollingRef = useRef<boolean>(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [horizontalST, setHorizontalST] = useState<ScrollTrigger | null>(null);

  const value = {
    horizontalST,
    activeSection,
    isScrollingRef,
    setHorizontalST,
    setActiveSection,
  };

  return (
    <ScrollTriggerContext.Provider value={value}>
      {children}
    </ScrollTriggerContext.Provider>
  );
};

export const useScrollTriggerContext = () => {
  const context = useContext(ScrollTriggerContext);
  if (context === undefined) {
    throw new Error(
      "useScrollTriggerContext must be used within a ScrollTriggerProvider"
    );
  }
  return context;
};
