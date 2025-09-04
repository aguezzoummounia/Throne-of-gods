"use client";
import gsap from "gsap";
import { useRef } from "react";
import Text from "../../ui/text";
import { Power } from "@/lib/types";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import Container from "../../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";
import PowersContainer from "./powers-container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const CharacterPowers: React.FC<{ data: Power[] }> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const split = new SplitText(titleRef.current, {
        type: "chars",
        smartWrap: true,
      });

      gsap.from(split.chars, {
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

      return () => {
        split.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <Container
      as="section"
      ref={containerRef}
      className="flex flex-col md:gap-20 gap-14 min-h-fit"
    >
      <Text ref={titleRef} as="h2" variant="title" className="mx-auto">
        Relics of Power
      </Text>
      <PowersContainer powers={data} />
    </Container>
  );
};

export default CharacterPowers;
