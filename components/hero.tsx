"use client";
import gsap from "gsap";
import Text from "./ui/text";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import { trailer_url } from "@/lib/consts";
import ScrollTrigger from "gsap/ScrollTrigger";
import Button from "@/components/ui/button-or-link";

gsap.registerPlugin(SplitText, ScrollTrigger);

const Hero: React.FC = () => {
  const pRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      const words = gsap.utils.toArray(".animated-word");
      const pSplit = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      // animate main headerautoSplit: true,
      tl.from(words, {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
      });

      // P lines mask animation
      tl.from(
        pSplit.lines,
        {
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          yPercent: 100,
          ease: "expo.out",
        },
        0.15
      );

      // button animation
      tl.from(
        buttonRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        0.3
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="min-h-screen md:gap-20 grid grid-rows-[1fr_auto] md:py-16 py-8 max-md:pb-12 max-md:px-5 relative"
    >
      <h2 className="hero-title lg:text-9xl md:text-8xl text-[15vw] leading-none font-cinzel font-bold max-w-[768px] w-full lg:self-end self-center justify-self-center md:mt-0 mt-20 text-[#796f65]">
        <div className="animated-word md:text-7xl text-4xl ml-10">Your</div>
        <div className="animated-word">Epic Quest</div>
        <div className="animated-word text-center">Begins</div>
        <div className="animated-word md:text-7xl text-4xl text-end mr-10">
          Here
        </div>
      </h2>
      <div className="flex items-center justify-center absolute inset-0 -z-1">
        <Image
          width={1000}
          height={1000}
          alt="hero image"
          className="object-cover"
          src="/images/spheres/green-sphere.png"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 max-w-[600px] w-full mx-auto">
        <Text ref={pRef} className="uppercase text-center mb-4">
          Plunge into a realm of divine power and shadowed secrets, where
          empires rise and fall in a clash of fate and fury. Ready to unravel
          the mystery?
        </Text>
        <Button ref={buttonRef} animated target="_blank" href={trailer_url}>
          Watch the trailer now!
        </Button>
      </div>
    </section>
  );
};

export default Hero;
