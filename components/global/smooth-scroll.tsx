"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { LenisRef, ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: React.ReactNode;
}

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);
  return (
    <ReactLenis root ref={lenisRef}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
