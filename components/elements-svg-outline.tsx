import { cn } from "@/lib/utils";

// TODO: add actual svg lines and change their color bases on parent's state

const ElementsSvgOutline: React.FC<{
  isActive?: boolean;
  className?: string;
}> = ({ isActive, className }) => {
  return (
    <>
      <div
        className={cn(
          "absolute inset-1",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      >
        <div className="absolute h-[1px] w-[calc(100%_-_22px)] top-0 left-[50%] bg-bronze-translate-x-[50%]" />
        <div className="absolute h-[1px] w-[calc(100%_-_22px)] bottom-0 left-[50%] bg-bronze-translate-x-[50%]" />
        <div className="absolute w-[1px] h-[calc(100%_-_22px)] left-0 top-[50%] bg-bronze -translate-y-[50%]" />
        <div className="absolute w-[1px] h-[calc(100%_-_22px)] right-0 top-[50%] bg-bronze -translate-y-[50%]" />
      </div>
      <div
        className={cn(
          "absolute border border-bronze inset-[8px] group-hover:scale-101 transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-500",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      />
      <div
        className={cn(
          "absolute inset-1 border-bronze",
          isActive && "drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]",
          className
        )}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-inherit rounded-tl-full pointer-events-none rotate-180"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-inherit rounded-tr-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-inherit rounded-bl-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-inherit rounded-br-full pointer-events-none rotate-180"></div>
      </div>
    </>
  );
};

export default ElementsSvgOutline;
