import { useRef } from "react";
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

export default function ConnectedCardsCustomAnchors({
  powers,
}: PowersContainerProps) {
  const numCards = powers.length;
  const positions = power_item_positions[numCards as ValidCardCount] || [];

  // Refs managed by the component
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const { connections, pathRefs } = useConnectedAnchors({
    containerRef,
    cardRefs,
    customPathSets: CUSTOM_PATH_SETS,
    itemCount: numCards,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative  w-full text-bronze",
        powers.length === 4 && "md:min-h-[120vh] min-h-[1500px]",
        powers.length === 3 && "md:min-h-[100vh] min-h-[1100px]",
        powers.length === 2 && "md:min-h-[60vh] min-h-[740px]",
        powers.length === 1 && "md:min-h-[50vh] min-h-[400px]"
      )}
    >
      {powers.map((power, index) => {
        const position = positions[index] ? positions[index].item : "";

        return (
          <div
            key={`power-card-${index}`}
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

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
            <g key={i} transform={transform}>
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
      </svg>
    </div>
  );
}
