"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { VillainStats } from "@/lib/types";
import Container from "../global/container";
import CharacterStat from "./character-stats";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const CharacterOverview: React.FC<{
  quote: string;
  overview: string;
  stats: VillainStats;
}> = ({ quote, overview, stats }) => {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });

      gsap.from(h2Split.chars, {
        autoAlpha: 0,
        stagger: {
          amount: 0.8,
          from: "random",
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%", // parent enters viewport
        },
      });

      // Paragraph animation (independent trigger at 30%)
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      gsap.from(pSplit.lines, {
        yPercent: 100,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: pRef.current,
          start: "top 90%", // adjust for ~30% in viewport
        },
      });

      return () => {
        h2Split.revert();
        pSplit.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <Container
      as="section"
      ref={containerRef}
      className="flex flex-col justify-center md:gap-32 gap-20 mt-20"
    >
      <div className="lg:w-[83.33%] w-full mx-auto max-md:flex-1 flex flex-col justify-center md:gap-32 gap-10">
        <Text as="h2" ref={h2Ref} variant="title" className="text-center">
          {quote}
        </Text>
        <Text
          as="p"
          ref={pRef}
          variant="lead"
          className="lg:w-[83.33%] w-full mx-auto text-center"
        >
          {overview}
        </Text>
      </div>
      <CharacterStat stats={stats} />
    </Container>
  );
};

export default CharacterOverview;
