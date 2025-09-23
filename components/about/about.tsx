"use client";
import { gsap } from "gsap";
import Text from "../ui/text";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import AboutChapter from "./about-chapter";
import Container from "../global/container";
import MaskProgress from "./scroll-progress";
import AboutBackground from "./about-background";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutSelectorCard from "./about-selector-card";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [chapterIndex, setChapterIndex] = useState(1);
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
      className="relative grid grid-rows-[1fr_auto] gap-8"
    >
      {/* Background svg elements */}
      <AboutBackground>
        <MaskProgress index={chapterIndex} />
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
        title="The Age of Divine Unity"
        brief="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
        details="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
        image="/images/characters/character-9.jpeg"
      />
      <div className="flex items-center justify-center gap-6 pb-14 pt-8">
        <AboutSelectorCard
          className={cn(
            "bg-green-950/50 hover:-rotate-2",
            chapterIndex === 1 && "-rotate-2 -translate-y-6"
          )}
          title="The Age of Divine Unity"
          onClick={() => setChapterIndex(1)}
        >
          1
        </AboutSelectorCard>
        <AboutSelectorCard
          className={cn(
            "bg-gray-600/50",
            chapterIndex === 2 && "-translate-y-6"
          )}
          title="Age of The Veil & the Deep"
          onClick={() => setChapterIndex(2)}
        >
          2
        </AboutSelectorCard>
        <AboutSelectorCard
          className={cn(
            "bg-yellow-900/50 hover:rotate-2",
            chapterIndex === 3 && "rotate-2 -translate-y-6"
          )}
          title="Age of The Prophecy & the Heir"
          onClick={() => setChapterIndex(3)}
        >
          3
        </AboutSelectorCard>
      </div>
      {/* <AboutChapter
        direction="rtl"
        title="The Veil & the Deep"
        image="/images/characters/character-6.jpeg"
        brief="Goddess Law sealed the deep and raised the Veil — but the Fallen Moon remembers, and she waits."
        details="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
      />
      <AboutChapter
        title="The Prophecy & the Heir"
        brief="When blood stains the earth, the Harbinger will wake the dawn. Kaen's return may be the key — or the ruin."
        details="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that  tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
        image="/images/characters/character-8.jpeg"
      /> */}
    </Container>
  );
};
export default About;
