"use client";
import { memo } from "react";
import { cn } from "@/lib/utils";

interface SliderIndicatorsProps {
  length: number;
  selectedIndex: number;
  handleClick?: (index: number) => void;
}

const SliderIndicators = memo<SliderIndicatorsProps>(
  ({ length, handleClick, selectedIndex }) => {
    // Generate array once to avoid recreation on each render
    const indicators = Array.from({ length }, (_, index) => {
      const isSelected = index === selectedIndex;
      const isAdjacent =
        (selectedIndex > 0 && index === selectedIndex - 1) ||
        (selectedIndex < length - 1 && index === selectedIndex + 1);

      return (
        <SliderIndicator
          key={index}
          index={index}
          selected={isSelected}
          adjacent={isAdjacent}
          onClick={handleClick ? () => handleClick(index) : undefined}
        />
      );
    });

    return (
      <nav
        className="absolute md:top-[50%] max-md:bottom-[70px] right-[5vw] w-9 flex flex-col md:justify-end justify-center items-center z-10 bg-blurred backdrop-blur-lg rounded-full py-3 px-1.5 border-bronze/20 border"
        role="tablist"
        aria-label="Slide navigation"
      >
        {indicators}
      </nav>
    );
  }
);

SliderIndicators.displayName = "SliderIndicators";

interface SliderIndicatorProps {
  index: number;
  selected: boolean;
  adjacent: boolean;
  onClick?: () => void;
}

const SliderIndicator = memo<SliderIndicatorProps>(
  ({ index, selected, adjacent, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Go to slide ${index + 1}`}
        aria-selected={selected}
        role="tab"
        tabIndex={selected ? 0 : -1}
        className={cn(
          "flex items-center justify-center rounded-full p-0.5 transition-all duration-200",
          "focus:outline-none focus:ring-1 focus:ring-white/50",
          onClick
            ? "cursor-pointer hover:bg-white/10 active:scale-95"
            : "cursor-default"
        )}
        disabled={!onClick}
      >
        <div
          className={cn(
            "h-0.5 w-4 bg-bronze rounded-full transition-all duration-500 ease-out",
            selected
              ? "opacity-100 w-5 shadow-[0_0_8px_rgba(244,234,143,0.6)] bg-gradient-to-r from-bronze to-yellow-300"
              : "opacity-60",
            adjacent && "scale-90",
            !adjacent && !selected && "scale-75 opacity-40"
          )}
        />
      </button>
    );
  }
);

SliderIndicator.displayName = "SliderIndicator";

export default SliderIndicators;
