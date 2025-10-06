import { cn } from "@/lib/utils";
import MapSvgs from "../svgs/map-svgs";

interface MapBackgroundProp {
  className?: string;
}

const MapBackground = ({ className }: MapBackgroundProp) => {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-start justify-center z-[-1]",
        className
      )}
    >
      <MapSvgs />
    </div>
  );
};

export default MapBackground;
