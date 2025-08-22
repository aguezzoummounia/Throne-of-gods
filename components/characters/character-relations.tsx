"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { useRef, useState } from "react";
import Container from "../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";
import CharacterAffiliationCard from "./character-affiliation-card";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CharacterRelationProps {
  data: {
    allies: string;
    enemies: string;
  };
}

const CharacterRelation: React.FC<CharacterRelationProps> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const h4Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [selected, setSelected] = useState("allies");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      const h4Split = new SplitText(h4Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      // animate main header
      tl.from(h4Split.lines, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "expo.out",
      });
      return () => {
        h4Split.revert();
      };
    },
    { scope: containerRef }
  );
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      // P lines mask animation
      tl.from(
        pSplit.lines,
        {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.1,
        },
        0.3
      );
      return () => {
        pSplit.revert();
      };
    },
    { scope: containerRef, dependencies: [selected] }
  );

  return (
    <Container
      as="section"
      ref={containerRef}
      className="flex flex-col justify-center md:gap-20 gap-16 min-h-fit"
    >
      <Text
        as="h4"
        ref={h4Ref}
        variant="lead"
        className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto text-center md:mt-12 mt-4"
      >
        Behind the image and the years lies the truth. Every villain is measured
        by the strength of their allies and the hatred of their enemies.
      </Text>
      <div className="grid md:gap-20 gap-16">
        <div className="flex md:gap-20 gap-6 w-full justify-center">
          <CharacterAffiliationCard
            isActive={selected === "allies"}
            onClick={() => setSelected("allies")}
          />
          <CharacterAffiliationCard
            type="enemies"
            isActive={selected === "enemies"}
            onClick={() => setSelected("enemies")}
          />
        </div>
        <div className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto text-center md:min-h-[200px] min-h-[100px]">
          <Text as="p" ref={pRef} variant="lead" key={selected}>
            {selected === "allies" ? data.allies : data.enemies}
          </Text>
        </div>
      </div>
    </Container>
  );
};

export default CharacterRelation;
