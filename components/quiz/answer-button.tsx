"use client";
import { cn } from "@/lib/utils";
import ButtonSvgOutline from "./button-svg-outline";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

interface AnswerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  isActive: boolean;
  animated?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const AnswerButton: React.FC<AnswerButtonProps> = ({
  onClick,
  animated,
  children,
  isActive,
  className,
  ...props
}) => {
  const soundEvents = useInteractiveSound();
  return (
    <button
      onClick={() => {
        onClick();
        soundEvents.onClick();
      }}
      aria-pressed={isActive}
      className={cn(
        "bg-[rgba(0,0,0,.05)] backdrop-blur-xl relative cursor-pointer group inline-flex gap-2 whitespace-normal break-words text-sm font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 group h-auto mix-blend-difference",
        className
      )}
      {...props}
    >
      <ButtonSvgOutline isActive={isActive} />
      <div
        className={cn(
          "w-full px-4 md:py-4 py-2 flex items-center justify-center text-xs leading-tight min-h-14",
          isActive && "text-white"
        )}
      >
        {children}
      </div>
    </button>
  );
};

export default AnswerButton;
