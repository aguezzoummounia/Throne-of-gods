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
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-bronze rotate-90"
            >
              <path
                fill="currentColor"
                d="m3 7 3.857 2.857 3.857 3.572c.31.326.86.937 1.286.92.42-.017.99-.587 1.286-.92 0 0 2.356-2.542 3.857-3.572C18.093 9.204 21 7 21 7.032 21 7.063 12.532 17 12 17c-.643 0-9-9.968-9-9.968z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50 border-bronze/20 border cursor-pointer hover:bg-white/10 active:scale-95 transition-all duration-150"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-4 h-4 text-bronze -rotate-90"
            >
              <path
                fill="currentColor"
                d="m3 7 3.857 2.857 3.857 3.572c.31.326.86.937 1.286.92.42-.017.99-.587 1.286-.92 0 0 2.356-2.542 3.857-3.572C18.093 9.204 21 7 21 7.032 21 7.063 12.532 17 12 17c-.643 0-9-9.968-9-9.968z"
              ></path>
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={handleNavigate}
          className={cn(
            "group relative flex items-center justify-center w-[38px] h-[38px] rounded-full -rotate-90",
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
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-bronze -rotate-45 group-hover:scale-110 group-hover:text-bronze/50 transition-all duration-200 relative z-10"
          >
            <path
              fill="currentColor"
              d="m3 7 3.857 2.857 3.857 3.572c.31.326.86.937 1.286.92.42-.017.99-.587 1.286-.92 0 0 2.356-2.542 3.857-3.572C18.093 9.204 21 7 21 7.032 21 7.063 12.532 17 12 17c-.643 0-9-9.968-9-9.968z"
            ></path>
          </svg>
        </button>
      </div>
    );
  }
);

SliderControls.displayName = "SliderControls";

export default SliderControls;
