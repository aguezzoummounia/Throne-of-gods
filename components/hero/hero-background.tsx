import { cn } from "@/lib/utils";
import HeroShape from "./hero-shape";
import HeroShapeCSS from "./hero-shape-css";

interface HeroBackgroundProps {
  className?: string;
}

const HeroBackground = ({ className }: HeroBackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 -z-1", className)}>
      <HeroShape />
      {/* FALLBACK in case optimized shader still doesn't work on mobile */}
      {/* <HeroShapeCSS /> */}
    </div>
  );
};

export default HeroBackground;
