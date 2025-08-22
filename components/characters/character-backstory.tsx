"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Container from "../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const CharacterBackstory: React.FC<{ data: string }> = ({ data }) => {
  const containerRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });

      // animate main header
      tl.from(h2Split.chars, {
        autoAlpha: 0,
        stagger: {
          amount: 0.8,
          from: "random",
        },
      });

      const contentDivs = contentRef.current?.querySelectorAll("p") || [];
      const lineSplits: SplitText[] = [];

      contentDivs.forEach((p) => {
        const split = new SplitText(p, {
          type: "lines",
          linesClass: "overflow-hidden",
        });
        lineSplits.push(split);
      });
      lineSplits.forEach((split) => {
        tl.from(
          split.lines,
          {
            y: 50, // Slide up from below
            opacity: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.6" // Overlap with header animation
        );
      });

      return () => {
        h2Split.revert();
        lineSplits.forEach((split) => split.revert());
      };
    },
    { scope: containerRef }
  );
  return (
    <Container
      as="section"
      ref={containerRef}
      className="lg:w-[58.33%] xs:w-[83.33%] w-full mx-auto flex md:gap-12 gap-8 flex-col items-center justify-center min-h-fit"
    >
      <Text as="h2" ref={h2Ref} variant="title">
        Chronicle of Sin
      </Text>

      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: data }}
        className="grid gap-10 font-alegreya lg:text-dynamic-lg md:text-dynamic-base max-md:text-[4vw] font-semibold leading-[1.1] text-center"
      />
    </Container>
  );
};

export default CharacterBackstory;
