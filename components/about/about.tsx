"use client";
import { gsap } from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import AboutChapter from "./about-chapter";
import Container from "../global/container";
import MaskProgress from "./scroll-progress";
import AboutBackground from "./about-background";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProgressRef } from "./scroll-progress";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const stripRef = useRef<ScrollProgressRef | null>(null);

  const updateProgress = (n: number) => {
    const clamped = Math.max(0, Math.min(1, n));
    stripRef.current?.setProgress(clamped);
  };
  // horizontal scroll hook
  useGSAP(
    () => {
      if (!contentRef.current) return;

      const getScrollDistance = () =>
        Math.max(0, contentRef.current!.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(contentRef.current, {
        x: () => -getScrollDistance(), // Use a function for responsiveness
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true, // This is key for responsiveness
          onUpdate: (self) => {
            updateProgress(self.progress);
          },
          onRefresh: (self) => {
            // on refresh recompute progress (important if there's no scroll distance)
            updateProgress(self.progress ?? 0);
          },
        },
      });

      // ensure progress initialized (if there's no scroll distance this will still show 0)
      const st = horizontalTween.scrollTrigger as ScrollTrigger;
      if (st) updateProgress(st.progress ?? 0);

      const panels = gsap.utils.toArray(".gsap-panel");

      panels.forEach((panel) => {
        const texts = (panel as HTMLElement).querySelectorAll(".gsap-zoom-in");
        if (texts.length > 0) {
          gsap.from(texts, {
            scale: 0.1,
            autoAlpha: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              containerAnimation: horizontalTween,
              trigger: panel as gsap.DOMTarget,
              start: "left 80%",
              end: "left 20%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: containerRef }
  );

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
            autoAlpha: 0,
            yPercent: 100,
            stagger: { amount: 0.8 },
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
      className="relative overflow-hidden w-full h-screen md:px-0 max-md:px-0"
    >
      {/* Background svg elements */}
      <AboutBackground>
        <MaskProgress ref={stripRef} />
      </AboutBackground>

      {/* Content */}
      <div className="w-full h-screen overflow-hidden">
        <div
          ref={contentRef}
          className="h-full inline-flex items-center will-change-transform"
        >
          <div className="gsap-panel flex flex-col items-center justify-center gap-10 text-center w-screen px-12 max-md:px-5">
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
              Fractured loyalties, whispered prophecies, and battles between
              faith, power, and fate itself. This is a story of rebirth, of
              ancient secrets rising, and of a tempest that may either shatter
              the world anew… or crown its rightful soul.
            </Text>
          </div>

          <AboutChapter
            title="The Age of Divine Unity"
            brief="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
            details="Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep. Three emperors, one faith broken. Their corruption birthed wars that tore Erosea and summoned beings from the deep."
            image="/images/characters/character-9.jpeg"
          />
          <AboutChapter
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
          />
        </div>
      </div>
    </Container>
  );
};
export default About;
