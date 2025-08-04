"use client";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/button-or-link";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.1,
      });

      const words = gsap.utils.toArray(".animated-word");
      const button = containerRef.current?.querySelector("a");
      const paragraph = containerRef.current?.querySelector("p");
      const subheading = containerRef.current?.querySelector("h4");

      // Animate h2 divs (from bottom, staggered)
      tl.from(words, {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
      });

      const betweenGroupsDelay = "+=0.15";

      // Animate h4, p, button in a single staggered group
      const secondGroup: Element[] = [];
      if (subheading) secondGroup.push(subheading);
      if (paragraph) secondGroup.push(paragraph);
      if (button) secondGroup.push(button);

      if (secondGroup.length) {
        tl.from(
          secondGroup,
          {
            y: 25,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2, // Match h2 animation duration
          },
          betweenGroupsDelay
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="min-h-screen relative">
      <Image
        width={1980}
        height={1024}
        src="/bg/bg-1.webp"
        alt="background dark blue image"
        className="absolute inset-0 object-cover w-full h-full z-0 object-center"
      />
      <div className="absolute inset-0 object-cover w-full h-full z-1 md:gap-20 grid grid-rows-[1fr_auto] md:py-16 py-8 text-primary">
        <h2 className="hero-title lg:text-9xl md:text-8xl text-[15vw] leading-none font-cinzel font-bold lg:max-w-[768px] max-w-[90%] lg:self-end self-center justify-self-center md:mt-0 mt-20 text-[#796f65]">
          <div className="animated-word md:text-7xl text-4xl ml-10">Your</div>
          <div className="animated-word">Epic Quest</div>
          <div className="animated-word text-center">Begins</div>
          <div className="animated-word md:text-7xl text-4xl text-end mr-10">
            Here
          </div>
        </h2>

        <div className="flex flex-col items-center justify-center gap-4 max-w-[600px] w-[90%] mx-auto ">
          <p className="uppercase  md:text-base leading-[1.125] text-base text-center mb-4">
            Plunge into a realm of divine power and shadowed secrets, where
            empires rise and fall in a clash of fate and fury.
            <br className="md:block hidden" /> Ready to unravel the mystery?
          </p>

          <Button
            animated
            target="_blank"
            href="https://youtu.be/ctfNQvJssVo?si=Mtqscdb6Ajjkm1YY"
          >
            Watch the trailer now!
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
