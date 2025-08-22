"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface CharacterHeroProps {
  name: string;
  image: string;
  nickname: string;
}

const CharacterHero: React.FC<CharacterHeroProps> = ({
  name,
  image,
  nickname,
}) => {
  // TODO: add image shader loader
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.to(
        imageRef.current,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power2.inOut",
          filter: "brightness(100%)",
        },
        0 // Position parameter: start at the beginning of the timeline
      );

      const pSplit = new SplitText(pRef.current, {
        type: "chars",
        smartWrap: true,
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
      });
      // Immediately set visibility to allow proper splitting/position calc, but keep opacity 0 via from tween
      gsap.set([pRef.current, h2Ref.current], { visibility: "visible" });
      // P lines mask animation
      tl.from(
        pSplit.chars,
        {
          autoAlpha: 0,
          stagger: {
            amount: 0.8,
            from: "random",
          },
        },
        1
      );

      // button animation
      tl.from(
        h2Split.chars,
        {
          autoAlpha: 0,
          stagger: {
            amount: 0.8,
            from: "random",
          },
        },
        0.25
      );
      return () => {
        pSplit.revert();
        h2Split.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full h-svh relative overflow-clip">
      <Image
        src={image}
        width={1920}
        ref={imageRef}
        height={1080}
        alt={`Portrait of ${name}`}
        className="w-full h-full object-cover transform-origin-center scale-150 invisible brightness-130"
      />
      <div className="absolute bottom-0 left-0 w-full pt-20 md:pb-14 pb-10 px-12 max-md:px-5 bg-gradient-to-t from-black via-zinc-900/70 to-transparent flex items-center justify-center">
        <header className="gap-4 flex flex-col items-center justify-center lg:w-[58.33%] xs:w-[83.33%] w-full text-center">
          <Text ref={pRef} as="p" className="font-alegreya invisible">
            {nickname}
          </Text>
          <Text as="h2" ref={h2Ref} variant="title" className="invisible">
            {name}
          </Text>
        </header>
      </div>
    </div>
  );
};

export default CharacterHero;
