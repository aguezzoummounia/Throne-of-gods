"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

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
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // tl.to(imageRef.current, {
      //   scale: 1,
      //   autoAlpha: 1,
      //   duration: 0.8,
      //   ease: "power2.inOut",
      //   filter: "brightness(100%)",
      // });
      // tl.fromTo(
      //   imageContainerRef.current,
      //   {
      //     clipPath: "inset(0 0 100% 0)", // hidden (clipped from bottom)
      //   },
      //   {
      //     clipPath: "inset(0 0 0% 0)", // hidden (clipped from bottom)
      //     duration: 0.8,
      //     ease: "power2.inOut",
      //   }
      // );

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
        "-=.15"
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
        "-=.15"
      );
      return () => {
        pSplit.revert();
        h2Split.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-svh relative overflow-clip backdrop-blur-3xl bg-blurred"
    >
      <Image
        src={image}
        width={1920}
        height={1080}
        ref={imageRef}
        alt={`Portrait of ${name}`}
        className="w-full h-full object-cover transform-origin-center"
      />
      <div className="absolute bottom-0 left-0 w-full pt-20 md:pb-14 pb-10 px-12 max-md:px-5 bg-gradient-to-t from-black via-zinc-900/60 to-transparent flex items-center justify-center">
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
