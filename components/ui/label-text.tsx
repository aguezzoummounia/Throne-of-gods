import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface LabelTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showWrapperLeft?: boolean;
  showWrapperRight?: boolean;
  leftSvgRef?: React.RefObject<SVGSVGElement | null>;
  rightSvgRef?: React.RefObject<SVGSVGElement | null>;
  leftMaskRef?: React.RefObject<SVGRectElement | null>;
  rightMaskRef?: React.RefObject<SVGRectElement | null>;
  svgClassName?: string;
}

const LeftSVG = forwardRef<
  SVGSVGElement,
  { className?: string; maskRef?: React.RefObject<SVGRectElement | null> }
>(({ className, maskRef }, ref) => (
  <svg
    ref={ref}
    fill="none"
    viewBox="0 0 116 16"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "text-bronze drop-shadow-[0_0_4px_rgba(244,234,143,0.7)] w-[100px] h-[16px]",
      className
    )}
    aria-hidden="true"
  >
    <defs>
      <mask id="leftArrowMask">
        <rect ref={maskRef} x="116" y="0" width="0" height="16" fill="white" />
      </mask>
    </defs>
    <g mask="url(#leftArrowMask)">
      <line
        x1="10.5"
        y1="7.5"
        x2="107.5"
        y2="7.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeDasharray="1 2 3 4"
      />
      <path d="M0 8L7.5 3.66987L7.5 12.3301L0 8Z" fill="currentColor" />
      <circle
        cx="108"
        cy="8"
        r="8"
        transform="rotate(-180 108 8)"
        fill="currentColor"
      />
      <circle
        cx="89"
        cy="8"
        r="4"
        transform="rotate(-180 89 8)"
        fill="currentColor"
      />
    </g>
  </svg>
));

LeftSVG.displayName = "LeftSVG";

const RightSVG = forwardRef<
  SVGSVGElement,
  { className?: string; maskRef?: React.RefObject<SVGRectElement | null> }
>(({ className, maskRef }, ref) => (
  <svg
    ref={ref}
    fill="none"
    viewBox="0 0 116 16"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      "text-bronze drop-shadow-[0_0_4px_rgba(244,234,143,0.7)] w-[100px] h-[16px]",
      className
    )}
    aria-hidden="true"
  >
    <defs>
      <mask id="rightArrowMask">
        <rect ref={maskRef} x="0" y="0" width="0" height="16" fill="white" />
      </mask>
    </defs>
    <g mask="url(#rightArrowMask)">
      <line
        x1="105.5"
        y1="8.5"
        x2="8.5"
        y2="8.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeDasharray="1 2 3 4"
      />
      <path d="M116 8L108.5 12.3301V3.66987L116 8Z" fill="currentColor" />
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <circle cx="27" cy="8" r="4" fill="currentColor" />
    </g>
  </svg>
));

RightSVG.displayName = "RightSVG";

const LabelText = ({
  children,
  className,
  showWrapperLeft = true,
  showWrapperRight = true,
  leftSvgRef,
  rightSvgRef,
  leftMaskRef,
  rightMaskRef,
  svgClassName,
  ...props
}: LabelTextProps) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      {showWrapperLeft && (
        <div className="md:w-[90px] w-[70px] relative left-wavy-indicator h-[12px] flex items-center justify-end">
          <LeftSVG
            ref={leftSvgRef}
            maskRef={leftMaskRef}
            className={svgClassName}
          />
        </div>
      )}
      {children}
      {showWrapperRight && (
        <div className="md:w-[90px] w-[70px] relative right-wavy-indicator h-[12px] flex items-center justify-start">
          <RightSVG
            ref={rightSvgRef}
            maskRef={rightMaskRef}
            className={svgClassName}
          />
        </div>
      )}
    </div>
  );
};

export default LabelText;
