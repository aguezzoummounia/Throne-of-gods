"use client";
import { cn } from "@/lib/utils";

interface AnswerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  animated?: boolean;
  className: string;
  onClick: () => void;
  children: React.ReactNode;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  onClick,
  animated,
  children,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative cursor-pointer bg-[rgba(0,0,0,.05)] backdrop-blur-xl group inline-flex gap-2 whitespace-normal break-words text-sm font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 group h-auto mix-blend-difference",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute h-[1px] w-[calc(100%_-_22px)] top-0 left-[50%] bg-bronze -translate-x-[50%]" />
        <div className="absolute h-[1px] w-[calc(100%_-_22px)] bottom-0 left-[50%] bg-bronze -translate-x-[50%]" />
        <div className="absolute w-[1px] h-[calc(100%_-_22px)] left-0 top-[50%] bg-bronze  -translate-y-[50%]" />
        <div className="absolute w-[1px] h-[calc(100%_-_22px)] right-0 top-[50%] bg-bronze  -translate-y-[50%]" />
      </div>
      <div className="absolute border border-bronze inset-[4px] group-hover:scale-101 transition-transform ease-[cubic-bezier(.16,1,.3,1)] duration-500" />
      <div className="absolute inset-0 ">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-bronze rounded-tl-full pointer-events-none rotate-180"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-bronze rounded-tr-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-bronze rounded-bl-full pointer-events-none rotate-180"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-bronze rounded-br-full pointer-events-none  rotate-180"></div>
      </div>

      <div className="w-full px-4 md:py-4 py-2 flex items-center justify-center text-xs leading-[1] min-h-14">
        {children}
      </div>
    </button>
  );
};

export default AnswerButton;
