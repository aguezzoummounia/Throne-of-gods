"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { VillainStats } from "@/lib/types";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CharacterStat: React.FC<{ stats: VillainStats }> = ({ stats }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });
      tl.from(".stats-row-animated", {
        autoAlpha: 0, // Start invisible and faded
        y: 10,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2, // Stagger each div by 0.2s for a wave effect
      });
    },
    { scope: containerRef }
  );
  return (
    <div ref={containerRef} className="max-w-[40rem] md:pb-6">
      <div className="grid gap-2">
        <StatRow title="Status" value={stats.status} />
        <StatRow title="Age" value={stats.age} />
        <StatRow title="Alignment" value={stats.alignment} />
        <StatRow title="Faction" value={stats.faction} />
        <StatRow title="Location" value={stats.location} />
        <StatRow title="Race" value={stats.race} />
        <StatRow title="Role" value={stats.role} />
      </div>
    </div>
  );
};

export default CharacterStat;

const StatRow: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="stats-row-animated grid md:grid-cols-[55px_auto_1fr] grid-cols-[60px_1fr] gap-1.5 uppercase">
      <Text
        as="span"
        variant="xs"
        className="text-[10px] leading-none font-alegreya"
      >
        {title}
      </Text>
      <div className="md:flex hidden items-center justify-center max-w-[200px]">
        <SVGLine />
      </div>
      <Text
        as="span"
        variant="xs"
        className="text-[10px] leading-none font-alegreya"
      >
        {value}
      </Text>
    </div>
  );
};

const SVGLine: React.FC = () => {
  return (
    <svg
      className="w-full h-full text-bronze drop-shadow-[0_0_4px_rgba(244,234,143,.3)]"
      viewBox="0 0 208 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="202.5"
        y1="6.5"
        x2="3.5"
        y2="6.5"
        stroke="currentColor"
        stroke-linecap="square"
        strokeDasharray="1 2 3 4"
      />
      <circle cx="3.5" cy="6.5" r="3.5" fill="currentColor" />
      <circle cx="204.5" cy="6.5" r="3.5" fill="currentColor" />
      <rect
        x="111"
        y="6.53418"
        width="5"
        height="5"
        transform="rotate(-45 111 6.53418)"
        fill="currentColor"
      />
      <rect
        x="87"
        y="6.53418"
        width="5"
        height="5"
        transform="rotate(-45 87 6.53418)"
        fill="currentColor"
      />
      <rect
        x="96"
        y="6.36328"
        width="9"
        height="9"
        transform="rotate(-45 96 6.36328)"
        fill="currentColor"
      />
    </svg>
  );
};
