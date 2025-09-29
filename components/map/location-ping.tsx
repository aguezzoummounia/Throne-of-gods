import { cn } from "@/lib/utils";
import { memo } from "react";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

interface LocationPingProps {
  className?: string;
  ariaLabel?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  handleBlur: () => void;
  handleClick: () => void;
}

const LocationPing = ({
  ariaLabel,
  className,
  handleBlur,
  handleClick,
  ariaExpanded,
  ariaControls,
}: LocationPingProps) => {
  const soundEvents = useInteractiveSound();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      handleBlur();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
      soundEvents.onClick();
    }
  };
  return (
    <button
      type="button"
      {...soundEvents}
      onKeyDown={handleKeyDown}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={ariaLabel ?? `Open location`}
      title={ariaLabel ?? "Open location"}
      onBlur={handleBlur}
      onClick={() => {
        handleClick();
        soundEvents.onClick();
      }}
      onFocus={soundEvents.onFocus}
      className={cn(
        "cursor-pointer absolute lg:w-[46px] lg:h-[46px] md:w-9 md:h-9 w-6 h-6 flex items-center justify-center group location-ping",
        className
      )}
    >
      <div className="bg-blurred backdrop-blur-xl transition-colors lg:w-[38px] lg:h-[38px] md:w-[30px] md:h-[30px] w-6 h-6 border border-foreground/50 flex items-center justify-center" />
      <div className="absolute bg-blurred transition-colors backdrop-blur-xl lg:w-[38px] lg:h-[38px] md:w-[30px] md:h-[30px] w-6 h-6 border border-foreground/50 rotate-45 flex items-center justify-center">
        <div
          className={cn(
            "md:w-2 w-1.5 md:h-2 h-1.5 rounded-full bg-foreground transition-transform ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-110 float-animation-class animate-pulse"
          )}
        />
      </div>
      <svg
        fill="none"
        viewBox="0 0 88 89"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "transition-transform ease-[cubic-bezier(.25,1,.5,1)] group-hover:scale-110 duration-[.6s] absolute -inset-[5px] z-20 text-foreground drop-shadow-[0_0_4px_rgba(255,255,255,0.7)]"
        )}
      >
        <g filter="url(#filter0_f_6587_3779)">
          <path
            fill="none"
            d="M79.2772 39.8839C85.1004 61.603 71.2873 75.883 45.8134 82.7045C26.5499 87.8629 13.5523 68.9115 8.57604 50.3515C3.11311 26.843 21.1028 12.7143 40.3664 7.55583C59.6299 2.3974 72.3952 14.2159 79.2772 39.8839Z"
            stroke="currentColor"
            className="rotate-svg-animation-reverse"
          ></path>
        </g>
        <path
          fill="none"
          className="rotate-svg-animation-reverse"
          d="M79.6823 40.689C85.4941 62.6302 71.6766 77.0648 46.2038 83.9693C26.9412 89.1905 13.955 70.0491 8.98853 51.2993C3.53783 27.5499 21.5312 13.2661 40.7938 8.04493C60.0564 2.82373 72.8138 14.7584 79.6823 40.689Z"
          stroke="currentColor"
        ></path>
        <path
          fill="none"
          opacity="0.4"
          className="rotate-svg-animation"
          d="M62.4666 15.6093C84.6472 25.7798 87.7796 45.5223 77.024 68.9216C68.8907 86.6163 44.3981 83.6003 25.4438 74.9092C1.98109 63.2791 1.68789 40.5466 9.82126 22.8519C17.9546 5.1572 36.2532 3.58968 62.4666 15.6093Z"
          stroke="currentColor"
        ></path>
        <defs>
          <filter
            id="filter0_f_6587_3779"
            x="3.08325"
            y="1.86932"
            width="82.0162"
            height="86.196"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="2"
              result="effect1_foregroundBlur_6587_3779"
            ></feGaussianBlur>
          </filter>
        </defs>
      </svg>
    </button>
  );
};

export default memo(LocationPing);
