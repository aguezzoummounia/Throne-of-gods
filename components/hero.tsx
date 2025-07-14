"use client";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import WavyImage from "./ui/wavy-image";

const Hero: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2, // Add 0.15s delay to the entire animation
      });

      tl.from(".hero-title", { opacity: 0, y: 20, duration: 1.2 }).from(
        ".hero-button",
        { opacity: 0, y: 15, duration: 0.8 },
        "-=0.7"
      );
    },
    { scope: container }
  );

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Background 3D Image */}
      <div className="absolute inset-0 z-0 flex md:items-center items-start md:pt-0 pt-24 justify-center">
        <div className="md:w-[70%] w-[90%] md:aspect-video aspect-[2/3]">
          <WavyImage imageUrl="https://picsum.photos/1200/800?grayscale&blur=2" />
        </div>
      </div>

      {/* Foreground Content */}
      <div
        ref={container}
        className="relative z-10 w-full h-full flex-col flex md:items-center items-start md:justify-center justify-end px-12 max-md:px-6 pb-8  md:gap-10 gap-6"
        // pointer-events-none TODO: fix this later
      >
        <h1 className="text-2xl md:text-6xl text-primary md:text-center hero-title">
          When the gods fall,
          <br /> who will rise?
        </h1>
        <button className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-200 hover:opacity-75 cursor-pointer md:self-auto self-end align-bottom hero-button">
          Watch the trailer
          {/*   transition-opacity duration-300 ease-in-out*/}
        </button>
      </div>
      {/* <div
        className="absolute inset-0 z-20 pointer-events-none opacity-25"
        style={{
          backgroundImage: "url(/grain.png)",
          backgroundRepeat: "repeat",
        }}
      ></div> */}
    </div>
  );
};

export default Hero;
