import gsap from "gsap";
import { cn } from "@/lib/utils";
import AnimatedUnderline from "../ui/animated-underline";
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

export type ScrollProgressRef = {
  setProgress: (p: number) => void; // p between 0 and 1
};

type MaskProgressProps = {
  className?: string;
  ariaLabel?: string;
  /**
   * "ltr" => reveal underlying SVG left-to-right (overlay collapses toward the right)
   * "rtl" => reveal underlying SVG right-to-left (overlay collapses toward the left)
   */
  direction?: "ltr" | "rtl";
};

const MaskProgress = forwardRef<ScrollProgressRef, MaskProgressProps>(
  ({ className, direction = "ltr", ariaLabel = "Scroll progress" }, ref) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement | null>(null);

    // compute transform origin based on requested direction
    const transformOrigin =
      direction === "ltr" ? "right center" : "left center";

    // initialize the overlay to full (scaleX: 1) and set transformOrigin once
    useEffect(() => {
      if (!fillRef.current) return;
      gsap.set(fillRef.current as any, {
        transformOrigin,
        scaleX: 1,
        opacity: 1,
      });
    }, [transformOrigin]);

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        const clamped = Math.max(0, Math.min(1, p));
        if (!fillRef.current) return;

        // overlay should start full (scaleX=1) and shrink to 0 when p === 1
        const targetScale = 1 - clamped;

        // optionally fade out completely when fully hidden
        const targetOpacity = targetScale > 0 ? 1 : 0;

        gsap.to(fillRef.current as any, {
          scaleX: targetScale,
          opacity: targetOpacity,
          duration: 0.14,
          ease: "power1.out",
          overwrite: true,
        });

        if (wrapperRef.current) {
          wrapperRef.current.setAttribute(
            "aria-valuenow",
            String(Math.round(clamped * 100))
          );
        }
      },
    }));

    return (
      <div
        ref={wrapperRef}
        role="progressbar"
        aria-valuemin={0}
        aria-valuenow={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        className={cn(
          `absolute bottom-10 md:right-10 right-5 h-[15px] w-[200px] rounded-xl overflow-hidden pointer-events-none bg-[#101014] p-1 border-bronze/20 border backdrop-blur-lg`,
          className
        )}
      >
        {/* The overlay that covers the SVG — we shrink this with scaleX */}
        <div
          ref={fillRef}
          className={`absolute inset-0 bg-[#101014] will-change-transform z-[10]`}
          // keep initial transform values in JS (gsap.set), but as a fallback:
          style={{
            transformOrigin,
            transform: "scaleX(1)",
            opacity: 1,
          }}
        />
        <AnimatedUnderline className="bottom-1/2 translate-y-1/2" />
        {/* optional: accessible text for screen readers */}
        <span className="sr-only">Scroll progress</span>
      </div>
    );
  }
);
MaskProgress.displayName = "MaskProgress";

export default MaskProgress;
