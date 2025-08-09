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
    <div
      className={cn("font-alegreya uppercase flex gap-2.5 relative", className)}
    >
      {showWrapperLeft && (
        <div className="md:w-[90px] w-[70px] relative">
          <AnimatedUnderline className="bottom-[50%] translate-y-[50%] text-foreground" />
        </div>
      )}
      <div className="" {...props}>
        {children}
      </div>
      {showWrapperRight && (
        <div className="md:w-[90px] w-[70px] relative">
          <AnimatedUnderline className="bottom-[50%] translate-y-[50%] text-foreground" />
        </div>
      )}
    </div>
  );
};

export default LabelText;
