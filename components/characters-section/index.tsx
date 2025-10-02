"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import WEBGLSlider from "./webgl-slider";
import Container from "../global/container";
import ScrollTrigger from "gsap/ScrollTrigger";
import EmblaCharacterSlider from "../embla-characters-slider/character-slider";
import { useMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const CharactersSection = () => {
  const isMobile = useMobile();
  const container = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
        },
      });

      const h2Split = new SplitText(h2Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            yPercent: 100,
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out",
          });
          tl.add(splitTween);
          return splitTween;
        },
      });

      return () => {
        h2Split.revert();
      };
    },
    { scope: container }
  );

  return (
    <Container
      as="section"
      id="characters"
      ref={container}
      className="md:px-0 px-0 flex gap-10 max-md:gap-4 flex-col min-h-fit md:pt-24 pt-16 scroll-m-10"
    >
      <Text
        as="h2"
        ref={h2Ref}
        variant="lead"
        className="max-w-[768px] w-full max-md:mx-auto max-md:text-center px-12 max-md:px-5"
      >
        But no story shall live without the ones who walk it. These are the
        cursed, the chosen, and the condemned
      </Text>
      {isMobile ? <EmblaCharacterSlider /> : <WEBGLSlider />}
    </Container>
  );
};

export default CharactersSection;
