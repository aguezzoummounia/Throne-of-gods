"use client";
import { useMemo } from "react";

interface SunburstLine {
  key: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  segmentLength: number;
  gapLength: number;
}

interface RadialAnimatedStripsProps {
  numberOfLines?: number;
  innerRadius?: number;
  outerRadiusMin?: number;
  outerRadiusMax?: number;
  strokeWidth?: number;
  segmentLength?: number;
  gapLength?: number;
  segmentLengthMin?: number;
  segmentLengthMax?: number;
  gapLengthMin?: number;
  gapLengthMax?: number;
  animationDuration?: number; // in seconds
  className?: string;
}

const VIEWBOX_SIZE = 1000;

const RadialAnimatedStrips: React.FC<RadialAnimatedStripsProps> = ({
  numberOfLines = 150,
  innerRadius = 120,
  outerRadiusMin = 150,
  outerRadiusMax = 280,
  strokeWidth = 1,
  segmentLength = 5,
  gapLength = 15,
  segmentLengthMin,
  segmentLengthMax,
  gapLengthMin,
  gapLengthMax,
  animationDuration = 3,
  className = "",
}) => {
  const centerX = VIEWBOX_SIZE / 2;
  const centerY = VIEWBOX_SIZE / 2;

  // Memoize the generation of lines and their unique patterns.
  const lines = useMemo(() => {
    const generatedLines: SunburstLine[] = [];
    const minRadius = Math.min(outerRadiusMin, outerRadiusMax);
    const maxRadius = Math.max(outerRadiusMin, outerRadiusMax);

    // Determine ranges for segments and gaps, falling back to single values if min/max not provided.
    const sMin = segmentLengthMin ?? segmentLength;
    const sMax = segmentLengthMax ?? segmentLength;
    const gMin = gapLengthMin ?? gapLength;
    const gMax = gapLengthMax ?? gapLength;

    for (let i = 0; i < numberOfLines; i++) {
      const angle = (i / numberOfLines) * 2 * Math.PI;

      const outerRadius = minRadius + Math.random() * (maxRadius - minRadius);

      const x1 = centerX + innerRadius * Math.cos(angle);
      const y1 = centerY + innerRadius * Math.sin(angle);
      const x2 = centerX + outerRadius * Math.cos(angle);
      const y2 = centerY + outerRadius * Math.sin(angle);

      // Assign a random segment and gap length for each line.
      const currentSegmentLength = sMin + Math.random() * (sMax - sMin);
      const currentGapLength = gMin + Math.random() * (gMax - gMin);

      generatedLines.push({
        key: i,
        x1,
        y1,
        x2,
        y2,
        segmentLength: currentSegmentLength,
        gapLength: currentGapLength,
      });
    }
    return generatedLines;
  }, [
    numberOfLines,
    innerRadius,
    outerRadiusMin,
    outerRadiusMax,
    centerX,
    centerY,
    segmentLength,
    gapLength,
    segmentLengthMin,
    segmentLengthMax,
    gapLengthMin,
    gapLengthMax,
  ]);

  // A single, reusable keyframe animation that uses a CSS custom property.
  const keyframes = `
    @keyframes moveOutwards {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: var(--pattern-offset);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className={className}
        aria-hidden="true"
      >
        <g>
          {lines.map((line) => (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${line.segmentLength} ${line.gapLength}`}
              style={
                {
                  "--pattern-offset": -(line.segmentLength + line.gapLength),
                  animation: `moveOutwards ${animationDuration}s linear infinite`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default RadialAnimatedStrips;
