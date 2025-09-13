import { useState, useRef, useEffect, RefObject } from "react";

type Point = { x: number; y: number };
export type Connection = {
  start: Point;
  end: Point;
  d: string;
};

interface UseConnectedAnchorsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<Array<HTMLDivElement | null>>;
  customPathSets: {
    mobile: string[];
    tablet: string[];
    medium: string[];
    desktop: string[];
  };
  itemCount: number;
}

const ANIM_DURATION = 2000;
const EASE = "cubic-bezier(.2,.9,.2,1)";

const getAnchor = (
  el: Element,
  parentRect: DOMRect,
  pos: "top" | "bottom" | "left" | "right" | "center"
): Point => {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2 - parentRect.left;
  const cy = r.top + r.height / 2 - parentRect.top;

  switch (pos) {
    case "top":
      return { x: cx, y: r.top - parentRect.top };
    case "bottom":
      return { x: cx, y: r.bottom - parentRect.top };
    case "left":
      return { x: r.left - parentRect.left, y: cy };
    case "right":
      return { x: r.right - parentRect.left, y: cy };
    default:
      return { x: cx, y: cy };
  }
};

export function useConnectedAnchors({
  containerRef,
  cardRefs,
  customPathSets,
  itemCount,
}: UseConnectedAnchorsProps) {
  const [points, setPoints] = useState<{ [key: string]: Point }>({});
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const timeouts = useRef<number[]>([]);
  const [breakpoint, setBreakpoint] = useState<
    "mobile" | "tablet" | "medium" | "desktop"
  >("desktop");

  // Effect for calculating anchor points on resize
  useEffect(() => {
    const recompute = () => {
      const container = containerRef.current;
      const cards = cardRefs.current;
      if (!container || !cards) return;

      const parentRect = container.getBoundingClientRect();
      const width = window.innerWidth;

      let currentBreakpoint: typeof breakpoint = "desktop";
      if (width < 768) currentBreakpoint = "mobile";
      else if (width < 1024) currentBreakpoint = "tablet";
      else if (width < 1600) currentBreakpoint = "medium";
      setBreakpoint(currentBreakpoint);

      const isMobile = currentBreakpoint === "mobile";
      const newPoints: { [key: string]: Point } = {};

      // Optimized and safer logic for point calculation
      if (itemCount === 2 && cards[0] && cards[1]) {
        if (isMobile) {
          const card1Rect = cardRefs.current[0]!.getBoundingClientRect();
          newPoints.a1 = {
            x: card1Rect.left - parentRect.left + card1Rect.width * 0.3,
            y: card1Rect.bottom - parentRect.top,
          };
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "left");
        } else {
          newPoints.a1 = getAnchor(cardRefs.current[0]!, parentRect, "right");
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "left");
        }
      } else if (itemCount === 3 && cards[0] && cards[1] && cards[2]) {
        if (isMobile) {
          const card1Rect = cardRefs.current[0]!.getBoundingClientRect();
          const card2Rect = cardRefs.current[1]!.getBoundingClientRect();

          newPoints.a1 = {
            x: card1Rect.left - parentRect.left + card1Rect.width * 0.3,
            y: card1Rect.bottom - parentRect.top,
          };
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "left");
          newPoints.a2 = {
            x: card2Rect.left - parentRect.left + card2Rect.width * 0.7,
            y: card2Rect.bottom - parentRect.top,
          };
          newPoints.b2 = getAnchor(cardRefs.current[2]!, parentRect, "right");
        } else {
          const commonStartPoint = getAnchor(
            cardRefs.current[0]!,
            parentRect,
            "right"
          );
          newPoints.a2 = commonStartPoint;
          newPoints.b2 = getAnchor(cardRefs.current[2]!, parentRect, "top");
          newPoints.a1 = commonStartPoint;
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "top");
        }
      } else if (
        itemCount >= 4 &&
        cards[0] &&
        cards[1] &&
        cards[2] &&
        cards[3]
      ) {
        if (isMobile) {
          const card1Rect = cardRefs.current[0]!.getBoundingClientRect();
          const card2Rect = cardRefs.current[1]!.getBoundingClientRect();
          const card3Rect = cardRefs.current[2]!.getBoundingClientRect();
          newPoints.a1 = {
            x: card1Rect.left - parentRect.left + card1Rect.width * 0.3,
            y: card1Rect.bottom - parentRect.top,
          };
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "left");
          newPoints.a2 = {
            x: card2Rect.left - parentRect.left + card2Rect.width * 0.7,
            y: card2Rect.bottom - parentRect.top,
          };
          newPoints.b2 = getAnchor(cardRefs.current[2]!, parentRect, "right");
          newPoints.a3 = {
            x: card3Rect.left - parentRect.left + card3Rect.width * 0.3,
            y: card3Rect.bottom - parentRect.top,
          };
          newPoints.b3 = getAnchor(cardRefs.current[3]!, parentRect, "left");
        } else {
          const commonStartPoint = getAnchor(
            cardRefs.current[0]!,
            parentRect,
            "bottom"
          );
          newPoints.a1 = commonStartPoint;
          newPoints.b1 = getAnchor(cardRefs.current[1]!, parentRect, "left");
          newPoints.a2 = commonStartPoint;
          newPoints.b2 = getAnchor(cardRefs.current[2]!, parentRect, "right");
          newPoints.a3 = commonStartPoint;
          newPoints.b3 = getAnchor(cardRefs.current[3]!, parentRect, "top");
        }
      }
      setPoints(newPoints);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    cardRefs.current?.forEach((el) => el && ro.observe(el));

    return () => ro.disconnect();
  }, [containerRef, cardRefs, itemCount]);

  // Effect for running the line-drawing animation
  useEffect(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    pathRefs.current.forEach((pathEl) => {
      if (!pathEl) return;
      pathEl.style.transition = "none";
      const totalLen = pathEl.getTotalLength() ?? 0;
      pathEl.style.strokeDasharray = `${totalLen}`;
      pathEl.style.strokeDashoffset = `${totalLen}`;
      pathEl.getBoundingClientRect(); // Force reflow
    });

    let delay = 80;
    pathRefs.current.forEach((pathEl, i) => {
      if (!pathEl) return;
      const id = window.setTimeout(() => {
        pathEl.style.transition = `stroke-dashoffset ${ANIM_DURATION}ms ${EASE}`;
        pathEl.style.strokeDashoffset = "0";
      }, delay);
      timeouts.current.push(id);
      if (breakpoint === "mobile") delay += ANIM_DURATION;
    });

    return () => timeouts.current.forEach(clearTimeout);
  }, [points, breakpoint]); // Re-run animation if points or breakpoint change

  // Memoize the final connections array
  const connections = (() => {
    const customPaths = customPathSets[breakpoint];
    return [
      { start: points.a1, end: points.b1, d: customPaths?.[0] },
      { start: points.a2, end: points.b2, d: customPaths?.[1] },
      { start: points.a3, end: points.b3, d: customPaths?.[2] },
    ].filter((c): c is Connection => !!(c.start && c.end && c.d));
  })();

  return { connections, pathRefs };
}
