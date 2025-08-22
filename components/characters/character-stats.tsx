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
      <div className="grid gap-1.5">
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
    <div className="stats-row-animated grid md:grid-cols-[50px_auto_1fr] grid-cols-[60px_1fr] gap-1.5 uppercase">
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
      fill="none"
      viewBox="0 0 94 6"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="2"
        width="94"
        height="2"
      >
        <path
          d="M0 3.21987C15.5054 2.90106 31.0078 2.98272 46.5103 2.84975C62.0127 2.98063 77.5152 2.89896 93.0177 3.21987C77.5152 3.54077 62.0127 3.45911 46.5103 3.58789C31.0078 3.45911 15.5054 3.53868 0 3.21987Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_839_1662)">
        <path
          d="M0 3.21987C15.5054 2.90106 31.0078 2.98272 46.5103 2.84975C62.0127 2.98063 77.5152 2.89896 93.0177 3.21987C77.5152 3.54077 62.0127 3.45911 46.5103 3.58789C31.0078 3.45911 15.5054 3.53868 0 3.21987Z"
          fill="url(#paint0_linear_839_1662)"
        />
      </g>
      <mask
        id="mask1_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="42"
        y="0"
        width="9"
        height="7"
      >
        <path
          d="M46.4634 6.00098L42.6992 3.21962L46.4634 0.436695L50.2241 3.21962L46.4634 6.00098Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask1_839_1662)">
        <path
          d="M46.4634 6.00098L42.6992 3.21962L46.4634 0.436695L50.2241 3.21962L46.4634 6.00098Z"
          fill="url(#paint1_linear_839_1662)"
        />
      </g>
      <mask
        id="mask2_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="36"
        y="2"
        width="3"
        height="3"
      >
        <path
          d="M37.5598 4.0791L36.3989 3.22004L37.5598 2.36098L38.72 3.22004L37.5598 4.0791Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask2_839_1662)">
        <path
          d="M37.5598 4.0791L36.3989 3.22004L37.5598 2.36098L38.72 3.22004L37.5598 4.0791Z"
          fill="url(#paint2_linear_839_1662)"
        />
      </g>
      <mask
        id="mask3_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="39"
        y="2"
        width="4"
        height="3"
      >
        <path
          d="M40.6902 4.42383L39.0603 3.21926L40.6902 2.01259L42.3208 3.21926L40.6902 4.42383Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask3_839_1662)">
        <path
          d="M40.6902 4.42383L39.0603 3.21926L40.6902 2.01259L42.3208 3.21926L40.6902 4.42383Z"
          fill="url(#paint3_linear_839_1662)"
        />
      </g>
      <mask
        id="mask4_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="54"
        y="2"
        width="3"
        height="3"
      >
        <path
          d="M55.4554 4.0791L56.6241 3.22004L55.4554 2.36098L54.2974 3.22004L55.4554 4.0791Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask4_839_1662)">
        <path
          d="M55.4554 4.0791L56.6241 3.22004L55.4554 2.36098L54.2974 3.22004L55.4554 4.0791Z"
          fill="url(#paint4_linear_839_1662)"
        />
      </g>
      <mask
        id="mask5_839_1662"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="50"
        y="2"
        width="4"
        height="3"
      >
        <path
          d="M52.3301 4.42383L53.9571 3.21926L52.3301 2.01259L50.6995 3.21926L52.3301 4.42383Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask5_839_1662)">
        <path
          d="M52.3301 4.42383L53.9571 3.21926L52.3301 2.01259L50.6995 3.21926L52.3301 4.42383Z"
          fill="url(#paint5_linear_839_1662)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_839_1662"
          x1="46.5103"
          y1="2.84975"
          x2="46.5103"
          y2="3.59035"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_839_1662"
          x1="46.462"
          y1="0.436696"
          x2="46.462"
          y2="6.00291"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_839_1662"
          x1="37.5612"
          y1="2.36098"
          x2="37.5612"
          y2="4.07887"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_839_1662"
          x1="40.6902"
          y1="2.01311"
          x2="40.6902"
          y2="4.42517"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_839_1662"
          x1="55.4597"
          y1="2.36098"
          x2="55.4597"
          y2="4.07887"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_839_1662"
          x1="52.3301"
          y1="2.01311"
          x2="52.3301"
          y2="4.42517"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E1AF3C" />
          <stop offset="0.114213" stopColor="#E1AF3C" />
          <stop offset="0.479695" stopColor="#D5A533" />
          <stop offset="1" stopColor="#AF7522" />
        </linearGradient>
      </defs>
    </svg>
  );
};
