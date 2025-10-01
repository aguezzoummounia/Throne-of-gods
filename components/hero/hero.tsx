"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { trailer_url } from "@/lib/consts";
import { useMobile } from "@/hooks/use-mobile";
import HeroBackground from "./hero-background";
import ScrollTrigger from "gsap/ScrollTrigger";
import Button from "@/components/ui/button-or-link";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const Hero: React.FC = () => {
  const pRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMobile();

  useGSAP(
    () => {
      // Use matchMedia to detect non-mobile devices (768px and up)
      const mediaQuery = window.matchMedia("(min-width: 768px)");

      if (!mediaQuery.matches) {
        // On mobile, ensure all elements are visible
        gsap.set([".first-word", ".second-word", ".third-word", ".last-word"], {
          autoAlpha: 1,
          x: 0,
          y: 0,
          yPercent: 0,
        });
        if (pRef.current) {
          gsap.set(pRef.current, { autoAlpha: 1 });
        }
        if (buttonRef.current) {
          gsap.set(buttonRef.current, { autoAlpha: 1, y: 0 });
        }
        return;
      }

      // Desktop animations
      const tl = gsap.timeline();

      const first_word = gsap.utils.toArray(".first-word");
      const second_word = gsap.utils.toArray(".second-word");
      const third_word = gsap.utils.toArray(".third-word");
      const fourth_word = gsap.utils.toArray(".last-word");

      tl.from(first_word, {
        yPercent: -100,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power1.out",
      })
        .from(
          second_word,
          {
            yPercent: 100,
            autoAlpha: 0,
            duration: 1.2,
            ease: "power1.out",
          },
          "-=.6"
        )
        .from(
          third_word,
          {
            x: -30,
            autoAlpha: 0,
            duration: 1.2,
            ease: "power1.out",
          },
          "-=.6"
        )
        .from(
          fourth_word,
          {
            x: 100,
            autoAlpha: 0,
            duration: 1.2,
            ease: "power1.out",
          },
          "-=.6"
        );

      if (pRef.current) {
        const pSplit = new SplitText(pRef.current, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            let splitTween = gsap.from(self.lines, {
              duration: 1.2,
              yPercent: 100,
              autoAlpha: 0,
              stagger: 0.2,
              ease: "expo.out",
            });
            tl.add(splitTween, "<");
            return splitTween;
          },
        });

        // Cleanup function for SplitText
        return () => {
          pSplit.revert();
        };
      }

      tl.from(
        buttonRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=.8"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen md:gap-20 grid grid-rows-[1fr_auto] md:py-16 py-8 max-md:pb-12 max-md:px-5 relative"
    >
      <HeroBackground />
      <h2 className="hero-title lg:text-9xl md:text-8xl text-[15vw] leading-none font-cinzel font-bold max-w-[768px] w-full lg:self-end self-center justify-self-center md:mt-0 mt-20 text-[#fffff7]/80">
        <div
          className={`animated-word first-word md:text-7xl text-4xl ml-10 ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          Your
        </div>
        <div
          className={`animated-word second-word ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          Epic Quest
        </div>
        <div
          className={`animated-word third-word text-center ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          Begins
        </div>
        <div
          className={`animated-word last-word md:text-7xl text-4xl text-end mr-10 ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          Here
        </div>
      </h2>
      <div className="flex flex-col items-center justify-center gap-4 max-w-[600px] w-full mx-auto">
        <Text
          ref={pRef}
          className={`uppercase text-center mb-4 ${
            isMobile ? "opacity-100" : ""
          }`}
        >
          Plunge into a realm of divine power and shadowed secrets, where
          empires rise and fall in a clash of fate and fury. Ready to unravel
          the mystery?
        </Text>
        <Button
          ref={buttonRef}
          animated
          target="_blank"
          href={trailer_url}
          className={isMobile ? "opacity-100" : ""}
        >
          Watch the trailer now!
        </Button>
      </div>
    </section>
  );
};

export default Hero;
