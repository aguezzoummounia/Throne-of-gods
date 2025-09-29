import { useRef, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Power } from "@/lib/types";
import PowerCard from "./power-card";
import { power_item_positions } from "@/lib/consts";
import { useConnectedAnchors } from "@/hooks/useConnectedAnchors";

interface PowersContainerProps {
  powers: Power[];
}

type ValidCardCount = keyof typeof power_item_positions;

const BASE_WIDTH = 100;
const CUSTOM_PATH_SETS = {
  mobile: [
    "M 0 0 C 0 0, 60 30, 100 0",
    "M 0 0 C 0 0, 60 -30, 100 0",
    "M 0 0 C 0 0, 60 30, 100 0",
  ],
  tablet: [
    "M 0 0 C 40 40, 60 -20, 100 0",
    "M 0 0 C 0 0, 70 -30, 100 0",
    "M 0 0 C 30 10, 60 -20, 100 0",
  ],
  medium: [
    "M 0 0 C 30 30, 60 -20, 100 0",
    "M 0 0 C 60 -30, 50 10, 100 0",
    "M 0 0 C 70 30, 60 -20, 100 0",
  ],
  desktop: [
    "M 0 0 C 25 30, 60 -20, 100 0",
    "M 0 0 C 55 -40, 50 10, 100 0",
    "M 0 0 C 55 40, 50 -40, 100 0",
  ],
};

const SVG_STYLES = `
  @keyframes dotPulse {
    0%, 100% { 
      opacity: 0.7;
    }
    50% { 
      opacity: 1;
    }
  }
  @keyframes dotFadeIn {
    0% { 
      opacity: 0;
    }
    100% { 
      opacity: 0.7;
    }
  }
  .connection-dot {
    animation: dotPulse 2s ease-in-out infinite;
  }
  .connection-dot--hidden {
    opacity: 0;
    animation: none;
  }
  .connection-dot--animating-in {
    animation: dotFadeIn 0.4s ease-out forwards;
  }
` as const;

const ConnectedCardsCustomAnchors = memo(function ConnectedCardsCustomAnchors({
  powers,
}: PowersContainerProps) {
  const numCards = powers.length;

  // Memoize positions to prevent unnecessary recalculations
  const positions = useMemo(
    () => power_item_positions[numCards as ValidCardCount] || [],
    [numCards]
  );

  // Memoize container height classes
  const containerHeightClasses = useMemo(() => {
    const heightMap = {
      4: "md:min-h-[120vh] min-h-[1500px]",
      3: "md:min-h-[100vh] min-h-[1100px]",
      2: "md:min-h-[60vh] min-h-[740px]",
      1: "md:min-h-[50vh] min-h-[400px]",
    } as const;

    return heightMap[numCards as keyof typeof heightMap] || "";
  }, [numCards]);

  // Refs managed by the component
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { connections, pathRefs, dotRefs } = useConnectedAnchors({
    containerRef,
    cardRefs,
    customPathSets: CUSTOM_PATH_SETS,
    itemCount: numCards,
  });

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full text-bronze", containerHeightClasses)}
    >
      {powers.map((power, index) => {
        const position = positions[index]?.item || "";

        return (
          <div
            key={power.name || `power-card-${index}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`${position} absolute md:w-[250px] w-[230px] aspect-[2/3]`}
          >
            <PowerCard
              name={power.name}
              image={power.image}
              overview={power.overview}
            />
          </div>
        );
      })}

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2] drop-shadow-[0_0_4px_rgba(244,234,143,0.5)]">
        <defs>
          <style>{SVG_STYLES}</style>
        </defs>

        {connections.map(({ start, end, d }, i) => {
          // 1. Calculate distance and angle between the two points
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distance = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          // 2. Calculate the scale factor
          const scale = distance / BASE_WIDTH;

          // 3. Create the transform string
          // Order is important: Move to place, rotate into position, then scale
          const transform = `translate(${start.x}, ${start.y}) rotate(${angle}) scale(${scale}, ${scale})`;

          return (
            <g key={`connection-${i}`} transform={transform}>
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={d} // Use the static, normalized path string
                fill="none"
                strokeWidth={1 / scale} // Counter-scale the stroke so it's always 1px wide
                strokeLinecap="round"
                stroke="currentColor"
              />
            </g>
          );
        })}

        {/* Pulsing dots at connection points */}
        {connections.map(({ start, end }, i) => (
          <g key={`dots-${i}`}>
            {/* Start dot */}
            <circle
              ref={(el) => {
                dotRefs.current[i * 2] = el;
              }}
              cx={start.x}
              cy={start.y}
              r="4"
              strokeWidth="1"
              fill="currentColor"
              className="connection-dot connection-dot--hidden stroke-foreground/30"
            />
            {/* End dot */}
            <circle
              ref={(el) => {
                dotRefs.current[i * 2 + 1] = el;
              }}
              cx={end.x}
              cy={end.y}
              r="4"
              strokeWidth="1"
              fill="currentColor"
              className="connection-dot connection-dot--hidden stroke-foreground/30"
            />
          </g>
        ))}
      </svg>
    </div>
  );
});

export default ConnectedCardsCustomAnchors;
