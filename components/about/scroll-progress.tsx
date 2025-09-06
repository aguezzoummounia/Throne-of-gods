import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

export type ScrollProgressRef = {
  setProgress: (p: number) => void; // p between 0 and 1
};

type MaskProgressProps = {
  widthClass?: string; // tailwind width for the rail (e.g. 'w-4')
  heightClass?: string; // tailwind height for the rail (e.g. 'h-40 md:h-64')
  railClass?: string; // extra classes for the rail
  fillColorClass?: string; // color for the filled portion (uses bg-current)
  trackColorClass?: string; // track/background color
  ariaLabel?: string;
};

const MaskProgress = forwardRef<ScrollProgressRef, MaskProgressProps>(
  (
    {
      widthClass = "w-[200px]",
      heightClass = "",
      railClass = "",
      fillColorClass = "text-amber-400",
      trackColorClass = "bg-white/6",
      ariaLabel = "Scroll progress",
    },
    ref
  ) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      setProgress: (p: number) => {
        const clamped = Math.max(0, Math.min(1, p));
        if (!fillRef.current) return;
        // we want the overlay to start full (scaleX=1) and shrink to 0 at progress=1.
        const targetScale = 1 - clamped; // 1 -> 0 as p goes 0 -> 1
        // optionally also fade the overlay slightly at the end so the underlying SVG is visible
        const targetOpacity = targetScale > 0 ? 1 : 0;

        gsap.to(fillRef.current as any, {
          scaleX: targetScale,
          opacity: targetOpacity,
          duration: 0.14,
          ease: "power1.out",
          overwrite: true,
        });

        // update aria value
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
        aria-label={"Scroll progress"}
        className={`absolute bottom-10 right-10 h-[15px] w-[200px] rounded-xl overflow-hidden pointer-events-none text-amber-400 p-1 border-bronze/20 border bg-blurred backdrop-blur-lg `}
      >
        {/* The filled bar (we'll hide part of it with clip-path) */}
        <div
          ref={fillRef}
          className={`absolute inset-0 bg-red-950`}
          // initial clip-path hides everything (progress 0)
          style={{ clipPath: "inset(0 100% 0 0)" }}
        />

        {/* Put a visually-hidden percentage (optional); wrapper has aria-valuenow already */}
      </div>
    );
  }
);
MaskProgress.displayName = "MaskProgress";

export default MaskProgress;
