import { cn } from "@/lib/utils";
import { Power } from "@/lib/types";
import PowerCard from "./power-card";
import { power_item_positions } from "@/lib/consts";
import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
interface PowersContainerProps {
  powers: Power[];
}
type ValidCardCount = keyof typeof power_item_positions;

export default function ConnectedCardsCustomAnchors({
  powers,
}: PowersContainerProps) {
  const numCards = powers.length;
  const EASE = "cubic-bezier(.2,.9,.2,1)";
  const positions = power_item_positions[numCards as ValidCardCount] || [];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([
    null,
    null,
    null,
    null,
  ]);
  const [points, setPoints] = useState<{ [key: string]: Point }>({});
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const timeouts = useRef<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const ANIM_DURATION = 2000;

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
      case "center":
      default:
        return { x: cx, y: cy };
    }
  };

  const recompute = () => {
    const container = containerRef.current;
    if (!container) return;
    const parentRect = container.getBoundingClientRect();

    const mobileCheck = window.innerWidth < 768;
    setIsMobile(mobileCheck);

    if (cardRefs.current.every((c) => c)) {
      if (mobileCheck) {
        const card1Rect = cardRefs.current[0]!.getBoundingClientRect();
        const card2Rect = cardRefs.current[1]!.getBoundingClientRect();
        const card3Rect = cardRefs.current[2]!.getBoundingClientRect();
        const customA1: Point = {
          x: card1Rect.left - parentRect.left + card1Rect.width * 0.3,
          y: card1Rect.bottom - parentRect.top,
        };
        const customA2: Point = {
          x: card2Rect.left - parentRect.left + card2Rect.width * 0.7,
          y: card2Rect.bottom - parentRect.top,
        };
        const customA3: Point = {
          x: card3Rect.left - parentRect.left + card3Rect.width * 0.3,
          y: card3Rect.bottom - parentRect.top,
        };
        setPoints({
          a1: customA1,
          b1: getAnchor(cardRefs.current[1]!, parentRect, "left"),
          a2: customA2,
          b2: getAnchor(cardRefs.current[2]!, parentRect, "right"),
          a3: customA3,
          b3: getAnchor(cardRefs.current[3]!, parentRect, "left"),
        });
      } else {
        const commonStartPoint = getAnchor(
          cardRefs.current[0]!,
          parentRect,
          "bottom"
        );
        setPoints({
          a1: commonStartPoint,
          b1: getAnchor(cardRefs.current[1]!, parentRect, "left"),
          a2: commonStartPoint,
          b2: getAnchor(cardRefs.current[2]!, parentRect, "right"),
          a3: commonStartPoint,
          b3: getAnchor(cardRefs.current[3]!, parentRect, "top"),
        });
      }
    }
  };

  useEffect(() => {
    recompute();
    const ro = new ResizeObserver(() => recompute());
    if (containerRef.current) ro.observe(containerRef.current);
    cardRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
      timeouts.current.forEach((id) => clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    timeouts.current.forEach((id) => clearTimeout(id));
    pathRefs.current.forEach((pathEl) => {
      if (!pathEl) return;
      pathEl.style.transition = "none";
      const totalLen = Math.ceil(pathEl.getTotalLength?.() ?? 0);
      pathEl.style.strokeDasharray = `${totalLen}`;
      pathEl.style.strokeDashoffset = `${totalLen}`;
      pathEl.style.opacity = "0";
      pathEl.getBoundingClientRect();
    });

    let delay = 80;
    pathRefs.current.forEach((pathEl) => {
      if (!pathEl) return;
      const id = window.setTimeout(() => {
        pathEl.style.transition = `stroke-dashoffset ${ANIM_DURATION}ms ${EASE}, opacity 1s ease`;
        pathEl.style.opacity = "1";
        pathEl.style.strokeDashoffset = "0";
      }, delay);
      timeouts.current.push(id);

      if (isMobile) {
        delay += ANIM_DURATION;
      }
    });

    return () => timeouts.current.forEach((id) => clearTimeout(id));
  }, [points]);

  const makePath = (a: Point, b: Point, i: number) => {
    if (!a || !b) return "";

    if (isMobile) {
      if (i === 0) {
        const cp1 = { x: a.x, y: a.y + 80 };
        const cp2 = { x: b.x - 80, y: b.y };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
      if (i === 1) {
        const cp1 = { x: a.x, y: a.y + 100 };
        const cp2 = { x: b.x - 100, y: b.y };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
      if (i === 2) {
        const cp1 = { x: a.x, y: a.y + 80 };
        const cp2 = { x: b.x - 80, y: b.y };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
    } else {
      if (i === 0) {
        const cp1 = { x: a.x, y: a.y + 150 };
        const cp2 = { x: b.x + 150, y: b.y };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
      if (i === 1) {
        const cp1 = { x: a.x, y: a.y + 150 };
        const cp2 = { x: b.x - 150, y: b.y };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
      if (i === 2) {
        const cp1 = { x: a.x, y: a.y + 250 };
        const cp2 = { x: b.x, y: b.y - 250 };
        return `M ${a.x},${a.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${b.x},${b.y}`;
      }
    }
    return "";
  };

  const paths = [
    makePath(points.a1!, points.b1!, 0),
    makePath(points.a2!, points.b2!, 1),
    makePath(points.a3!, points.b3!, 2),
  ];

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
      {/* TODO fix this mess */}
      {/* {powers.length >= 4 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {paths.map((d, i) => (
            <path
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={d}
              fill="none"
              strokeWidth={1}
              strokeLinecap="round"
              stroke="currentColor"
              style={{ opacity: 0 }}
            />
          ))}
        </svg>
      )} */}
    </div>
  );
}
