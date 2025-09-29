import {
  useState,
  useRef,
  useEffect,
  RefObject,
  useCallback,
  useMemo,
} from "react";

type Point = { x: number; y: number };

export type Connection = {
  start: Point;
  end: Point;
  d: string;
};

type Breakpoint = "mobile" | "tablet" | "medium" | "desktop";

type AnchorPosition = "top" | "bottom" | "left" | "right" | "center";

interface UseConnectedAnchorsProps {
  containerRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<Array<HTMLDivElement | null>>;
  customPathSets: Record<Breakpoint, string[]>;
  itemCount: number;
}

// Animation constants
const ANIM_DURATION = 3000;
const EASE = "cubic-bezier(.2,.9,.2,1)";
const INITIAL_DELAY = 200;
const DOT_START_DELAY = 100;
const DOT_END_DELAY = 200;
const DESKTOP_STAGGER_DELAY = 300;

// Breakpoint constants
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  MEDIUM: 1600,
} as const;

const getAnchor = (
  el: Element,
  parentRect: DOMRect,
  pos: AnchorPosition
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
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const timeouts = useRef<number[]>([]);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  // Intersection Observer for viewport detection - triggers when first card is fully visible
  useEffect(() => {
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 1.0, // Trigger when 100% of the first card is visible
        rootMargin: "0px", // No margin - wait for full card visibility
      }
    );

    observer.observe(firstCard);
    return () => observer.disconnect();
  }, [hasAnimated, cardRefs]);

  // Optimized recompute function with useCallback
  const recompute = useCallback(() => {
    const container = containerRef.current;
    const cards = cardRefs.current;
    if (!container || !cards) return;

    const parentRect = container.getBoundingClientRect();
    const width = window.innerWidth;

    let currentBreakpoint: Breakpoint = "desktop";
    if (width < BREAKPOINTS.MOBILE) currentBreakpoint = "mobile";
    else if (width < BREAKPOINTS.TABLET) currentBreakpoint = "tablet";
    else if (width < BREAKPOINTS.MEDIUM) currentBreakpoint = "medium";
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
    } else if (itemCount >= 4 && cards[0] && cards[1] && cards[2] && cards[3]) {
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
  }, [containerRef, cardRefs, itemCount, breakpoint]);

  // Effect for calculating anchor points on resize
  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    cardRefs.current?.forEach((el) => el && ro.observe(el));

    return () => ro.disconnect();
  }, [recompute]);

  // Effect for running the line-drawing animation only when in view
  useEffect(() => {
    if (!isInView) return;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    // Initialize all paths to be hidden
    pathRefs.current.forEach((pathEl) => {
      if (!pathEl) return;
      pathEl.style.transition = "none";
      const totalLen = pathEl.getTotalLength() ?? 0;
      pathEl.style.strokeDasharray = `${totalLen}`;
      pathEl.style.strokeDashoffset = `${totalLen}`;
      pathEl.getBoundingClientRect(); // Force reflow
    });

    // Initialize all dots to be hidden (ensure they have the hidden class)
    dotRefs.current.forEach((dotEl) => {
      if (!dotEl) return;
      dotEl.classList.add("connection-dot--hidden");
      dotEl.classList.remove("connection-dot");
    });

    // Animate paths and dots with staggered delay
    let delay = INITIAL_DELAY;
    pathRefs.current.forEach((pathEl, index) => {
      if (!pathEl) return;

      // Animate path
      const pathId = window.setTimeout(() => {
        pathEl.style.transition = `stroke-dashoffset ${ANIM_DURATION}ms ${EASE}`;
        pathEl.style.strokeDashoffset = "0";
      }, delay);
      timeouts.current.push(pathId);

      // Animate dots after path animation completes
      const dotStartDelay = delay + ANIM_DURATION + DOT_START_DELAY;
      const dotEndDelay = delay + ANIM_DURATION + DOT_END_DELAY;

      // Start dot (index * 2) - animate in with scale
      const startDotId = window.setTimeout(() => {
        const startDot = dotRefs.current[index * 2];
        if (startDot) {
          startDot.classList.remove("connection-dot--hidden");
          startDot.classList.add("connection-dot--animating-in");

          // After scale-in animation completes, switch to pulse animation
          const pulseId = window.setTimeout(() => {
            startDot.classList.remove("connection-dot--animating-in");
            startDot.classList.add("connection-dot");
          }, 400); // Match the dotScaleIn animation duration
          timeouts.current.push(pulseId);
        }
      }, dotStartDelay);
      timeouts.current.push(startDotId);

      // End dot (index * 2 + 1) - animate in with scale
      const endDotId = window.setTimeout(() => {
        const endDot = dotRefs.current[index * 2 + 1];
        if (endDot) {
          endDot.classList.remove("connection-dot--hidden");
          endDot.classList.add("connection-dot--animating-in");

          // After scale-in animation completes, switch to pulse animation
          const pulseId = window.setTimeout(() => {
            endDot.classList.remove("connection-dot--animating-in");
            endDot.classList.add("connection-dot");
          }, 400); // Match the dotScaleIn animation duration
          timeouts.current.push(pulseId);
        }
      }, dotEndDelay);
      timeouts.current.push(endDotId);

      if (breakpoint === "mobile") delay += ANIM_DURATION;
      else delay += DESKTOP_STAGGER_DELAY;
    });

    return () => timeouts.current.forEach(clearTimeout);
  }, [isInView, points, breakpoint]); // Only animate when in view and points are ready

  // Memoize the final connections array
  const connections = useMemo(() => {
    const customPaths = customPathSets[breakpoint];
    return [
      { start: points.a1, end: points.b1, d: customPaths?.[0] },
      { start: points.a2, end: points.b2, d: customPaths?.[1] },
      { start: points.a3, end: points.b3, d: customPaths?.[2] },
    ].filter((c): c is Connection => !!(c.start && c.end && c.d));
  }, [points, customPathSets, breakpoint]);

  return { connections, pathRefs, dotRefs };
}
