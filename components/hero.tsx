"use client";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/button-or-link";
import AnimatedText from "@/components/ui/animated-text";
// import WavyImage from "./ui/wavy-image";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  // const container = useRef<HTMLDivElement>(null);
  // useGSAP(
  //   () => {
  //     const lines = containerRef.current?.querySelectorAll("div");
  //     if (!lines) return;

  //     gsap.set(lines, { y: 60, opacity: 0 });

  //     gsap.to(lines, {
  //       y: 0,
  //       opacity: 1,
  //       duration: 1,
  //       ease: "power4.out",
  //       stagger: 0.15,
  //       // scrollTrigger: {
  //       //   trigger: containerRef.current,
  //       //   start: "top 80%",
  //       //   toggleActions: "play none none none",
  //       // },
  //     });
  //   },
  //   { scope: containerRef }
  // );

  // useGSAP(
  //   () => {
  //     const tl = gsap.timeline({
  //       defaults: { ease: "power3.out" },
  //       delay: 0.2,
  //     });

  //     tl.from(".hero-title", { opacity: 0, y: 20, duration: 1.2 }).from(
  //       ".hero-button",
  //       { opacity: 0, y: 15, duration: 0.8 },
  //       "-=0.7"
  //     );
  //   },
  //   { scope: container }
  // );

  return (
    <section className="min-h-screen flex justify-center items-center relative">
      <AnimatedText>
        <h2
          // ref={containerRef}
          className="md:text-9xl text-6xl font-cinzel font-bold  max-w-[768px]"
        >
          <div className="md:text-7xl text-4xl ml-10">Your</div>
          <div>Epic Quest</div>
          <div className="text-center">Begins</div>
          <div className="md:text-7xl text-4xl text-end mr-10">Here</div>
        </h2>
      </AnimatedText>

      <div className="flex flex-col items-center justify-center gap-4 absolute inset-[auto_0%_3rem] max-w-[768px] w-[90%] mx-auto text-[#D5A962]">
        <AnimatedText>
          <h4 className="uppercase  md:text-base text-sm text-center">
            Welcome
          </h4>
        </AnimatedText>
        <AnimatedText>
          <p className="uppercase  md:text-base text-sm text-center mb-4">
            Courageous explorer, plunge into a realm of divine power and
            shadowed secrets, where empires rise and fall in a clash of fate and
            fury.
            <br />
            Ready to unravel the mystery?
          </p>
        </AnimatedText>

        <Button
          animated
          target="_blank"
          href="https://youtu.be/ctfNQvJssVo?si=Mtqscdb6Ajjkm1YY"
        >
          Watch the trailer now!
        </Button>
      </div>
    </section>
  );
};

export default Hero;

// <WavyImage imageUrl="https://picsum.photos/1200/800?grayscale&blur=2" />
