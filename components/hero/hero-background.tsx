import { cn } from "@/lib/utils";
import HeroShape from "./hero-shape";

interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground = ({ className }: HeroBackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 -z-1", className)}>
      <HeroShape />
    </div>
  );
};

export default HeroBackground;
