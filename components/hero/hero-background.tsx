import { memo } from "react";
import { cn } from "@/lib/utils";
import HeroSVGs from "../svgs/hero-svgs";
import RadialAnimatedStrips from "../radial-animated-strips";
import type { DeviceCapabilityContextType } from "./hero-adaptive-shader";

interface HeroBackgroundProps {
  className?: string;
  deviceCapability: DeviceCapabilityContextType;
}

const HeroBackground = memo<HeroBackgroundProps>(
  ({ className, deviceCapability }) => {
    const isMobile = deviceCapability.capabilities?.isMobile;

    return (
      <div
        className={cn(
          "absolute inset-0 z-[-1] flex items-start justify-center mix-blend-difference",
          className
        )}
      >
        <RadialAnimatedStrips
          numberOfLines={isMobile ? 90 : 100}
          innerRadius={isMobile ? 150 : 50}
          outerRadiusMin={isMobile ? 200 : 100}
          outerRadiusMax={isMobile ? 500 : 500}
          strokeWidth={1}
          segmentLengthMin={3}
          segmentLengthMax={isMobile ? 10 : 5}
          gapLengthMin={10}
          gapLengthMax={25}
          animationDuration={4}
          className="absolute h-full md:w-[80vw] w-[130vw] text-bronze drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]"
        />
        <HeroSVGs className="w-[90%] md:w-[65vh]" />
      </div>
    );
  }
);

HeroBackground.displayName = "HeroBackground";

export default HeroBackground;
