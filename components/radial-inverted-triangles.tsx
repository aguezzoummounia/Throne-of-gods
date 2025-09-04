import { cn } from "@/lib/utils";
import React, { useId } from "react";

export default function RadialInvertedTriangles({
  blur = 3,
  segments = 6,
  mode = "wedges",
  strokeWidth = 2,
  outerPadding = 4,
  baseWidthDeg = 28,
  color = "#1a2935",
  // # 314859
  background = "transparent",
  className = "w-64 aspect-square",
}: {
  segments?: number;
  baseWidthDeg?: number;
  outerPadding?: number;
  strokeWidth?: number;
  color?: string;
  background?: string;
  mode?: "wedges" | "cutouts";
  blur?: number;
  className?: string;
}) {
  const id = useId();

  const cx = 50;
  const cy = 50;
  const R = 50 - Math.max(outerPadding, strokeWidth * 0.75);
  const halfBase = baseWidthDeg / 2;

  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180; // start from top
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)];
  };

  const step = 360 / segments;

  const triangles = Array.from({ length: segments }, (_, i) => {
    const a = i * step;
    const a1 = a - halfBase;
    const a2 = a + halfBase;
    const [x1, y1] = toXY(a1);
    const [x2, y2] = toXY(a2);

    // Control point shifted outward for a more rounded base (20% instead of 30%)
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const ctrlX = midX + (midX - cx) * 0.2;
    const ctrlY = midY + (midY - cy) * 0.2;

    const d = `M ${cx},${cy} L ${x1},${y1} Q ${ctrlX},${ctrlY} ${x2},${y2} Z`;

    return <path key={i} d={d} />;
  });
  const delay = `${Math.random() * 5}s`;

  return (
    <div
      style={{ animationDelay: delay }}
      className={cn("w-full h-full rotate-infinite", className)}
    >
      <svg
        role="img"
        viewBox="-5 -5 110 110"
        className={"w-full h-full rotate-opacity"}
        aria-label={`${segments} inverted triangles inside a circle`}
      >
        <defs>
          <filter id={`blur-${id}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
          </filter>
        </defs>

        {mode === "cutouts" ? (
          <>
            <mask id={`cutout-${id}`}>
              <rect x="-5" y="-5" width="110" height="110" fill="white" />
              <g fill="black" filter={`url(#blur-${id})`}>
                {triangles}
              </g>
            </mask>
            <g mask={`url(#cutout-${id})`}>
              <circle cx={cx} cy={cy} r={R} fill={background} />
            </g>
          </>
        ) : (
          <>
            <circle cx={cx} cy={cy} r={R} fill={background} />
            <g fill={color} stroke="none" filter={`url(#blur-${id})`}>
              {triangles}
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
