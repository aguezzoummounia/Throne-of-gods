import { cn } from "@/lib/utils";
import ElementsSvgOutline from "../elements-svg-outline";
import { useInteractiveSound } from "@/hooks/useInteractiveSound";

interface AboutSelectorCardProps {
  title: string;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const AboutSelectorCard = ({
  title,
  onClick,
  children,
  className,
}: AboutSelectorCardProps) => {
  const soundEvents = useInteractiveSound();
  return (
    <button
      {...soundEvents}
      type="button"
      aria-label={title}
      className={cn(
        "relative md:w-[120px] w-[80px] aspect-[3/4] backdrop-blur-lg md:rounded-[10px] rounded-[8px] cursor-pointer transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)] hover:-translate-y-6",
        className
      )}
      onClick={() => {
        onClick();
        soundEvents.onClick();
      }}
    >
      {/* <ElementsSvgOutline /> */}
      {children}
    </button>
  );
};

export default AboutSelectorCard;
