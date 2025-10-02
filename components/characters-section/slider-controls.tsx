"use client";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface SliderControlsProps {
  handlePrev: () => void;
  handleNext: () => void;
  handleNavigate: () => void;
}

const SliderControls = memo<SliderControlsProps>(
  ({ handlePrev, handleNext, handleNavigate }) => {
    return (
      <div className="absolute md:bottom-10 bottom-3 z-10 md:-translate-x-1/2 md:left-1/2 max-md:inset-x-[5vw] flex items-center justify-between gap-4">
        <div className="md:w-[150px] w-[calc(100%_-_60px)] flex justify-between items-center gap-1 bg-blurred backdrop-blur-lg rounded-full p-1 border-bronze/20 border">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 border-bronze/20 border cursor-pointer hover:bg-white/10 active:scale-95 transition-all duration-150"
            aria-label="Previous slide"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 border-bronze/20 border cursor-pointer hover:bg-white/10 active:scale-95 transition-all duration-150"
            aria-label="Next slide"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={handleNavigate}
          className={cn(
            "group relative flex items-center justify-center w-[38px] h-[38px] rounded-full",
            "bg-blurred backdrop-blur-lg border border-bronze/20",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            "hover:bg-white/10 hover:border-bronze/40 hover:shadow-[0_0_20px_rgba(244,234,143,0.3)]",
            "active:scale-95 transition-all duration-200",
            "cursor-pointer overflow-visible"
          )}
          aria-label="View character details"
        >
          {/* Perfect dual-ring pulse */}
          <div className="absolute -inset-[5px] border border-white/30 rounded-full button-pulse-ring-1" />
          <div className="absolute -inset-[3px] border border-white/20 rounded-full button-pulse-ring-2" />

          {/* Icon with enhanced hover effect */}
          <svg
            className="w-5 h-5 text-white -rotate-45 group-hover:scale-110 group-hover:text-bronze transition-all duration-200 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    );
  }
);

SliderControls.displayName = "SliderControls";

export default SliderControls;
