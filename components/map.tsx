"use client";
import gsap from "gsap";
import Text from "./ui/text";
import { useRef } from "react";
import MapCard from "./map/map-card";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import Container from "./global/container";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Map: React.FC = () => {
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const h2Split = new SplitText(h2Ref.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.lines, {
            autoAlpha: 0,
            stagger: 0.2,
            duration: 1.2,
            yPercent: 100,
            ease: "expo.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
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
            stagger: 0.2,
            duration: 1.2,
            yPercent: 100,
            ease: "expo.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
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
      id="ereosa"
      as="section"
      ref={containerRef}
      className="min-h-screen px-0 max-md:px-0 grid md:gap-20 gap-14 md:pt-24 pt-16 scroll-m-10"
    >
      <div className="grid gap-8 max-w-[600px] w-full mx-auto text-center max-md:px-5">
        <Text as="h2" ref={h2Ref} variant="lead">
          Erosea, where empires broke the gods, the sea wears a Veil, and a
          storm-forged heir walks between kingdoms.
        </Text>

        <Text as="p" ref={pRef}>
          This is a continent that still bears the wounds of the Age of Divine
          Unity, where mountains melted, seas reshaped, and coastlines sealed
          behind the Veil. From Galeeria’s frozen north to Valemyra’s green
          heart and Eternea’s fractured deserts, each region holds pieces of the
          prophecy and clues to Kaen’s return. Click a region to reveal its
          history.
        </Text>
      </div>

      <MapCard />
    </Container>
  );
};

export default Map;
