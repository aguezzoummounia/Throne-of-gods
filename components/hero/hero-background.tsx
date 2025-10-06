import { cn } from "@/lib/utils";
import HeroSVGs from "../svgs/hero-svgs";

interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground = ({ className }: HeroBackgroundProps) => {
  return (
    <div
      className={cn(
        "md:[&>svg]:w-[65vh] [&>svg]:w-[90%] mix-blend-difference absolute inset-0 flex items-start justify-center z-[-1]",
        className
      )}
    >
      <HeroSVGs />
    </div>
  );
};

export default HeroBackground;
