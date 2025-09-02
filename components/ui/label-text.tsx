import { cn } from "@/lib/utils";
import AnimatedUnderline from "./animated-underline";

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
        <div className="md:w-[90px] w-[70px] relative left-wavy-indicator border-r border-foreground h-[12px] flex items-center justify-end">
          <div className="w-1 h-1 rounded-full bg-foreground" />
          <AnimatedUnderline className="bottom-[50%] translate-y-[50%] text-foreground" />
        </div>
      )}
      {children}
      {showWrapperRight && (
        <div className="md:w-[90px] w-[70px] relative right-wavy-indicator border-l border-foreground h-[12px] flex items-center justify-start">
          <div className="w-1 h-1 rounded-full bg-foreground/80" />
          <AnimatedUnderline className="bottom-[50%] translate-y-[50%] text-foreground" />
        </div>
      )}
    </div>
  );
};

export default LabelText;
