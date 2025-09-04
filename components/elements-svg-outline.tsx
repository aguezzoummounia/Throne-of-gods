import { cn } from "@/lib/utils";
interface ElementsSvgOutlineProps {
  size?: "default" | "large";
  isActive?: boolean;
  className?: string;
}

interface SvgLineProps {
  size: "default" | "large";
  className?: string;
}

const ElementsSvgOutline = ({
  size = "default",
  isActive,
  className,
}: ElementsSvgOutlineProps) => {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-1 text-bronze",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      >
        <HorizontalLineSVG
          size={size}
          className="absolute h-[1px] w-[calc(100%_-_22px)] top-0 left-[50%]  -translate-x-[50%]"
        />
        <HorizontalLineSVG
          size={size}
          className="absolute h-[1px] w-[calc(100%_-_22px)] bottom-0 left-[50%]  -translate-x-[50%]"
        />

        <VerticalLineSVG
          size={size}
          className="absolute w-[1px] h-[calc(100%_-_22px)] left-0 top-[50%]  -translate-y-[50%]"
        />
        <VerticalLineSVG
          size={size}
          className="absolute w-[1px] h-[calc(100%_-_22px)] right-0 top-[50%]  -translate-y-[50%]"
        />
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "inner-border absolute inset-[8px] border-bronze border group-hover:scale-101 transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-500",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      ></div>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-1 border-bronze",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-dashed border-inherit rounded-tl-full pointer-events-none rotate-180"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-dashed border-inherit rounded-tr-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-dashed border-inherit rounded-bl-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-dashed border-inherit rounded-br-full pointer-events-none rotate-180"></div>
      </div>
    </>
  );
};

export default ElementsSvgOutline;

const HorizontalLineSVG = ({ size, className }: SvgLineProps) => {
  return size === "large" ? (
    <svg
      className={cn("h-[1px] w-full", className)}
      viewBox="0 0 1800 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        y1="0.5"
        x2="1800"
        y2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  ) : (
    <svg
      className={cn("h-[1px] w-full", className)}
      viewBox="0 0 250 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        y1="0.5"
        x2="250"
        y2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  );
};

const VerticalLineSVG = ({ size = "large", className }: SvgLineProps) => {
  return size === "large" ? (
    <svg
      className={cn("w-[1px] h-full", className)}
      viewBox="0 0 1 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="700"
        x2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  ) : (
    <svg
      className={cn("w-[1px] h-full", className)}
      viewBox="0 0 1 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="0.5"
        y1="400"
        x2="0.5"
        stroke="currentColor"
        strokeDasharray="2 4 6 8"
      />
    </svg>
  );
};
