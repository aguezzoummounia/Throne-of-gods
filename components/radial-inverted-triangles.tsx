"use client";
import { cn } from "@/lib/utils";
import { useId, useEffect, useMemo, useState } from "react";

export default function RadialInvertedTriangles({
  blur = 3,
  segments = 6,
  mode = "wedges",
  strokeWidth = 2,
  outerPadding = 4,
  baseWidthDeg = 28,
  color = "#1a2935",
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

  // animation delay: start as "0s" so server/client HTML matches,
  // then set a random delay once mounted on the client.
  const [delay, setDelay] = useState("0s");
  useEffect(() => {
    setDelay(`${(Math.random() * 5).toFixed(3)}s`);
  }, []);

  const cx = 50;
  const cy = 50;
  const R = 50 - Math.max(outerPadding, strokeWidth * 0.75);
  const halfBase = baseWidthDeg / 2;

  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180; // start from top
    return [cx + R * Math.cos(rad), cy + R * Math.sin(rad)];
  };

  const step = 360 / segments;

  // Precompute triangles but normalize numbers with toFixed so the attribute
  // strings are identical between server and client.
  const triangles = useMemo(() => {
    const fmt = (n: number) => n.toFixed(4); // adjust precision as needed
    return Array.from({ length: segments }, (_, i) => {
      const a = i * step;
      const a1 = a - halfBase;
      const a2 = a + halfBase;
      const [x1n, y1n] = toXY(a1);
      const [x2n, y2n] = toXY(a2);

      // Control point shifted outward for a more rounded base (20%)
      const midX = (x1n + x2n) / 2;
      const midY = (y1n + y2n) / 2;
      const ctrlX = midX + (midX - cx) * 0.2;
      const ctrlY = midY + (midY - cy) * 0.2;

      const d = `M ${fmt(cx)},${fmt(cy)} L ${fmt(x1n)},${fmt(y1n)} Q ${fmt(
        ctrlX
      )},${fmt(ctrlY)} ${fmt(x2n)},${fmt(y2n)} Z`;

      return <path key={i} d={d} />;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, baseWidthDeg, outerPadding, strokeWidth, color, blur]);

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
