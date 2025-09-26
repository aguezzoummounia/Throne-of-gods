"use client";
import { gsap } from "gsap";
import Text from "../ui/text";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { aboutData } from "@/lib/data";
import SplitText from "gsap/SplitText";
import { useRef, useState } from "react";
import AboutChapter from "./about-chapter";
import Container from "../global/container";
import MaskProgress from "./scroll-progress";
import AboutBackground from "./about-background";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutSelectorCard from "./about-selector-card";
import { AboutSVG1, AboutSVG2, AboutSVG3 } from "../svgs/about-svgs";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  // main text animation hook
  useGSAP(
    () => {
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: { amount: 0.6, from: "random" },
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 40%",
            },
          });
          return splitTween;
        },
      });
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            yPercent: 100,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 30%",
            },
          });
          return splitTween;
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
      id="about"
      as="section"
      ref={containerRef}
      className="relative grid grid-rows-[1fr_auto] gap-8 scroll-m-10"
    >
      {/* Background svg elements */}
      <AboutBackground>
        <MaskProgress index={chapterIndex + 1} />
      </AboutBackground>

      <div className="md:py-8 py-4 flex flex-col items-center justify-center gap-10 text-center">
        <Text
          as="h2"
          ref={h2Ref}
          variant="title"
          className="max-w-[768px] mx-auto "
        >
          Welcome to Erosea
        </Text>
        <Text
          as="p"
          ref={pRef}
          className="uppercase lg:max-w-[768px] max-w-[600px] mx-auto"
        >
          A realm forged and fractured by divine power and mortal ambition.
          Fractured loyalties, whispered prophecies, and battles between faith,
          power, and fate itself. This is a story of rebirth, of ancient secrets
          rising, and of a tempest that may either shatter the world anew… or
          crown its rightful soul.
        </Text>
      </div>

      <AboutChapter
        activeIndex={chapterIndex}
        title={aboutData[chapterIndex].title}
        brief={aboutData[chapterIndex].brief}
        details={aboutData[chapterIndex].details}
        image={aboutData[chapterIndex].image}
      />
      <div className="flex items-center justify-center md:gap-6 gap-4 pb-14 md:pt-8 pt-4">
        <AboutSelectorCard
          className={cn("hover:-rotate-2")}
          isActive={chapterIndex === 0}
          title="The Age of Divine Unity"
          onClick={() => setChapterIndex(0)}
        >
          <AboutSVG1 />
        </AboutSelectorCard>
        <AboutSelectorCard
          isActive={chapterIndex === 1}
          title="Age of The Veil & the Deep"
          onClick={() => setChapterIndex(1)}
        >
          <AboutSVG2 />
        </AboutSelectorCard>
        <AboutSelectorCard
          className={cn("hover:rotate-2")}
          isActive={chapterIndex === 2}
          title="Age of The Prophecy & the Heir"
          onClick={() => setChapterIndex(2)}
        >
          <AboutSVG3 />
        </AboutSelectorCard>
      </div>
    </Container>
  );
};
export default About;
