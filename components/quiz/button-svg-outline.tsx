import { cn } from "@/lib/utils";

interface ElementsSvgOutlineProps {
  isActive?: boolean;
  className?: string;
}

interface SvgLineProps {
  className?: string;
}

const ButtonSvgOutline = ({ isActive, className }: ElementsSvgOutlineProps) => {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 text-bronze",
          isActive && "[&>svg]:drop-shadow-[0_0_4px_rgba(244,234,143,1)]"
        )}
      >
        <HorizontalLineSVG className="absolute h-[1px] w-[calc(100%_-_24px)] top-0 left-[50%] -translate-x-[50%]" />
        <HorizontalLineSVG className="absolute h-[1px] w-[calc(100%_-_24px)] bottom-0 left-[50%] -translate-x-[50%]" />

        <VerticalLineSVG className="absolute w-[1px] h-[calc(100%_-_24px)] left-0 top-[50%] text-bronze -translate-y-[50%]" />
        <VerticalLineSVG className="absolute w-[1px] h-[calc(100%_-_24px)] right-0 top-[50%] text-bronze -translate-y-[50%]" />
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "bg-bronze/30 backdrop-blur-xl absolute border border-bronze inset-[4px] group-hover:scale-101 transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-500",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,.5)]"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          isActive && "[&>div]:drop-shadow-[0_0_4px_rgba(244,234,143,1)]",
          className
        )}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-dashed border-l border-bronze rounded-tl-full pointer-events-none rotate-180"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-dashed border-r border-bronze rounded-tr-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-dashed border-l border-bronze rounded-bl-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-dashed border-r border-bronze rounded-br-full pointer-events-none  rotate-180"></div>
      </div>
    </>
  );
};

export default ButtonSvgOutline;

const HorizontalLineSVG = ({ className }: SvgLineProps) => {
  return (
    <svg
      className={cn("h-[1px] w-full", className)}
      viewBox="0 0 350 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  );
};

const VerticalLineSVG = ({ className }: SvgLineProps) => {
  return (
    <svg
      className={cn("w-[1px] h-full", className)}
      viewBox="0 0  1 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="40"
        x2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  );
};
