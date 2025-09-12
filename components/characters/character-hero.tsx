"use client";
import gsap from "gsap";
import Text from "../ui/text";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import LabelText from "../ui/label-text";

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
  useGSAP(
    () => {
      const tl = gsap.timeline();

      const pSplit = new SplitText(pRef.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: {
              amount: 0.6,
              from: "random",
            },
          });
          tl.add(splitTween, "first");
          return splitTween;
        },
      });
      const h2Split = new SplitText(h2Ref.current, {
        type: "chars",
        smartWrap: true,
        autoSplit: true,
        onSplit: (self) => {
          let splitTween = gsap.from(self.chars, {
            autoAlpha: 0,
            stagger: {
              amount: 0.8,
              from: "random",
            },
          });
          tl.add(splitTween, "second");
          return splitTween;
        },
      });

      tl.addLabel("first", 0);
      tl.addLabel("second", "<");
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
        priority
        src={image}
        width={1920}
        height={1080}
        ref={imageRef}
        alt={`Portrait of ${name}`}
        className="w-full h-full object-cover transform-origin-center"
      />
      <div className="absolute bottom-0 left-0 w-full pt-20 md:pb-14 pb-10 px-12 max-md:px-5 bg-gradient-to-t from-black via-zinc-900/60 to-transparent flex items-center justify-center">
        <header className="gap-4 flex flex-col items-center justify-center lg:w-[58.33%] xs:w-[83.33%] w-full text-center">
          <LabelText className="font-alegreya">
            <p ref={pRef}>{nickname}</p>
          </LabelText>
          <Text as="h2" ref={h2Ref} variant="title">
            {name}
          </Text>
        </header>
      </div>
    </div>
  );
};

export default CharacterHero;
