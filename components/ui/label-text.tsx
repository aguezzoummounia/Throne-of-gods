import { cn } from "@/lib/utils";

const LabelText: React.FC<{
  className?: string;
  children: React.ReactNode;
  showWrapperLeft?: boolean;
  showWrapperRight?: boolean;
}> = ({
  children,
  className,
  showWrapperLeft = true,
  showWrapperRight = true,
  ...props
}) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      {showWrapperLeft && (
        <div className="md:w-[90px] w-[70px] relative left-wavy-indicator h-[12px] flex items-center justify-end">
          {renderSVG("left")}
        </div>
      )}
      {children}
      {showWrapperRight && (
        <div className="md:w-[90px] w-[70px] relative right-wavy-indicator h-[12px] flex items-center justify-start">
          {renderSVG("right")}
        </div>
      )}
    </div>
  );
};

export default LabelText;

const renderSVG = (direction: "left" | "right") => {
  switch (direction) {
    case "left":
      return (
        <svg
          fill="none"
          viewBox="0 0 116 16"
          xmlns="http://www.w3.org/2000/svg"
          className="text-bronze/50 drop-shadow-[0_0_4px_rgba(244,234,143,0.7)] w-[100px] h-[16px]"
        >
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
        </svg>
      );
    case "right":
      return (
        <svg
          fill="none"
          viewBox="0 0 116 16"
          xmlns="http://www.w3.org/2000/svg"
          className="text-bronze/50 drop-shadow-[0_0_4px_rgba(244,234,143,0.7)] w-[100px] h-[16px]"
        >
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
        </svg>
      );

    default:
      return (
        <svg
          fill="none"
          viewBox="0 0 116 16"
          xmlns="http://www.w3.org/2000/svg"
          className="text-bronze/50 drop-shadow-[0_0_4px_rgba(244,234,143,0.7)] w-[100px] h-[16px]"
        >
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
        </svg>
      );
  }
};
